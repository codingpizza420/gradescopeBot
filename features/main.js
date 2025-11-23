import * as puppeteer from 'puppeteer';
import readlineFunctionality from './serverPrompts.js';
import cookieStorage from "./browserStorage.js";
//const {Path} = require("./path.js");
import inputFillers from './inputFillers.js';

class main
{
  constructor()
  {
    // This data is yet to be filled but it'll be for faster use of the application
    //this.data = Object(); 

    this.browser = null;
    this.page = null; // Setting this.page to itself, so we can wait for the classes to have value.

    // classes
    this.pageFillers = null;
    this.cookieStorage = null;
    this.prompts = null; // Gotta change the name, this script was used for something else.

    // This courses contains saved information for a course, this will allow for faster submissions. 
    // If there is a problem with a submission we can refresh. Built in refresh button key as well. 
    this.courses = {} 
    this.courseDetails = {}
  }
  


  // two options, either load path or start the web scrapper
  //
  
  async loadBrowser()
  {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();

    // loading the page directly to the login page, skipping the modal part
    await this.page.goto("https://www.gradescope.com/login/");

    this.pageFillers = new inputFillers(this.page);
    this.cookieStorage = new cookieStorage(this.page);
    this.prompts = new readlineFunctionality()
    return this.page;
  }

  
  
  async login()
  {
    const cookie = await this.cookieStorage.loadLoginCookies(); // checking whether or not the cookie has loaded.
    if(cookie == false)
    {
      // No login currently saved, please login!
      return false;
      
    }
    else
    {
      // logging in...
      await this.page.goto("https://www.gradescope.com/account/"); // Setting the destination.
      

      //after navigation we're currently at the main menu
      await this.courseSelector();

      return true; 
    }

  }
  
/*// Only if not logged in, or logged out.
 async passwordState()
 {
  // This method already has a recursive input validator
  while (true)
  {
    // This method already has a recursive input validator
    if(gsResponse == true)
    {
      // exit the loop
      console.log("logging in...")
      break;
    }
    else
    {
      const response = gsResponse.valid == false ? gsResponse.error_message : "Problem not detected, try again!";
      console.log(response);
    }
  }

    // Outside of the loop, the user must be valid, therefore, save the current state 
    await this.cookieStorage.saveLoginCookie();
    return true;
 }
*/
  async courseSelector()
  { // Assuming we're currently at "https://www.gradescope.com/account"
    if( Object.keys(this.courses).length > 0 )
    {
      console.log("There are courses loaded up already. Easy to just simply display them.")
    }
    else
    {
      // For faster readability, we're going to save the course's data to memory
      this.courses = await this.pageFillers.loadCourses();
      if(Object.keys(this.courses).length < 1)
      {
        console.log("Unfortunatley, there were no courses loaded, please try again!");
      }

    }
    return this.courses

  }

  async enterCourse(courseHref) // takes in href, course identifier
  {
    // The subtle difference of puppeteer's waitUntil and waitForNavigation is wild.
    await this.page.goto(`https://gradescope.com/${courseHref}`, {waitUntil : "domcontentloaded"});  
    const assignments = await this.pageFillers.assignmentsDueDetails();
    return assignments;
  }

  

  /* 
   The way gradescope manages submitting assignments is very weird.
   Both contain a postUrl tag, which should redirect you to the assignments page, however, this isn't the case for 
   assignments that have not yet been submitted. Assignment pages are determined by submission status, if not submitted you cannot access it.


   Thankfully, both can be submitted using the same modal like experience.
  
  */



  // 2 different submission functions

  async submitAssignment(uploaderTag)
  {
    await this.page.locator(`button[data-post-url="${uploaderTag}"`).click();
    this.finish();
  }

  async resubmitAssignment(uploaderTag)
  {
    await this.page.locator(`[href="${uploaderTag}"]`).click();
    await this.page.waitForNavigation()
    await this.page.locator(".js-submitAssignment").click();
    this.finish();
  }
 
  /*
   
    REMEMBER TO KEEP PAGE URL IN MIND
  
  */

  
   
  /*async finish()
  {
    // Locating files on the local machine
    //const fileObjects = await readline.requestingFileLocation();

    // filepath alongisde function which decides the exact file.
    const file = `${readline.defaultPath}${fileObjects[await readline.toggler(fileObjects,"",25)].text}`;

    // Submitting the file in the <input></input> field
    const fileInput = await this.page.$(".dz-hidden-input");
    await fileInput.uploadFile(file);

    // Returns site's data analysis, name and size
    const siteData = await this.uploadedAssignmentData(fileInput);

    // Confirmation form user. Yes Or No with 0 being yes and 1 being no, Binary reversed.
   //const response = await readline.toggler([{text : "Yes"}, {text : "No"}], await readline.sitePrompt(siteData), 5);

    //if(response == 0)
    //{
    
    const {name, score, testCase} = await this.submittingAssignment();
    //  console.log(
     // `

       //                           Final Result

        //Name : ${name}

        //Score : ${score}

        //Result : ${testCase}
      //`
      //)

    }

  }*/


  async submit()
  {

  }



}

// Creating a session
//gradescope.loadBrowser(); // Must call this function before I could even use a page instance
//gradescope.login();

export default main;




/* 
  code for updating json file 


   if(path.path == false)
    {
      // readline requests a path from the user.
      //
      //
      const askingForPath = "/Users/pizza/Desktop/";
      //path.setPath(askingForPath)
    }
    // Change current variable to the new path and update the json file.
    //this.path = path.upadtePath("/Users/pizza/Desktop/coding")

    //path.updatePath("/Users/pizza/Desktop/coding");

*/
