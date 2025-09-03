import React from "react";
import {render, Text} from "ink";
import Spinner from "ink-spinner";

function LoadingScreen()
{
  return(

    <Text>
      <Text color="green" >
        <Spinner type="clock" />
      </Text>

      {'loading...'}

    </Text>
    
  )

}

export default LoadingScreen;
