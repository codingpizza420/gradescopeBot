import React, {useState} from "react";
import{render, Box, Text} from "ink";
import AssignmentModel from "./assignmentStateModels.js";


/*
 We've passed the data here, I want things to be easy to read and able to understand in a faster manner 

  Two Modules : graded module & ungraded module

  The ungraded module would be the more complex one since there are actions you can perform on them, however, the graded module will be a lot simpler since you can just browse your grades on it. We could take it a step further and find the sum grades for these at least attempt to since tests and regular assignments have different values.


      VISION
   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _           _ _ _ _ _ _ _ _ _ _ _
  |   assignments                     |         | graded assignemnts  |
  |    1. hw#16   due 2 days  3 hours |         |   101 assignemnts   |
  |    2. hw#19   due 5 days 3 hours  |         |                     |
  |                               4+  |         |                     |

*/


// Shared box size, and other attributes
function AssignmentModal({active, content}) // doesn't matter whether it's assignments or graded assignments
{

  return(
    <Box
      borderStyle="bold"
      flexDirection="column"
      borderDimColor={active}
      width={30}
      height={18}
      paddingY={1}
      gap={1}
      alignItems="center"

    >
      {content}
    
      </Box>
  )
}



// Unique box contents 

function AssignmentsDue({assignments, active})
{
  const totalNumberOfAssignments = assignments.length;


  return(
  <Box
    borderDimColor={active}
    flexDirection="column"
    alignItems="center"  
    gap={1}
    height="100%"
    width="100%"
  >
    <Text
      dimColor={active} 
      bold={true} 
      color="white"
    >Assignments</Text>

    {totalNumberOfAssignments != 0 ? 
      ""
      :
      <Text
        dimColor={active}
        color="grey"
      > No Current Assignments...</Text>

    }
  </Box>
  )
}

function displayAssignmentsDue({})
{
  // Currently don't have much insight on it

  return;
}


function NumberOfGradedAssginments({gradedAssignments, active })
{
  const numberOfAssignments = gradedAssignments.length;
  return(
    <Box 
      borderDimColor={active}
      flexDirection="column"
      alignItems="center"  
      gap={1}
      height="100%"
      width="100%"
    >
      <Text 
        dimColor={active} 
        bold={true} 
        color="white"
      >Graded Assignments</Text>

      <Text 
        dimColor={active}
        color="grey"
      >{numberOfAssignments} Assignments</Text>
    </Box>
  )
}

function ProgressMenu({assignments, gradedAssignments, active})
{
 return(
  <Box
      flexDirection="row"
      gap={5}
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
  >
  
    <AssignmentModal
      active={active == 0 ? false : true}
      content={<AssignmentsDue assignments={assignments} active={active == 0 ? false : true}/>}
    />
  
    <AssignmentModal
      active={active == 0 ? true : false}
      content={<NumberOfGradedAssginments gradedAssignments={gradedAssignments} active={active == 0 ? true : false}/>}
    />
  
  </Box> 
 ) 
}

export default ProgressMenu;

