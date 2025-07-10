import React, { useState, ChangeEvent } from "react";
import {Box, Text, useInput} from "ink";
import InputBox from "../tools/inputQueries.js";


function PasswordHandler( {username, password, setPassword, func} ) // Only will be called if username is acceptable to gradescope standard
{
  return (
		<Box flexDirection="column" width={50}gap={1} >
      <Text>Username : {username} </Text>
			<InputBox
        placeHolder="Enter password..."
        query={password}
        setQuery={setPassword}
        visibilityKey={"tab"} // Setting the visbility key to be tab
        currentlyVisible={false}
        func={func}
      />
			<Text>Press tab to toggle</Text>
		</Box>
	);
}


export default PasswordHandler;
