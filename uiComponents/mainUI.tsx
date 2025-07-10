/* Probably one of the most important ascpects */
import React, { useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";
import { Toggler } from "../tools/selectionToggler.js";

// importing the path loaded is useless due to the referencing of that file already taking place in an earlier state of the synchronous calling


// These are the elements to be toggleed

function MenuModel({text, active})
{
  return(
    <Box
    borderStyle={active ? "double" : "classic"}
    borderColor={active ? "green" : "white"}
    >
      <Text>{text}</Text>
    </Box>
  )
}



function DisplayMenu( { setMenu, currentPath} )
{
  // checking whether or not the path exists.
  //const validToLoadMenu = loadPathFunc();
  

  // Since we are toggling between two options I need to use the toggling method.
  const menuOptions=["✅ Submit Assignments", "📂 Change Path"];

  
  // for indicies
  let [activeElement, setActiveElement] = useState(0);

   return (
  <Box 
    flexDirection="column"
    height={process.stdout.rows}
    justifyContent="center"
    alignItems="center"
  >
    <Box 
    marginBottom={1}
   //borderStyle="round"
    //borderColor="cyan"
    ><Text>GradeScope Bot</Text></Box> 

    <Box>
      <Text color="blueBright">File Path : </Text> 
      <Text color="white">{currentPath}</Text>
    </Box>

    <Box 
      width="100%" 
      justifyContent="center" 
      gap={10}


      /* This is where the features go*/
    >
      <Toggler
        pointerLimit={menuOptions.length - 1}
        activeElement={activeElement}
        setActiveElement={setActiveElement}
        enterFunction = { () => 
        {
          // the options are this simple only because there are two options
          if(activeElement == 0)
          {
            setMenu("submit")
          }
          else
          {
            setMenu("fileChooser")
          }

        }}
       
        DisplayElements={() => (
          <Box gap={3}>
            {menuOptions.map((label, index) => (
              <MenuModel key={index} text={label} active={index === activeElement} />
            ))}
          </Box>
        )}
          
        // going back won't do anything
        setMenu={setMenu}
        location={false}

        horizontalArrows={true}
        verticalArrows={false}

      />

      </Box>
    </Box>
);  
}


/*
 
   Current directory at the top




*/


export default DisplayMenu;
