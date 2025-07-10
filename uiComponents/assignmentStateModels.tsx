import React, {useState} from "react";
import {render, Box, Text} from "ink";

/*async function pendingAssignmentModel({text,date})
{
    // Perhaps I recreate that little gradecsope animation with the date. Sounds like fun.
  return;
}*/


function AssignmentModel({text,date,active})
{

  return(
  <Box 
    flexDirection="column"
    width={25}
    height={5}
    alignItems="center"
    justifyContent="center"
    borderStyle={active ? "double" : "classic"}
    borderColor={active ? "green" : "white"}
  >
      <Text>{text}</Text>
      <Text>{date}</Text> 
    </Box>
  );

}


export default AssignmentModel;


