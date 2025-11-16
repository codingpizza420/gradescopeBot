import React, { useRef, useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";

/*
 A keybinding instruction list that helps users navigate the current TUI component



 A footer sounds best, at the end of the rendered component is a fixed instruction list that shows the current options of navigating the Tui. This can be from arrow keys, enter buttons, escape buttons, etc... 


For more advance keybindings, I'll add a 




keys: 
escape: 
enter: 



*/

function ArrowOrientation(orientation)
{
  const s = "Arrow Keys: "

  if (orientation == "Horizontal")
    return s + "left/right"
  else if (orientation == "Vertical")
    return s + "up/down"

  else if(orientation == "Both")
  {
    return s + "pending..."
  }
  else
  {
    return s + "None"
  }

}

function InputControlsFooter({arrowOrientation})
{

  return(
    <Box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingTop={2}
    >
      <Text color="grey">Esc: return, Enter: select, {ArrowOrientation(arrowOrientation)}</Text>
    </Box>
  )
}

export default InputControlsFooter;





