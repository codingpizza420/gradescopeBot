const readline = require('readline');
const filesystem = require("fs");

class readlineFunctionality // Class is specifcally designed for per session use.
{
  constructor()
  {
    // class could be good if any credential is repeated.
    // This is just a programming norm.
    this.rl = this.readlineInterface();
    this.pointer = 0; // counter keeps track of terminal gui selector
    
    // toggler

    this.isActive = false;

    //default location for personal machine, make it compatible for all
    this.defaultPath = "/Users/pizza/Desktop/coding/Python/CS127/"
    
    // Distances for the GUI, depending on the terminal's dimensions, and longest assignment text name, we can find a length that fits all categories 
    this.assignmentDistance = 30;
    this.gradedAssignmentDistance = 31;
    this.failedAssignmentDistance = 30;
  }

  readlineInterface() 
  {
    return readline.createInterface
    ({
      input : process.stdin,
      output : process.stdout,
    })

  }

  

  async questioning(question)
  {
    return new Promise( (resolve) => this.rl.question(question, resolve))
  }

  async aquireLoginDetails() 
  {
    const username = await this.questioning("Username: ")
    if(await this.usernameVerifyer(username) == false)
    {
      return await this.aquireLoginDetails();
    }
    else
    {
      return {username: username , password : await this.questioning("Password : ")}
    }
  }
  


