import * as puppeteer from 'puppeteer';
import readlineFunctionality from './serverPrompts.js';
import cookieStorage from "./browserStorage.js";
//const {Path} = require("./path.js");
import inputFillers from './inputFillers.js';
import * as pathf from "path";

class main
{
  constructor()
  {
    // This data is yet to be filled but it'll be for faster use of the application
    //this.data = Object(); 
    
    // binding this issue solves the layer problem of `this`
    this.handleLoad = this.handleLoad.bind(this)

    this.browser = null;
    this.page = null; // Setting this.page to itself, so we can wait for the classes to have value.
    // this.page is the main browser, controls the user flow. browser contexts are seperate
    
    

    // classes
    this.pageFillers = null;
    this.cookieStorage = null;
    this.prompts = null; // Gotta change the name, this script was used for something else.

    // This courses contains saved information for a course, this will allow for faster submissions. 
    // If there is a problem with a submission we can refresh. Built in refresh button key as well. 
    this.courses = {} 
    this.courseDetails = {}

    // Handling submissions, limits
    this.browsers = [];

    // this is a queue that contains indicies of which agents are available. priority is given to main urls
    this.availableBrowserContexts = [];
    this.pendingQueue = [];

    // length is unknown? could get length from handleLoad function, then could set each response back to its respected index
    this.results=[];


    this.limit = 8; // This varies? still not determined on what. could change if computer has good stats
    
  }
  


  // two options, either load path or start the web scrapper
  
  
  
  /*
   
   8 existing bots, stored in an array
   queue of bots available by indicies, [0,1,2,3,4,5,6,7]

   10 assignments being submitted [0,1,2,3,4,5,6,7] // all being used 

   // CONDITIONALS
   if submission happens on the main page, so regular assignment submissions, give this priority queuing
   (Why priority?)
   priority queuing will reduce latency since we skip rerenders.



   
   
   
  */

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
  async loadBrowser()
  {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();

    // loading the page directly to the login page, skipping the modal part
    await this.page.goto("https://www.gradescope.com/login/");

    this.pageFillers = new inputFillers(this.page);
    this.cookieStorage = new cookieStorage(this.page);
    this.prompts = new readlineFunctionality()


    // bots
    for(let i = 0; i < this.limit; i ++)
    { // each iteration create a browser
      this.availableBrowserContexts.push(i)
      await this.createBrowsingInstance();
      //console.log("browsing instance complete", this.browsers)
    } 


    return this.page;
  }
  

  /*
   code for path should be updated, seems kind of redundant
   */


  async createBrowsingInstance() // cannot contain a url right now, only can create these browsers
  {
    const browserContext = await this.browser.createBrowserContext();
    const page = await browserContext.newPage();
    await this.cookieStorage.loadCookie(page);
    this.browsers.push(page);
  }


  async handleLoad(assignments, files, path)
  {
    this.pendingQueue = assignments.map((a, i) => 
    ({
      assignment: a,
      file: files[i]
    }));

    const results = await this.runWorkers(path);
    console.log(results, "and the result is ");

    return results;
  } 
  
  async runWorkers(path)
  {
    // These are all the jobs, [n...] -> doesn't stop until all promises in the workers array are resolved. 
    const workers = [];
 
    for (let i = 0; i < this.limit; i++) 
    {
        workers.push(this.worker(i, path));
    }

    await Promise.all(workers);

    return this.results;
  }

  async worker(workerIndex, path)
  {
    const currentPage = this.browsers[workerIndex];

    while(true) // doens't really matter, 
    {
      // Worker checking to see if there are assignments that need to be submitted
      const job = this.pendingQueue.shift();
      
      if(!job)
      {
        // if all assingmnets have been submitted, this should be empty, therefore this loop can break.
        return false;
      }
    

      const {assignment, file} = job;
      // This makes it a regular submisssion, can be submitted from -> https://gradescope.com/${courseId}
      //const objType = assignment.hasOwnProperty("postUrl");
    
      const result = await this.submissionHandler(currentPage, assignment, file, path)
      console.log(result)

      /*try
      {
    
        const result = await this.submissionHandler(currentPage, assignment, file)

        console.log(result)
        this.results.push({
          title: result.title,
          submissionType: result.submissionType,
          score: result.score,
          feedback: result.feedback,
          dueDate: result.dueDate

        })

      }
      catch(e)
      {
        console.log(e);
        this.results.push(
        {
          title : result.title,
          submissionType : result.submissionType,
          errorMSG: result.error
        })
      }*/

    }

  }

