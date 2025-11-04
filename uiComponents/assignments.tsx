import React, {useState} from "react";
import{render, Box, Text} from "ink";
import AssignmentModel from "./assignmentStateModels.js";
import {Toggler} from "../tools/selectionToggler.js";
import ProgressMenu from "../uiComponents/progress-main.js";
import { ProgressBar } from "@inkjs/ui";
/*
  
   [assignments] [gradedAssignments] [unfinishedAssignments]

  
   3 folders, based. Based on whichever is active we'll display the rescpect content in a row

 */

/*function viewAssignments({assignments})
{
  
}*/

// Since scaling is going to be one annoying issue we'll render a couple assignmnets at a time.


function DisplayAssignments({assignments, pointer}) // pointer + 1 due to zeroth index
{ // We're going to render a subset of the assignments


  const lengthOfAssignments = assignments.length;

  const subsetSize = 5; // number of assignments per subset
  const numberOfSubsets = Math.ceil(lengthOfAssignments / subsetSize); // round up, makes extra elements easier to display rather than having a subset greater than 5

  const currentSubset = Math.ceil(((pointer + 1) / subsetSize)); // find the subset we're currently on. this is more for the counter. + 1 due to zeroth index

  const startIndex = (currentSubset - 1) * subsetSize;
  const endIndex = Math.min(startIndex + subsetSize, lengthOfAssignments);
  
  let [subset, setSubset] = useState(currentSubset); // For the current subset we're in out of all subsets

  let subsetItems = assignments.slice(startIndex, endIndex);

  
  /*
     These assignments can vary from 60 to n amount.
   Therefore, we'll organize them into different subsets
   to better fit inside the terminal. 5 will be a good start.

   example : 

   assignment
   
   assignment

   assignnment
   
   assignment
  
   assignment
          3/6
  */ 
 
  // Comes backwards, we can defintley fix this 
  return(
    <Box 
      flexDirection="column" 
      gap={1}
      //height={process.stdout.rows}
      justifyContent="center"
      alignItems="center"
      borderStyle="round"
    >
      {
         // Since we're using this subset method it wouldn't make sense to render the other assignments 

        subsetItems.map((assignment, index) =>
        (
          <AssignmentModel 
          key={index}
            text={assignment.text}
            date={assignment.date}
            active={startIndex + index == pointer ? true : false}
           />
        ))
      
      }
      <Box>
      <Text>{currentSubset}/{numberOfSubsets}</Text>
      </Box>
    </Box>
  ) 
} 

function setAssignment({setCurrentAssignmentDetails, assignment})
{
  setCurrentAssignmentDetails(assignment);
}



function AssignmentToggler({result, setCurrentAssignmentDetails, active, setMenu})
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
  /*return(
    
    <Toggler
      pointerLimit={limit}
      activeElement={activeElement}
      setActiveElement={setActiveElement}
      enterFunction={()=> {setAssignment({setCurrentAssignmentDetails, assignment : assignments[activeElement]})}}
      DisplayElements={ () => 
      {
        return( 
          <DisplayAssignments
            assignments={assignments}
            pointer={activeElement}
          />
          )  
      }}

      verticalArrows={true}
      horizontalArrows={false}

      setMenu = {setMenu}
      location={"main"}
    />
  );*/



};

// 10/20/25
//
// We currently can't see the assignments we can't see yet, so create a browsing system

export default AssignmentToggler;