  // Error handling simple problems before submittion
  async usernameVerifyer(username)
  {
    if(username.length == 0)
    {
      console.log
      (
        `please fill in the username field!
        `
      )
      return false
    }

    if(!username.includes("@"))
    {
      console.log
      (
        `Must contain an @ symbol
        `
      )
      return false
    }

    // This should split the string into two parts -> JohnDoe@gmail.com -> ["JohnDoe", "gmail.com"]
    const parts = username.split("@");
    
    // More than one @ symbol
    if(parts.length > 2)
    {
      console.log
      (
        `Only one @ symbol
        `
      )
      return false
    }

    else if(parts[0].length == 0 && parts[1].length == 0)
    {
      console.log
      (
        `Please enter a part followed by '@'. '@' is incomplete
        `
      )
      return false;
    }

    else if(parts[1].length == 0)
    {
      console.log
      (
        `Please enter a part following '@' '${parts[0]}@' is incomplete
        `
      )
      return false
    }

    else if(parts[0].length == 0)
    {
      console.log
      (
        `Please enter a part followed by '@'. '@${parts[1]}' is incomplete.
        `
      )
      return false
    }
    else
    {
      return true
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
  



  async fileDate(file)
  {
    const fileInfo = filesystem.statSync(file);
    return new Date(fileInfo.birthtime).toISOString(); // ISO formatting for the date function.
  }



  // This function logs all current files in a specific directory.
  async requestingFileLocation()
  {
    // This is the path to all the homework python scripts
    console.log
    (
        `

          Current Files : 

        `
    )
    const files = await new Promise((resolve, reject) => {
      filesystem.readdir(this.defaultPath, (err, files) => {
        if (err) reject(err);
        else 
        {
          resolve(files)
        }
      });
    });
    for(let i = 0; i < files.length; i++)
    {
      const filePath = `${this.defaultPath}${files[i]}`// This is the file's location 
      files[i] = {text : `${files[i]}`, date : `${this.getCurrentDate(await this.fileDate(filePath))}`}
    }
    return files // returns an object for easy reading on the GUI
  }

  async sitePrompt(fileData)
  {
    const {fileName, fileSize} = fileData;
    const prompt = 
      `

          File Name : ${fileName}

          File Size : ${fileSize}


        `
    return prompt
  }


  // GUI functions
  //
  //
  
  // display rows of info

  async display(a)
  {
    const {assignments,gradedAssignments,unfinishedAssignments} = a;

    console.clear();
    
    console.log
    (
      `
        ${this.getCurrentDate()}
          
      `
    );
    
    // Since this is a GUI, I need to manage the terminal appearnce. 
    // How I want the items to be displayed
    // Which ones are visitable
    assignments.forEach((item, index) => 
    {
      if (index === this.pointer) 
      {
        console.log
        (
        `
>  ${this.wordDistancing(item.text)}        ${item.date ? item.date : ""}        ${item.score ? item.score : ""}  <
        `
        ); // Highlight the selected item
      }

        else
        {
          console.log(`${this.wordDistancing(item.text,this.assignmentDistance)}${item.date ? item.date : ""}        ${item.score ? item.score : ""}`);
        }
    });
    this.isActive = true;

    console.log
    (
      `
        Graded Assignments
      `
    )
    gradedAssignments.forEach( (obj) => 
    {
      console.log
      (
        `${this.wordDistancing(obj.text,this.gradedAssignmentDistance)}${obj.score}`
      )
    })


    console.log
    (
      `
        Failed Assignments  
      `
    )
    unfinishedAssignments.forEach(e => 
    {
        console.log
        (
          `${this.wordDistancing(e.text,this.failedAssignmentDistance)}${e.date}`
        )
    })

  }
  
  // For spacing purposes, we can add fillers so everything can be organized
  wordDistancing(string,distance)
  {
    while(string.length < distance)
    {
      string = string + " "
    }
    return string;
  }



  async menuToggler(items)
  {
    const {assignments} = items
    const length = assignments.length;
    this.display(items)
    return new Promise((resolve) => { // Promise waits for the result
    if(this.isActive == true)
    {
        readline.emitKeypressEvents(process.stdin); // listening to key strokes
        if (process.stdin.isTTY) process.stdin.setRawMode(true);

        const keyHandler = (str, key) =>
        {
          if (key.name === 'up' || key.name == 'left')
          {
            this.pointer = this.pointer === 0 ? length - 1 : this.pointer - 1;
          }
          else if (key.name === 'down' || key.name == 'right')
          {
            this.pointer = this.pointer === length - 1 ? 0 : this.pointer + 1;
          }
          else if (key.name === 'return')
          {
            resolve(this.pointer); // returns the index of the assignment
            this.pointer = 0; // resetting pointer for any other use
            this.isActive = false;

              // After such requests, we need a sign of responses. We want to be heard.
            process.stdin.setRawMode(false);
            process.stdin.removeListener("keypress", keyHandler) // Prevents event listener leaks
          }

          this.display(items); // Refreshing the GUI
          }

        process.stdin.on("keypress", keyHandler);

      }

    }); // end of promise, this is what is returned to the other script.

  }


  async displayList(items,message,distance) // Takes an object which'll have this format
  {
    console.clear();
    console.log
    (
        ` 
        ${this.getCurrentDate()}
    ${message ? message : ""}
        `
    )
    items.forEach((item, index) => {
        if (index === this.pointer) {
            console.log
            (
            `
> ${this.wordDistancing(item.text,distance)}${item.date ? item.date : ""}   <
            `
            ); // Highlight the selected item
        } else {
            console.log(`${this.wordDistancing(item.text,distance)}${item.date ? item.date : ""}`);
        }
    });
    this.isActive = true;
  }




  async toggler(items,message,distance)
  {
    
    const length = items.length;
    this.displayList(items,message,distance)
    return new Promise((resolve) => { // Promise waits for the result
    if(this.isActive == true)
    { 
        readline.emitKeypressEvents(process.stdin); // listening to key strokes
        if (process.stdin.isTTY) process.stdin.setRawMode(true);
        


        const keyHandler = (str, key) => 
        {


          if (key.name === 'up' || key.name == 'left') 
          {
            this.pointer = this.pointer === 0 ? length - 1 : this.pointer - 1;
          } 
          else if (key.name === 'down' || key.name == 'right')
          {
            this.pointer = this.pointer === length - 1 ? 0 : this.pointer + 1;
          } 
          else if (key.name === 'return')
          {
            resolve(this.pointer); // returns the index of the assignment
            this.pointer = 0; // resetting pointer for any other use
            this.isActive = false;

              // After such requests, we need a sign of responses. We want to be heard. 


            process.stdin.setRawMode(false);
            process.stdin.removeListener("keypress", keyHandler) // Prevents event listener leaks
          }

          this.displayList(items,message,distance); // Refreshing the GUI
          }

        process.stdin.on("keypress", keyHandler);

      }

    }); // end of promise, this is what is returned to the other script.
  }
}


module.exports = readlineFunctionality
