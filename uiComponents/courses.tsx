import {Box,Text,useInput} from "ink";
import React, {useState} from "react";
import {Toggler}from "../tools/selectionToggler.js";
/*
  Assuming we're currently at https://gradescope.com/account


  We can 


 */


/*
 
   Containg the box's key 

  
  Starting at index 0

  [[Box1]]  [Box2] [Box3] [Box4] [Box5]


 */


function CourseBox( {course, activeBorder} )
{
  return (
    <Box 
      flexDirection="column" 
      borderStyle={activeBorder == true ? "double" : "round"}
      borderColor={activeBorder == true ? "green" : "white" }

      width={22}         // Fixed width
      height={15}         // Fixed height
      paddingX={2}
      paddingY={2}
      
      gap={1}

    >
      <Text bold color="white">{course.name}</Text>

      <Box flexDirection="column">
        <Text color="white" dimColor={true} >{course.shortname}</Text>
        <Text color="grey" dimColor={true}>📋 {course.numOfAssignments}</Text>
      </Box>

    </Box>
  )
};

function DisplayCourses({courses, activeElement})
{
  return(
  <Box
    flexDirection="row"
    gap={5}

    justifyContent="center"
    alignItems="center"
  >
  {
    courses.map((course,index) => 
    (
      <CourseBox
        key={index}
        course={course}
        activeBorder={index == activeElement ? true : false}
      />
    ))
   }
  </Box>
  )
}


async function setHref({href, course, setCourse, courseData, addCourseData, getCourseData}) // href could be found at courses.href
{
  // this is the reference we're referring to 
  // [course, setCourse]
  // Course is an object with this model {`course/${unique course id}` : [course data...]}
 
  /*
   Don't put all the code for the loading screen here, but it's appropriate to put a loading screen here while the data loads.
  */
  let data = await getCourseData(href);

  // While we're waiting for the data, add the loading screen, 
  console.log(data);
  if(!courseData[`${href}`]) // if the course doesn't exist in the hashtable
  {
    addCourseData(oldData => 
    ({
      ...oldData,            // keep old courses
      [href]: [data]       // set/replace this one
    }));
  };

  console.log(courseData);
  return;
};


function CourseToggler({courses, setCourse, setMenu, courseData, addCourseData, getCourseData})
{
  let [activeElement, setActiveElement] = useState(0); // Starting at the first index, latest course.

  return (
    <Toggler 
      pointerLimit={courses.length - 1}
      activeElement={activeElement} // active element is needed to know the position of the pointer
      setActiveElement={setActiveElement}
      enterFunction=
      {
        () => 
        {
          setHref({ course : courses, href: courses[activeElement].href, setCourse, courseData:courseData, addCourseData : addCourseData, getCourseData : getCourseData});
        }
      }
        DisplayElements=
        {
          () => 
          {
            return (<DisplayCourses courses={courses} activeElement={activeElement}/>)
          }
        }

      verticalArrows={false}
      horizontalArrows={true}
      
      setMenu={setMenu}
      location={"main"}
      

    />
  );
}


export default CourseToggler;




