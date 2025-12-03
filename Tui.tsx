import React, { useRef, useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";

// ui-Components
import UsernameComponent from "./uiComponents/username.js";
import PasswordHandler from "./uiComponents/password.js";
import CourseToggler from "./uiComponents/courses.js";
import {AssignmentMenuToggler, DisplaySubmittableAssignments} from "./uiComponents/assignments.js";
import main from "./features/main.js"; // Most important script, every class reference comes through it. This makes reference easier when it call comes from one source.
import path from "./features/path.js";

import PathChooser from "./uiComponents/directoryToggler.js"; 

// Async handlers
import handleLogin from "./asyncResponses/credentialChecker.js";

import DisplayMenu from "./uiComponents/mainUI.js";

// loading screen
import LoadingScreen from "./uiComponents/loading.js";

// Switcher
import {SimpleSwitcher} from "./tools/selectionToggler.js";

import DisplayAssignments from "./uiComponents/gradedAssignmentViewer.js"

// Footer
import InputControlsFooter from "./uiComponents/footer.js";

// Assigmnent Submission State 
import {AssignmentStatus} from "./uiComponents/fileSubmission.js";

const gradescope = new main();
const PATH = new path();
// this.pageFillers
// this.cookieStorage



async function loginState( {setLogin, setCookie, setMenu}) // This function is always loaded first, therefore, load browser should be called here.
{
  await gradescope.loadBrowser(); // https://gradescope.com/login
  
  /*

With calling this function I can use the following attributes
    this.page = the current page
    this.browser = virtual browser
    this.pageFillers = page filler class, alongside containg the reference to the current page.
    this.cookieStorage = cookie storage class, alongside containg the reference to the current page.

    For the part of keeping this project clean, and a lot of reusable code, I need these references.

  */
  
  const result = await gradescope.login();
  if (result == false) // This means There isn't a cookie to be loaded 
  {
    setLogin("login");

    // This login state is the section where the cookie is created
    setMenu("login");
  }
  else
  {
    setLogin("loadCourses");
    setMenu("main");
    //setMenu("homeworkMatching")
    setCookie(true);


    

  }

}

function App() { // This will be a  
  // Starting up the browser, the async will not allow you to set page to gradescope.page
  let [page, setPage] = useState(gradescope.page) // This is the currentPage
  let [cookie, setCookie] = useState(null); 
  let [login,setLogin] = useState("loading"); // At state loading, we're still waitng for the async func.
  let [valid, setValid] = useState(false);
  let [username,setUsername] = useState(""); // We're tracking useranme so it'll be in the main script. 
  let [password, setPassword] = useState("");
  let [tryAgain, setTryAgain] = useState(null); // this is true, crentials were wrong, therefore display error alongside restarting the process of username,password
  let [loginErrorMsg, setErrorMsg] = useState("")

  let [renderedCourses, setRender] = useState(false); // Re-rendering is a serious issue. Must fix this!
  
  let [course, setCourse] = useState(null); // This contains the href of the course. This href can be used to rediret me

  // This is a big hashtable containg hrefs referencing course data. This will be used for caching purposes. Quicker course traversals.
  let [courseData, addCourseData] = useState({});

  // Alongside courseData, synchronous code will continue to run before the href is added to the hashtable. Therefore by setting this state to true, it will not load data until it turns into false. 
  let [waiting, setWaiting] = useState(true);



  let [currentPath, setPath] = useState(null);

  // One of the most important parts of this project is saving time, therefore we'll need to store the courses we open.
  
  let [currentAssignmentDetails, setCurrentAssignmentDetails] = useState(null); 
  



  // SimpleSwitcher

  // username and password input fields. toggle between the two
  let loginOptions = ["username", "password"]; // These are the options the switching function can toggle between
  let [inputIndex, setInputIndex] = useState(0) // Due to the rerendering, we cannot store the index variable in the component  

  // assignments and graded assignments
  
  let progressMenuOptions = ["assignments", "gradedAssignments"];
  let [progressIndex, setProgressIndex] = useState(0);
  
  // This variable contains what menu choice is chosen to determine what component to display.






  let [credentialValidity, setCredentialValidity] = useState(null);
  
  // For directory Toggler
  let [displayedDirectory, changeDisplayedDirectory] = useState(PATH.currentDirectory);
  let previousDisplayed = useRef([displayedDirectory]);

  // Likewise with setError, I think taking advantage of that area would be perfect, since it basically does what ours does too.

  
  
  // [error, setError] are no longer valid, parent componenets need more interference for more functionality

  let [usernameError, setUsernameError] = useState<string | boolean>(false);
  let [passwordError, setPasswordError] = useState(false);

  
  // array of assignments that are currently in the submission state
  let [assignmentArray, setAssignmentArray] = useState([]);


  // This is for login state 
  function validateUsername()
  {
    const validity = gradescope.prompts.verifyUsername(username); // u
    if( validity.valid == false)
    {
      setUsername("");
      setValid(false);
      return validity.msg;
    }
    else // The username is valid to be submitted, however, the actual credentials haven't been determined yet.
    {
      setValid(true);

      // username is valid, move onto the password input field
      validUsername();
      return false;
    }
  };





  // These are the three states this program can be in, main to select one of the two. submit is for submitting assignments. fileChooser is for changing the path or creating a path for file submission locations.
	const [menu, setMenu] = useState<'main' | 'submit' | "loadCourses" |'fileChooser' | 'loading' | "login" | "assignments" | "gradedAssignments" | "homeworkMatching"> ('loading');
  
  // Having these states will be very benefical later on. Having different states will be easier to handle since I can now distguish current and previous proccesses. Therefore, I can create a system toggling between different states and processes.






  // Username and password functions
  const tryLogin = async () => 
  {
    // Before we can make a submission attempt of a username and password, we must first see if the username is valid enough to submit. 
    const usernameCheck = validateUsername();

    if(usernameCheck) 
    { 
      // We make a username check first to see if it's even valid enough to submit. This conditional is if it isn't 
      setInputIndex(0);
      setCredentialValidity(false);
      setPassword("");
      setUsernameError(usernameCheck);
      return; 
    }
    // The username was valid to submit the login form
    setMenu('loading');

    let success = await handleLogin({
      setTryAgain,
      setLogin,
      setValid, 
      setUsername,
      setPassword,
      username,
      password,
      page,
      setPage,
      setErrorMsg,
      inputFill : gradescope.pageFillers,
      storage : gradescope.cookieStorage,
      setCookie
    });
    

    if(!success)
    {
      // the code it requires to reset login state to focus on username input field.
      setInputIndex(0);
      setCredentialValidity(false);
      setMenu("login");
    }

    else
    { // load the courseData
      await gradescope.courseSelector();
      setMenu("main")  
    }
  };



  const validUsername = () => 
  {
  // If there is a username submission, respond to that with either an error message or a switch in the input fields
    setInputIndex(1)
  };



  const resetAll = () => 
  {
    // After all login attempts, the username inputfield becomes the main.
    // Both password and username input fields are highlighted red.
    if(!credentialValidity) 
      setCredentialValidity(null); 
  }


  React.useEffect( () => 
  {
    if (menu === "main") {
      (async () => {
        const path = await PATH.loadPath();
        setPath(path);
      })();
    }
  }, [menu])


  React.useEffect( () => 
  {
    loginState({setLogin,setCookie,setMenu});

  }, []);

  React.useEffect( () => 
  {
    if(course) // everytime course changes
    {
      setWaiting(false);
      setMenu("submit");
    }

  }, [course])

  React.useEffect( () => 
  {
    if(currentAssignmentDetails != null)
    {
      console.log("It WorkdEd!")
    }
  }, [currentAssignmentDetails])


  React.useEffect( () => 
  {
    if(!waiting)
    { // The async code is done running, the data has been found and placed in a hashtable
      setWaiting(true); // set it back to true for when another async search begins.
    }
  }, [waiting])
  

  if ( login === "loading" || menu == "loading" )
  {
      return(<LoadingScreen/>);
  }
  
  if(menu == "main")
  {
    return(
      <>
      <DisplayMenu 
          setMenu={setMenu}
          currentPath=
          { 
            // since it is an async function, we must call it as such to get its value
            currentPath
          }
        />
      
        <InputControlsFooter arrowOrientation="Horizontal"/>
      </>
    )
  }



  if(menu == "fileChooser")
  {
    /*The input commands for file chooser will be dificult to  describe, however, it will totally be different from the rest*/

    return(<PathChooser setMenu={setMenu} displayedDirectory={displayedDirectory} changeDisplayedDirectory={changeDisplayedDirectory} previousDisplayed={previousDisplayed}/>)
  }
  
  
  
    const loginRendering = () => // It's much easier with conditionals, ternary can get confusing as this project gets bigger.
  (
      <>
      <Box
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
          padding={1}
      >

      <Box width={50} flexDirection="column">
      <Text color="red" > {loginErrorMsg ? loginErrorMsg : ""} </Text>
      </Box>
        
      <SimpleSwitcher          /* Simply a controler, doesn't really display anything*/    
          Vertical={true}
          Horizontal={false}
          list={loginOptions}
          index={inputIndex}
          setIndex={setInputIndex}
        />

        <UsernameComponent
          username = {username}
          setUsername = {setUsername}
          active={loginOptions[inputIndex] == "username" ? true : false}

          // (Enter Key) Two outcomes to submitting a username
          submitResponse={credentialValidity}

          credentialValidity={credentialValidity}
          resetAll={resetAll}
          validateUsername={validateUsername}
          error={usernameError}
          setError={setUsernameError}
         />
     
        <PasswordHandler
          username={username}
          password={password}
          setPassword={setPassword}
          active={loginOptions[inputIndex] == "password" ? true : false}
          submitResponse={credentialValidity}
          func={tryLogin} 
          error={passwordError}
          setError={setPasswordError}
        /> 
          
        </Box>

        <InputControlsFooter arrowOrientation={"Vertical"}/>
        </>
    )
  
  const AssignmentMenu = () => 
  (
    <>
    <Box>
      <SimpleSwitcher // Toggling between two options
        Vertical={false}
        Horizontal={true}
        list={progressMenuOptions}
        index={progressIndex}
        setIndex={setProgressIndex}
      />
  

        <AssignmentMenuToggler
          result={courseData[course]}
          setCurrentAssignmentDetails={setCurrentAssignmentDetails}
          setMenu={setMenu}

          // I'm going to use the index instead of the names
          active={progressMenuOptions[progressIndex]}
        />

      </Box>
      <InputControlsFooter arrowOrientation="Horizontal"/>
      </>
  );


  const courseRendering = () => 
  (
    <>
    <CourseToggler
      courses={gradescope.courses}
      setCourse={setCourse}
      setMenu={setMenu}
      courseData={courseData}
      addCourseData={addCourseData}
      // This function is used to read the course page and return its data
      // https://www.gradescope.com/courses/${href}
      // Also remember we're using main.js to keep control of the puppeteer page
      getCourseData = { (href) => gradescope.enterCourse(href) }
      setWaiting={setWaiting}
      />
      
      <InputControlsFooter arrowOrientation="Horizontal"/>
      </>
  );

  const gradedAssignmentRender = () => 
  (
    <>
      <DisplayAssignments data={courseData[course].gradedAssignments} setMenu={setMenu} />
      <InputControlsFooter arrowOrientation="Vertical"/>
    </>
  )

  const assignmentRendering = () => 
  (
    <>
      <DisplaySubmittableAssignments
        data={courseData[course].assignments}
        setMenu={setMenu}
        setAssignmentArray={setAssignmentArray}
      />
    </>
  )

  const submissionRendering = () => 
  (

    <>
      <AssignmentStatus
        data={assignmentArray}
        readDir={PATH.viewCurrentDirectory}
        currentDirectory={currentPath}
        setMenu={setMenu}
      />
    </>


  )



  if( (menu == 'login') || !cookie)
  {
    return loginRendering();
  }
  
  if(menu == "loadCourses")
  {
    return courseRendering();
  }

  if(menu == "submit")
  {
    // This is the section you'll be able to submit assignments from
    return AssignmentMenu();
  }


  // Assignment Submitter,  Assignment Viewer

  if(menu == "assignments")
  {
    return assignmentRendering();
  }

  if(menu == "gradedAssignments")
  {
    return gradedAssignmentRender();
  }
  
  if(menu == "homeworkMatching")
  {
    return submissionRendering();
  }
  
  /* 
   
    Gotta figure out a comparison for the course rendering part

  if(true == false)
  {
    return courseRendering();
  }*/

}

render(<App/>)
