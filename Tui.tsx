import React, { useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";

// ui-Components
import UsernameComponent from "./uiComponents/username.js";
import PasswordHandler from "./uiComponents/password.js";
import CourseToggler from "./uiComponents/courses.js";
import AssignmentToggler from "./uiComponents/assignments.js";
import main from "./features/main.js"; // Most important script, every class reference comes through it. This makes reference easier when it call comes from one source.
import path from "./features/path.js";

import PathChooser from "./uiComponents/directoryToggler.js"; 

// Async handlers
import handleLogin from "./asyncResponses/credentialChecker.js";

import DisplayMenu from "./uiComponents/mainUI.js";

const gradescope = new main();
const PATH = new path();
// this.pageFillers
// this.cookieStorage



async function loginState( {setLogin, setCookie}) // This function is always loaded first, therefore, load browser should be called here.
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
  }
  else
  {
    setLogin("loadCourses");
    setCookie(true)
  }

}

async function assignmentState({course, setCurrentCourseDetails})
{
  const result = await gradescope.enterCourse(course);
  setCurrentCourseDetails(result);
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

  let [currentPath, setPath] = useState(null);

  // One of the most important parts of this project is saving time, therefore we'll need to store the courses we open.
  let [currentCourseDetails, setCurrentCourseDetails] = useState(null); // contains course's details. assignments' statuses and how and where to submit them.
  
  let [currentAssignmentDetails, setCurrentAssignmentDetails] = useState(null); 


  // These are the three states this program can be in, main to select one of the two. submit is for submitting assignments. fileChooser is for changing the path or creating a path for file submission locations.
	const [menu, setMenu] = useState<'main' | 'submit' | 'fileChooser'>('main');
  
  // Having these states will be very benefical later on. Having different states will be easier to handle since I can now distguish current and previous proccesses. Therefore, I can create a system toggling between different states and processes.

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
    loginState({setLogin,setCookie});

  }, []);

  React.useEffect( () => // Listening for user's input on changing the course
  {
    if(gradescope.page) // If the page exists, we can run the funcitons
    {
      assignmentState({course, setCurrentCourseDetails});
    }
  }, [course] ) // Setting course as a dependency 
  

  React.useEffect( () => 
  {
    if(currentAssignmentDetails != null)
    {
      console.log("It WorkdEd!")
    }
  }, [currentAssignmentDetails])
  

  if ( login === "loading" )
  {
      return <Text>Loading...</Text>;
  }
  if (login == "loadCourses" && renderedCourses == false)
  {
    setRender(true)
    return <Text>Welcome back! loading courses</Text>;
  }

  
  if(menu == "main")
  {
  console.log(menu, "this is currently menu")
    return(<DisplayMenu 
      setMenu={setMenu}
      currentPath=
      { // since it is an async function, we must call it as such to get its value
        currentPath
      }
    />)
  }

  if(menu == "fileChooser")
  {
    return(<PathChooser setMenu={setMenu}/>)
  }



  // There needs to be some set up of what needs to be called from the very begining. 

  const submissionRendering = () => // It's much easier with conditionals, ternary can get confusing as this project gets bigger.
  {
    if (!cookie || !renderedCourses)
    {
      return (
        <Box // TUI container/courses/964364/assignments/5652838/submissions
          flexDirection={"column"}
          borderStyle="double"
          justifyContent="center"
          alignItems="center"
          padding={1}
        >

        <Box width={50} flexDirection="column">
        <Text color="red" > {loginErrorMsg ? loginErrorMsg : ""} </Text>
        </Box>

        {valid == true ? 
          <PasswordHandler
            username={username}
            password={password}
            setPassword={setPassword}
            func=
            { () => 
              {
                handleLogin({ // Resetting all the elements
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
                })
              }
            } // This is the function that tries our login, if valid show assignments, else try again!
          /> 
        :
          <UsernameComponent
            prompts={gradescope.prompts}
            setValid = {setValid}
            username = {username}
            setUsername = {setUsername}
          />
        }
        </Box> 
      )
    };

    if(course && currentCourseDetails) // if there's a course's href assigned that means there is a course.
    {
      //console.log(currentAssignmentDetails)
      return(
      <Box>
        <AssignmentToggler 
          result={currentCourseDetails}
          setCurrentAssignmentDetails={setCurrentAssignmentDetails}
          setMenu={setMenu}
        />
        
        

      </Box>
      )
    }

    return (
        <CourseToggler
          courses={gradescope.courses}
          setCourse={setCourse}
          setMenu={setMenu}
        /> 
      );
  };

  if(menu == "submit")
  {
    return (
    <>{submissionRendering()}</>
    )
  }
}

render(<App/>)
