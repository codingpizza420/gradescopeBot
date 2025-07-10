// This script is responsible for the path finder 
import React, { useState, ChangeEvent, useEffect, useRef} from "react";
import {render, Box, Text} from "ink";
import Path from "../features/path.js";
import {DirectoryModel, DirectoryPreview} from "./directoryModel.js";
import {Toggler, Switching} from "../tools/selectionToggler.js";

import {Section, PreviewDisplayer}from "../tools/sectionToggler.js";
const pathController = new Path();


// Directory toggler

// These are events after button inputs

// setting the stack up
pathController.enterDirectory(pathController.currentDirectory);


// updating the ui based on up down arrow keys
function displayItems(items, pointer, previewItems, currentDirectory) 
{
  const limit = 6;
  // Box contains two columns. One toggle
  return (

    <Box
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={process.stdout.rows}
      gap={2} 
      

    >
   
    <Box 
      flexDirection="row"
      //height={process.stdout.rows}
      justifyContent="flex-start"
    >
      <Section
        items={items}
        limit={limit}
        pointer={pointer}
        // This is the part that is rendered
        renderComponent={(item, index, key) => (
          <DirectoryModel
            text={item.name}
            size={item.size}
            bar={item.barSize}
            index={index + ((Math.ceil((pointer + 1) / limit) - 1) * limit)} // global index
            active={pointer}
            key={key}
          />
        )}
      />
      
      <Box 
        flexDirection="column" 
        //width="30%" 
        alignItems="flex-start"
        justifyContent="flex-start"
        //height={30}
        borderStyle="single"
        borderColor="blueBright"

        >
        

        

        <PreviewDisplayer // Preview displayer is simple, loops through the preview list based on the limit size and displays the items in a specific structure.
          items={previewItems}
          limit={6}
          renderComponent={(item, index) => (
            <DirectoryPreview
              text={item.name}
              size={item.size}
              key={index}
            />
          )}
        /> 



      </Box>
    </Box>
    
      <Box
        width={process.stdout.columns}
      // This box displays the current path. You can choose to type instead or just watch how it changes
        justifyContent="flex-start"
      >
      <Text color="blueBright">Current Directory : </Text><Text color="white" wrap="truncate">{currentDirectory}</Text>
      </Box>


    </Box>
  );
}




function PathChooser({setMenu})
{
  let [currentDirectory, changeDirectory] = useState(pathController.currentDirectory);
  // The pop grabs the latest item
  let [currentItems, changeItems] = useState(pathController.directoryLayers[pathController.directoryLayers.length - 1]);
  

  // always displaying currentDirectory items. !index!
  let [activeElement, updateElement] = useState(0);  
   //  maxDirectoriesDisplayed is used for assignments as well as the preview size 
  let maxDirectoriesDisplayed = 7;

  // Perhaps storing preview in a better data stucture would be great, if I'm constantly searching in the os for different directories it'd make sense to store it in a better spot.
  let [preview, changePreview] = useState({ stats: [], totalSize: 0 });
  
  let [forward, switchForwardState] = useState(false); // This determines whether the user clicked a left or right arrow key. Switching of the currentItems.
  let [backward, switchBackwardState] = useState(false);

  // Preview of current section
  //

  useEffect(() => 
  {
    if (forward == true) 
    {
      // Only run on actual changes to currentItems
      changeDirectory(`${pathController.currentDirectory}/${currentItems.stats[activeElement].name}`);

      pathController.enterDirectory(currentItems.stats[activeElement].name);

      // resetting the pointer and state. Setting the new Items
      changeItems(preview);
      updateElement(0) // starting at the zeroth index of the directory
      switchForwardState(false)
    }
  }, [forward]);


  useEffect(() => 
  {
    if (backward == true) 
    {
    
      const goBack = async () => 
      {
        const canLeave = await pathController.leaveDirectory();
        if (canLeave) {
          // Update the state for the previous directory
          changeDirectory(pathController.currentDirectory);
          // Change preview to current, change current to past.

          

          //changePreview()
          changeItems(pathController.directoryLayers[pathController.directoryLayers.length - 1]);
          
          updateElement(0);
        } 

      };

      goBack();
      switchBackwardState(false); // Reset backward state after handling
    }

  }, [backward]);





  useEffect( () => // This effect is in charge of making sure preview is being updated.
  {
    (async () => 
     {
      const arrayOfPreviews = await pathController.viewDirectory(currentItems.stats[activeElement].name);
      changePreview(arrayOfPreviews); 
    }
    )();

  }, [activeElement, currentItems])
  


  // For the peaking in directory, we'll display the first 6, if there are more than 7 we'll display a "/..", however, if there are exactly 7 we'll just display the whole thing.
 // The pointer will technically only be on the currentItems column, however, there will be an action to change the directory by hitting the right arrow key, or to leave the current directory by hitting the left key.
  return(
    <Box
      flexDirection="column"
      gap={1}
    >
        
      <Box
      // This box displays the current path. You can choose to type instead or just watch how it changes
      >
      <Text>Current Directory : {currentDirectory}/{currentItems.stats[activeElement].name}</Text>
      </Box>


      <Box
      // This box in the current directory container, contains all the names of the directories in the current directory.
      >
      <Toggler
        // -1 for the zeroth index
        pointerLimit={currentItems.stats.length-1}
        activeElement={activeElement}
        setActiveElement={updateElement}
        enterFunction={() => {}}
        DisplayElements={ () => 
        {
          // Displaying <Sections>
          // currentItems comes as items and total size
          return displayItems(currentItems.stats, activeElement, preview.stats, `${currentDirectory}/${currentItems.stats[activeElement].name}`)

        }}
        verticalArrows={true}
        horizontalArrows={false}

        setMenu={setMenu}
        // this aspect is hard coded.
        location={"main"}

      />  
 
      </Box>
      
      <Switching
        switchForward={switchForwardState}
        switchBackward={switchBackwardState}
        valid={preview.stats.length < 1 ? false : true} // This is a simple fix, since we have a preview, we can just set the new curretItems variable to this preview. 
        updateFileFunc={ async () => {await pathController.setDirectory(`${currentDirectory}/${currentItems.stats[activeElement].name}`)} }

        />
    </Box>

  )
}

/*

Image in my head

Current Directory : /Users/pizza/

Directories      preview
to choose
from

/Desktop     <| /folder 
/Application  | /folder0
/Documents    | /folder1
/Downloads    | /folder2
/randomFolder | /..



toggled with arrow keys.

up and down arrow keys handle changing the directory in the current array.

left and right arrow keys handle leaving and entering directories.





/Desktop     <| /folder 
/Application  | /folder0
/Documents    | /folder1
/Downloads    | /folder2
/randomFolder | /..


*/




// This function returns the current path set. while will be displayed in the main state.
function CurrentPath() // Also contains path verifier, if a path is set but doesn't exists it will notify.
{
  return pathController.currentDirectory;
}

export default PathChooser;
