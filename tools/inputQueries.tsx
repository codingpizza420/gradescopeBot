import React, {useState} from "react";
import {Text, useInput, Box} from "ink"
import TextInput from "ink-text-input";


// query handles the currentValue inputed
// setQuery makes that change happen
// placeHolder is an optional parameter which makes the inputBox have a placeholder
// visbilityKey is also an optional parameter, based on its value, it will determine which key is nesscarry to toggle between visable and not

const InputBox = ({query, setQuery,placeHolder, visibilityKey, currentlyVisible, active, func, error, setError}) => 
{

  /*
    Usually, after a submission, there could be a response rather than just a loading screen.
  
  */

  const [visible, setVisbility] = useState(currentlyVisible);

    useInput( (input, key) => 
    {
      
      if(error && !key.return) // should be some error message or true boolean value
      {
        setError(false)
      }


      if (visibilityKey == "tab" && active)
      {
        if(key.tab)
          visible == false ? setVisbility(true) : setVisbility(false);
      }
    });
 

    
  // Conditionally handle input only if active
  const changeHandler = (value) => {
    if (active) {
      setQuery(value);
    }
  };



  const submitHandler = (value) => {
    if (active && func) {
      func(value);
    }
  };



  return (
    <Box
     borderStyle="round"
      
        /* Depending on active status will determine its use state */

     borderColor=
     {
      error ? 'red' : active ? 'brightBlue' : 'gray'
     }
     
     borderDimColor=
     {
      active ? false : true
     }
    > 
    <TextInput

      placeholder={placeHolder ? placeHolder : ""} // place holder is optional
      mask={visible ? "" : "*"}
      value={query} // current character
      showCursor={active}

      onChange={changeHandler} // Setting the change
      onSubmit={submitHandler} // 
    />
    </Box>
  )
}
export default InputBox;
