class readlineFunctionality // Class is specifcally designed for per session use.
{

  // Error handling simple problems before submittion
  verifyUsername(username)
  {
    if(username.length == 0)
      return {valid : false, msg : 'please fill in the username field!'}
  
    if(!username.includes("@"))
      return {valid : false, msg : 'Must contain an @ symbol'}    

    // This should split the string into two parts -> JohnDoe@gmail.com -> ["JohnDoe", "gmail.com"]
    const parts = username.split("@");
    
    // More than one @ symbol
    if(parts.length > 2)
      return {valid : false, msg : 'Only one @ symbol'}

    else if(parts[0].length == 0 && parts[1].length == 0)
      return {valid : false, msg : "Please enter a part followed by '@'. '@' is incomplete"}

    else if(parts[1].length == 0)
      return {valid : false, msg : `Please enter a part following '@' '${parts[0]}@' is incomplete`}

    else if(parts[0].length == 0)
      return {valid : false, msg : `Please enter a part followed by '@'. '@${parts[1]}' is incomplete`}

    else
    {
      return {valid : true}
    }
  }





  
 

  getCurrentDate(date) // This gets date in terms of month, day, time
  {
    const currentDate = date ? new Date(date) : new Date(); // the date must be in ISO format
    const months =
      [ 
        "January", "Febuary","March","April","May","June",
        "July","August","September","October","November","December"
      ];
    const time = currentDate.toLocaleTimeString('en-US').slice(0,-3); 
    const day = currentDate.getDate();

    return `${months[currentDate.getMonth()]}   ${day}   ${time.slice(0,-3)}${currentDate.toLocaleTimeString().slice(-2)}`
  }
  

}

export default readlineFunctionality;
