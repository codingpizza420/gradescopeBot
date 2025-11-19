import React, {useState} from "react";
import {render, Box, Text} from "ink";

/*
 
   Design pattern for toggling items in a terminal overflow.

  only given a list of items and number of items that can be displayed at one time

  example : 

  16 items in a whole list 
  
  5 items at a time

    item1
    item2
    item3
    item4
    item5
          1/4
        

    item6
    item7
    item8
    item9
    item10
          2/4

    
    item11
    item12
    item13
    item14
    item15
        3/4



    item16
        4/4
 
*/

/*
  Instructions for using the Section Component

  items referes to the list of items in an array you want to display bits of 
  

  limit refers to the max amount of items in that array. you can just use array.length. Really simple

  pointer refers to the variable that will carry this change along the bits of render componenets moving along.

  renderComponent refers to the actual component being displayed at a time.

*/


function Section({items, limit, pointer, renderComponent, height, width}) 
{ // limit is subset size , pointer will most likely be 0, The render component is the item modal,

  const lengthOfItems = items.length;
  const numberOfSubsets = Math.ceil(lengthOfItems / limit); // n number of subsets
  const currentSubset = Math.ceil( (pointer + 1) / limit ); // Most likely this will be 0, which is the first item


  // For the seciton, we need a starting index and an ending index.
  const startIndex = (currentSubset - 1) * limit;
  const endIndex = Math.min(startIndex + limit, lengthOfItems);


  let [subset, setSubset] = useState(currentSubset); 
  let subsetItems = items.slice(startIndex,endIndex);

  
  
  return(
    <Box
      flexDirection="column"

      borderStyle="single"
      borderColor="blue"
      height={height}
      width={width}
      justifyContent="space-between"
      //alignContent="space"
    >
    <Box
      flexDirection="column"
      // DOn't really need any fixed height or width properties, since the items are already limited to certain sizes
      gap={1}
    >
      { // these items need a container
          // Index doesn't need to be called since it is limited to the subarray size, therefore not aligning with the actual index in the array.
        subsetItems.map( (assignment,index) => 
        (
        // We can pass anything to the script calling it
          renderComponent(assignment,index,index)
        ))
      }
    </Box>
    
      <Box
      // All lists that are broken up into subsets should contain a counter, visibile property is added for subsets with counters not needed.
      alignSelf="flex-end"
      >

      
      <Text>{currentSubset}/{numberOfSubsets}</Text>
    
 
      </Box>
  </Box>

  )
}

function PreviewDisplayer({items, limit, renderComponent})
{
  // Since this is just a simple preview, I don't need the directories entire size, at least yet 

  if(items.length < 1)
  {
    return( <Text>No Directories here</Text>)
  }
  else
  {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
      >
        <Box>
          <Text
          color="blueBright"
          >Preview</Text>
        </Box>
        <Box flexDirection="column">
          {items.slice(0, limit).map((item, index) => (
            <React.Fragment key={index}>
              {renderComponent(item, index)}
            </React.Fragment>
          ))}
        </Box>
      </Box>
      );
    }
  }

export {Section, PreviewDisplayer};



/*
 
   From case to case I notice it's best to run this on the actual items toggler. For my code it's the <Toggler> component 
 
 
*/
