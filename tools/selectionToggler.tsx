import React, {useState} from "react";
import {Box, Text, useInput} from "ink";

/*
 
   This reusable selecitonToggler is for 2 dimentional use only, either moving
   right <---> left
        or
   up <---> down

   5 parameters needed

   pointerLimit, used to determine where to reset the pointer in either side when current pointer is out of bounds.

   activeElement, the index of the array filled with object, which points to the object being toggled on.

   setActiveElement, the current pointer being able to move up or down, and can be determined by the pointerLimit.

   enterFunction, used for adding any type of logic after the element is chosen, usually the enter button.

   DisplayElements, to display the elements in an array to be toggled.

 
*/


// Toggling between different list items, keeping track of current item, built in display, verticalArrows and horitonalArrows, changing the state, location of state 
function Toggler({pointerLimit, activeElement, setActiveElement, enterFunction, DisplayElements, verticalArrows, horizontalArrows, setMenu, location})
{ // pointerLimit is used to traverse the array in a circular motion by resetting the index.

    // setMenu is important for navigating to location. In this function we use it to go backwards, traversing the different sections of this software.

	  useInput((input, key) => { // The listener 
    
    if (horizontalArrows) 
    {
      if (key.leftArrow)
      {
        if (activeElement == 0)
        {
          setActiveElement(pointerLimit);
        }

        else 
        {
          setActiveElement(activeElement - 1);  // Decrease activeElement
        }
      }


      if (key.rightArrow) 
      {
        // set active to the right
      if (activeElement == pointerLimit)
      {
        setActiveElement(0);
      }
      else 
      {
        setActiveElement(activeElement + 1);  // Increase activeElement
      }
    }
  }

  if (verticalArrows) 
  {
    if (key.upArrow) 
    {
      if (activeElement == 0)
      {
        setActiveElement(pointerLimit);
      } 
      else
      {
        setActiveElement(activeElement - 1);  // Decrease activeElement
      }
    }

    if (key.downArrow) 
    {
    if (activeElement == pointerLimit) 
      {
        setActiveElement(0);
      }
      else
      {
        setActiveElement(activeElement + 1);  // Increase activeElement
      }
    }
  }
    
    if(key.escape && location)
    {
      setMenu(location)
    }

    // by setting location to false, the escape key won't work
    if(key.return)
    {
      // After enter is clicked you can run any function here. Based on what we're toggling
      enterFunction();
    }
	  });
  
  return (
    <>
    {DisplayElements()}
    </>
  )


}

function SwitchingStates({switchForward, switchBackward, valid, updateFileFunc})
{

  // Switching between states with booleans.


  /*
    Unlike the switching in between items in a given set, I'm instead switching in between random items in a random order. Therefore, to make sure I don't hit a deadend I'll have an item parameter to make sure the place is valid. I'll have to create something to make sure I don't leave the starting state. I'll store previous elsewhere. 
   

  */
  useInput( (input, key) => 
  {
    
    if(key.rightArrow && valid) // entering the directory
    {
      switchForward(true);
    }
  
    if(key.leftArrow) // exiting the directory
    {
      switchBackward(true);
    }

    if(key.return) // Setting this to the default directory
    { 
      updateFileFunc(); 
    }

  })

  return "";

}



/*
 

   End goal with this function is to reduce the size of some of these other togglers.


*/


function SimpleSwitcher({Vertical, Horizontal, Setter, list, index, setIndex}) // This does not display anything, it merley acts as a variable changer  
{

  /* 
    My usecase for SimpleSwitcher is to interactive between username and password inputfields seperatley, however,
    I noticed how I could reuse this function in the main Toggler function.
  
  */
    
  /*
        How this function works
        
        given a list of items you want to toggle between

        ["usernameField", "passwordField", "submitButton"]
        
        left and right arrow keys determine the direction we are traversing the indicies 

  */
    useInput((input, key) => 
    {
      let newIndex = index;

      if (Vertical) 
      {
        if (key.downArrow)
          newIndex++;

        if (key.upArrow)
          newIndex--;
      }

      if (Horizontal) 
      {
        if (key.rightArrow)
          newIndex++;

        if (key.leftArrow)
          newIndex--;
      }

    // Simple Edge cases
    if (newIndex < 0)
      newIndex = list.length - 1;

    if (newIndex > list.length - 1)
      newIndex = 0;

    if (newIndex !== index) 
    {
      Setter(list[newIndex]); // Setting the value
      setIndex(newIndex);     // Saving the change of index value
    };

  });

  return null;
}



export {Toggler, SwitchingStates, SimpleSwitcher};
