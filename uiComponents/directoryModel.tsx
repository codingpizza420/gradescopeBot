import React, {useState} from "react";
import {render, Box, Text} from "ink";


function DirectoryModel({text, size, bar ,active, index})
{
/*
 
\
  Assignments
/
  Desktop

  Library

*/

/*

This is the code the the active Arrow



      <Box // this is the active arrow
        width={2}
        marginLeft={1}
        height={5}
        alignItems="center"
      >

      { 
        index == active ? 
        <Text
          color="greenBright"
          >
            {'>'}
        </Text>
        : ""
      }

    </Box>
      


*/


  return(
    <Box>

     <Box // container 
      flexDirection="column"
      borderStyle={active == index ? "round" : undefined}
      borderColor={active == index ? "cyan" : "blueBright"}
      width={20}
      //height={5}
      >
        <Text 
          wrap="truncate"
          // All directory models contain a /
          color={active == index ? "cyan" : "blueBright"}
        >
          /{text}
        </Text>

        <Text
          wrap="truncate"
          color="white"
        >
          {size}
        </Text>
      </Box>
      
    </Box>
  )
}

function DirectoryPreview({text,size})
{
  return(
  // Based on sectionToggler, I know the parent container box node is h=36, w=65  
    <Box // container 
      width={20}
      height={3}

      flexDirection="column"
      >
        <Box>
          <Text 
            wrap="truncate"
            dimColor={true}
            color="white"
          >
            /{text}
          </Text>
        </Box>

        <Box>
          <Text
            wrap="truncate"
            dimColor={true}
            color="white"
          >
            {size}
          </Text>
        </Box>
      </Box>
  )

}


function DirectorySize(size,limit)
{

}


function Counter({currentSubset, totalSubsets,})
{


}


/*function DirectorysModel({items, pointer})
{
  //console.log(items, " this is items")
  return(
    <Box
      gap={1}
      flexDirection="column"
    >
    {

      items.map( (dir, index) => 
        (
          <DirectoryModel
            text={dir}
            size={"null"}
            key={index}
            index={index}
            active={pointer}
          />
        )
      )
    }
    </Box>

  )
}*/

export {DirectoryModel, DirectoryPreview}
