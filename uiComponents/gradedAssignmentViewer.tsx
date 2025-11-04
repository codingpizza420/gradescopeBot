import React, {useEffect, useState} from "react";
import {render, Box, Text, useInput} from "ink";
import {Section} from "../tools/sectionToggler.js";
import {Toggler} from "../tools/selectionToggler.js";
//function  


function AssignmentDesign({name, grade, active, index})
{
  return(
    <Box
      //borderStyle="bold"
      //borderColor="red"
      width={50}
      height={3}
      justifyContent="space-between"
      borderStyle="single"
      borderColor="cyan"
      borderDimColor={ !(active == index) }
    >
      <Box
        flexDirection="row"
        gap={1}
      >

        <Text
          color="cyan"
          dimColor={!(active == index)}
        >{name}</Text>
      </Box>


      <Text
        backgroundColor="#013220"
        color="white"
        bold={true}
        dimColor={!(active == index)}
      >{grade}</Text>
    </Box>
  )
}

// Since we're trying to keep a pattern, cyan and blueBright are the colors we use for the directory Toggler

/*

  Grade text background color. based on grades of excellent, average, and failed. Let's make it simple

  grade that deserves bright green backdrop
  90%-100%

  grade that deserves darkgreen backdrop
  80%-89%

  average grade deserves yellow backdrop 
  65%-79%

  failing grade deserves red backdrop
  0%-64%

  incomplete or grade not found deserves a gray backdrop


*/
function DisplayAssignments({ data, setMenu}) 
{
  const [pointer, setPointer] = useState(0);
  const limit = 8; 
  
  const gradedDisplayer = () => 
  (
    <Section
      items={data}
      limit={limit}
      pointer={pointer}
      height={35}
      width={55}
      renderComponent={(item, index, key) => (
        <AssignmentDesign
          name={item.text}
          grade={item.score}
          key={key}
          active={pointer}
          index={index + ((Math.ceil((pointer + 1) / limit) - 1) * limit)}
        />
      )}
    />
  );

  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center">
      <Box
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Toggler
          pointerLimit={data.length - 1}
          activeElement={pointer}
          setActiveElement={setPointer}
          enterFunction={() => console.log(data[pointer])}
          DisplayElements={gradedDisplayer}
          verticalArrows={true}
          horizontalArrows={false}
          setMenu={setMenu}
          location={"submit"}
        />
      </Box>
    </Box>
  );
}




export default DisplayAssignments;
