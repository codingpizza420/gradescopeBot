import React, {useState} from "react";
import {render, Box, Text} from "ink";

async function assignmentFolder( {text} )
{ // There will be 3 individual folders, either containg due assignments, graded assignments, or assignments you couldn't finish.
  return(
  <>
  <Box
    // This acts as a button
  >
    <Text>{text}</Text>
  </Box>

  <Box>
    
    
      This contains all the assignments which fits into its category


  </Box>
  </>
  )

}
