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


function setHref({href, setCourse}) // href could be found at courses.href
{
  setCourse(href);
};


function CourseToggler({courses, setCourse, setMenu})
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
          setHref({ href: courses[activeElement].href, setCourse });
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




