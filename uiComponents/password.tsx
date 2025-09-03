import React, { useState, ChangeEvent } from "react";
import {Box, Text, useInput} from "ink";
import InputBox from "../tools/inputQueries.js";


function PasswordHandler( {username, password, setPassword, active ,submitResponse, func} ) // Only will be called if username is acceptable to gradescope standard
{
  let [error, setError] = useState(false);

  return (
		<Box flexDirection="column" 
      width={50}
      gap={1}
      
    >
      
      <Text
      
        dimColor=
        {
          active ? false : true
        }

        color=
        { // if the submission was wrong, there must be a large indication of that 
          submitResponse == false ? "red" : "brightblue"
        }

      >Password :</Text>

			<InputBox
        active={active}
        placeHolder="Enter password..."
        query={password}
        setQuery={setPassword}
        visibilityKey={"tab"} // Setting the visbility key to be tab
        currentlyVisible={false}

        error={submitResponse == false ? true : false} 
        setError={setError}



        func={func}
      />
			<Text
        dimColor=
        {
          active ? false : true 
        }
        // I think it's a lot cleaner if this element is not so assosiated, in relation to color, to a specific element. Slightly more visable if the password input field is active.
        color="grey"

      >Press tab to toggle</Text>
		
      </Box>
	);
}


export default PasswordHandler;
