import React, { useState } from "react";


async function handleLogin( {setTryAgain, setLogin, setValid, setUsername,setPassword, username, password, page, setPage,setErrorMsg, inputFill, storage, setCookie} )
{
  const response = await inputFill.fillLoginDetails(username, password) // This async call which tries to login
  // If login works, no error message attached
  if( response == true )
  {
    // The page has redirected, based on gradescopes redirection when there's a valid username. Double check it!
    
    // Save the cookie here, when the response is valid.

    const currentPage = await page;

    storage.saveLoginCookie(currentPage); // Saving the cookie
    // Display courses
   setPage(currentPage)
   setTryAgain(false) 
   setCookie(true) // setting cookie to just in case I need to reference it 
  }  
  else
  {


   // Try again! 
    setTryAgain(true)
    // Setting the error message returned to me from gradescope
    setErrorMsg(response.error_message);
    
    // Revert All the setters 
    setValid(false);
    setUsername("");
    setPassword("");

  }
}



export default handleLogin;