  async submissionHandler(currentPage, assignment, file, path)
  {
    // true = resubmission
    const objType = assignment.hasOwnProperty("postUrl");
    const coursePage = this.page.url(); // non resubmissions can happen here
    const fileComplete = path.join(path, file.name);
    // if true go to this.page.url, else `${this.page.url}/${assignment.resubmissionLink}`
    // wait for both to go to that url.
    // then you can run those functions which will return the right results
    if (objType) 
    {
      await currentPage.goto(coursePage, 
      {
        waitUntil: "domcontentloaded"
      });
      return this.submitAssignment(assignment.postUrl, currentPage, fileComplete);
    } 
    else
    {
      await currentPage.goto(`https://www.gradescope.com${assignment.ResubmissionLink}`, 
      {
          waitUntil: "domcontentloaded"
      })
      return this.resubmitAssignment(currentPage, fileComplete);
    }

    
    // wait for feedback (10–60 seconds)

  }
 
  /* 
   The way gradescope manages submitting assignments is very weird.
   Both contain a postUrl tag, which should redirect you to the assignments page, however, this isn't the case for 
   assignments that have not yet been submitted. Assignment pages are determined by submission status, if not submitted you cannot access it.


   Thankfully, both can be submitted using the same modal like experience.
  
  */

  // 2 different submission functions, they both open the submission tab 

  async submitAssignment(uploaderTag, page, file)
  {
    await page.locator(`button[data-post-url="${uploaderTag}"`).click();
    return this.submit(file)
  }

  async resubmitAssignment(page, file)
  {
    await page.locator(".js-submitAssignment").click();
    return this.submit(file, page)
  }



  async submit(file, page)
  {
    const fileInput = await page.$(".dz-hidden-input");
    await fileInput.uploadFile(file);
  
    // This is the submit button located in the submitting modal.
    await page.locator('.tiiBtn-primary').click();
    await page.waitForNavigation();

    // Waiting for these essential elements to appear
    await page.waitForSelector("div.submissionOutlineHeader--totalPoints", {timeout : 100000}); // 10 minutes of waiting, the wait time is longer depending on tests, and file size. 
    await page.waitForSelector(".submissionOutlineTestCase");

    // These elements appear after all tests are passed.
    const assignmentAssessment = await page.evaluate( () => {
      // Returns 4 list nodes containg assignment information.
    
      const name = document.querySelector(".submissionOutlineHeader--groupMember");
      const nameExist = name ? name.innerHTML : "nothing here";
      const autoGraderScore = document.querySelector("div.submissionOutlineHeader--totalPoints")
      const scoreExist = autoGraderScore ? autoGraderScore.innerHTML : "nothing here";
      const submissionOutline = document.querySelectorAll(".submissionOutlineTestCase");
      const outlineExist = submissionOutline ? Array.from(submissionOutline).map(element => element.querySelector("a").innerHTML):false;

      return{
        name : nameExist,
        score : scoreExist,
        testCase : outlineExist,
      }

    })
    return assignmentAssessment
  }
 







  /*
   
    REMEMBER TO KEEP PAGE URL IN MIND
  
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



  // gradescope has its own analyzer, will use later
  async uploadedAssignmentData()
  {
    // Giving the site time to calculate data size. 

    const fileData = await this.page.evaluate( () =>
    { 
      const dropzonePreview = document.querySelector(".dropzonePreview--file");
      const details = dropzonePreview.querySelectorAll("span");
      return {
        fileName : details[0].innerHTML,
        fileSize : `${details[1].querySelector("strong").innerHTML} ${details[1].innerHTML.slice(-2)}`
      }
    })
    return fileData
  }
 

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
