import React from "react";
import {render, Text, Box, useStdout} from "ink";
import Spinner from "ink-spinner";

function LoadingScreen()
{
  
  return(

    <Box
      flexDirection="column"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      
    >

      <Text color="white" >
        Loading
        <Spinner type="simpleDots" />
      </Text>

    </Box>    
  )

}

export default LoadingScreen;
