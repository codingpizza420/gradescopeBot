import React, { useState, ChangeEvent } from "react";
import {render, Box, Text} from "ink";
import {TextInput} from '@inkjs/ui';

import InputBox from "../tools/inputQueries.js";

function UsernameComponent( {username, setUsername, active, submitResponse, resetAll, credentialValidity, validateUsername} ) // username parameter is important for displaying the usernameEntered
{
  const [error, setError] = useState(false);

  const validateUser = function()
  {
    const userResponse = validateUsername();
    if(!userResponse)
    {
      setError(false)
    }
    else
    {
      setError(userResponse);
    }
  }


  //setError(usernameResponse); // this can either be an an error message or a boolean of false

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
        func={ validateUser }
      />
    </Box>
  )
}

export default UsernameComponent;



