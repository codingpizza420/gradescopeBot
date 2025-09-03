import React, { useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";
import {TextInput} from '@inkjs/ui';

import InputBox from "../tools/inputQueries.js";

function UsernameComponent( {prompts, setValid, username, setUsername, active, submitResponse, validResponse, resetAll, credentialValidity } ) // username parameter is important for displaying the usernameEntered
{
  const [error, setError] = useState(false);

  
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
      setError(false);
      setValid(true);

      // username is valid, move onto the password input field
      validResponse();
    }
  }

  const settingUsername = (u) =>
  {
    setUsername(u);

    // Taking advantage of the event listener, don't want to stack it
    if(!credentialValidity)
    {
      resetAll();
    }
  }

  return (

    <Box flexDirection="column" 
      gap={1}
      width={50}
    >
    

      <Text
      
        dimColor = 
        {
          active ? false : true
        }

        // if there is an error message, or the larger scoped function returned not valid credentials  
        color={ error || (submitResponse == false) ? "red" : "brightblue"}

        >Username :</Text>

      <InputBox
        active={active}
        placeHolder={!error ? "Enter username..." : error}
        query={username}
        setQuery={settingUsername}
        visibilityKey={null}
        currentlyVisible={true}
        error={error || (submitResponse == false) ? true : false}
        setError={setError}
        func={ () => {validateUsername(username)}}
      />
    </Box>
  )
}

export default UsernameComponent;



