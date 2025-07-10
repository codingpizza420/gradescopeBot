import React, { useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";
import {TextInput} from '@inkjs/ui';

import InputBox from "../tools/inputQueries.js";

function UsernameComponent( {prompts, setValid, username, setUsername} ) // username parameter is important for displaying the usernameEntered
{
  const [error, setError] = useState("");

  
  const validateUsername = (u) => 
  { 
    const validity = prompts.verifyUsername(u);
    if( validity.valid == false)
    {
      setUsername("");
      setError(validity.msg);
      setValid(false);
    }
    else // The username is valid to be submitted, however, the actual credentials haven't been determined yet.
    {
      setError("");
      setValid(true);
    }
  }



  return (

    <Box flexDirection="column" gap={1} width={50} >
      <InputBox
        placeHolder="Enter username..."
        query={username}
        setQuery={setUsername}
        visibilityKey={null}
        currentlyVisible={true}
        func={ () => {validateUsername(username)}}
      />
    <Box flexDirection="column">
      <Text color="red">{error ? error : ""}</Text>
    </Box>
    </Box>
  )
}

export default UsernameComponent;



