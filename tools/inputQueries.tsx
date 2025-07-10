import React, {useState} from "react";
import {Text, useInput} from "ink"
import TextInput from "ink-text-input";


// query handles the currentValue inputed
// setQuery makes that change happen
// placeHolder is an optional parameter which makes the inputBox have a placeholder
// visbilityKey is also an optional parameter, based on its value, it will determine which key is nesscarry to toggle between visable and not

const InputBox = ({query, setQuery,placeHolder, visibilityKey, currentlyVisible,func}) => 
{
  const [visible, setVisbility] = useState(currentlyVisible);

    useInput( (input, key) => 
    {
      if (visibilityKey == "tab")
      {
        if(key.tab)
          visible == false ? setVisbility(true) : setVisbility(false);
      }

    });
  

  return (
    <> 
    <TextInput
      value={query} // current character
      onChange={setQuery} // Setting the change
      placeholder={placeHolder ? placeHolder : ""} // place holder is optional
      mask={visible ? "" : "*"}
      onSubmit={func ? func : ""} // 
    />
    </>
  )
}
export default InputBox;
