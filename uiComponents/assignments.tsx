import React, {useState} from "react";
import{render, Box, Text} from "ink";
import AssignmentModel from "./assignmentStateModels.js";
import ProgressMenu from "../uiComponents/progress-main.js";
import { ProgressBar } from "@inkjs/ui";


import { Section } from "../tools/sectionToggler.js";
import {Toggler} from "../tools/selectionToggler.js";

function DisplaySubmittableDesign({item, active, index})
{
  const {text, date, score} = item;
  const hasGrade = score ? score : "N/A";

  return (
    <Box
      borderStyle="round"
      borderColor="cyan"
      borderDimColor={!(active == index)}
      flexDirection="column"
      width={50}
      height={10}
    >
      <Box width="100%" justifyContent="center">
        <Text
          color="cyan"
          bold
          dimColor={!(active == index)}
        >{text}</Text>
      </Box>

      <Text
        color="white"
        bold
        dimColor={!(active == index)}
      >Grade: {hasGrade}</Text>

      <Text
        color="white"
        bold
        dimColor={!(active == index)}
      >Due Date: {date}</Text>

    </Box>
  );



  }


function DisplaySubmittableAssignments({data, setMenu})
{
  const [pointer, setPointer] = useState(0);
  const limit = 6;

  const assignmentDisplayer = () => 
  (
    <Section
      items={data}
      limit={limit}
      pointer={pointer}
      height={45}
      width={55}
      renderComponent={ (item, index, key) => 
      (
        <DisplaySubmittableDesign
          key={key}
          item={item}
          active={pointer}
          index={index + ((Math.ceil((pointer + 1) / limit) - 1) * limit)}
        />
      )}
    />
  )


 return (
    <Box flexDirection="column" justifyContent="center" alignItems="center">
      <Box
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Toggler
          pointerLimit={data.length - 1}
          activeElement={pointer}
          setActiveElement={setPointer}
          enterFunction={() => console.log(data[pointer])}
          DisplayElements={assignmentDisplayer}
          verticalArrows={true}
          horizontalArrows={false}
          setMenu={setMenu}
          location={"submit"}
        />
      </Box>
    </Box>
  );



  /*return(
    <>{assignmentDisplayer()}</>
  
  )*/
}


function setAssignment({setCurrentAssignmentDetails, assignment})
{
  setCurrentAssignmentDetails(assignment);
}



function AssignmentMenuToggler({result, setCurrentAssignmentDetails, active, setMenu})
{
// Result contains 3 objects
  const {assignments, gradedAssignments} = result;
  //const [activeElement, setActiveElement] = useState(0); // Starting at the first index, latest assignment. 
  // minus one because we need to start at the zeroth index
  //const limit = assignments.length == 0 ? 0 : assignments.length - 1;
  

  // This is the menu to choose whether to resubmit or to view a grade.
  return(
    <Box>
      <ProgressMenu
        assignments={assignments}
        gradedAssignments={gradedAssignments}
        active={active}
        setMenu={setMenu}
    />
    </Box>
  )
};

/*
 Breif explanation

 3 states of assignments,

 Assignments
 Text
 PostURL
 date



 Assignments with resubmission available( Due date has not passed )
 Text
 score (usually a url, gradescope will not give you a definate answer if it isn't passed due date)
 scoreChecker
 resubmissionLink
 date




 Graded Assignments (Simplest)
 Text
 score (usually a number)
 scoreChecker url, if not grade
 resubmission (false)
 resubmissionLink (false)
 date



*/

export {AssignmentMenuToggler, DisplaySubmittableAssignments};
