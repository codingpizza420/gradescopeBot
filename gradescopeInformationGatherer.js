const puppeteer = require('puppeteer');
const readlineFunctionality = require('./serverPrompts.js');
const {cookieStorage, localStorage} = require("./browserStorage.js");
/*
  
  Puppeteer is a great library for web crawling. download


  download : npm i puppeteer


  Readline is a library used for gathering user input in real time. Usually comes pre-installed with node, however,if you're using older versions node.

  npm i readline


*/




class pup
{
  constructor()
  {
    this.browser = null;
    this.page = null; 
  }


  async gatheringInformation()
  {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage();
    await this.page.goto("https://www.gradescope.com/courses/843649") // Since this is a grade scope automatter

    const cookieChecker = await cs.loadLoginCookies(this.page);

    if(cookieChecker == false)
    {
      console.log
      (
        `Login to get started!
`
      )
      // Will repeat until true. Ran on recursion
      await this.getCookie();
      await cs.saveLoginCookie(this.page);
    }
    else
    {
      console.log("Welcome back, Fetching Data...")
    }
    
    await this.loggedIn();
  }



  async delayTimer(milliseconds)
  {
   await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }










  
  async loggedIn()
  { 
    const allAssignments = await this.assignmentsDueDetails();
    const check = allAssignments.gradedAssignments.filter(obj => obj.scoreChecker == true)
    //capturing the data with urls
    
    // Within these time spans, we could add the update on the user's loading side.
    for(let i = 0; i < check.length; i++)
    {
      check[i].score = await this.urlToScore(check[i].score);
    }
    
    //Resubmission assignments go with assignments
    allAssignments.assignments = allAssignments.assignments.concat(allAssignments.gradedAssignments.filter(a => a.resubmission == true));
    allAssignments.gradedAssignments = allAssignments.gradedAssignments.filter(a => a.resubmission == false);

    
    // Back to Default URL
    await this.page.goto("https://www.gradescope.com/courses/843649");

    // GUI index
    const menuIndex = await readline.menuToggler(allAssignments)

    // assignment object
    const assignment = allAssignments.assignments[menuIndex]; 
    
    if(assignment.resubmission)
    {
      this.resubmitAssignment(assignment.ResubmissionLink)
    }
    else
    {
      this.submitAssignment(assignment.postUrl);
    }    
  }


  async submitAssignment(uploaderTag)
  {
    await this.page.locator(`button[data-post-url="${uploaderTag}"`).click();

    this.finish()
  }


  async resubmitAssignment(uploaderTag)
  {
    await this.page.locator(`[href="${uploaderTag}"]`).click();
    await this.page.waitForNavigation()
    await this.page.locator(".js-submitAssignment").click();

    this.finish()
  }



  // Accessing the uploader is different, however, same procedure and outcome.
  async finish()
  {
    // Locating files on the local machine
    const fileObjects = await readline.requestingFileLocation();

    // filepath alongisde function which decides the exact file.
    const file = `${readline.defaultPath}${fileObjects[await readline.toggler(fileObjects,"",25)].text}`;

    // Submitting the file in the <input></input> field
    const fileInput = await this.page.$(".dz-hidden-input");
    await fileInput.uploadFile(file);

    // Returns site's data analysis, name and size
    const siteData = await this.uploadedAssignmentData(fileInput);

    // Confirmation form user. Yes Or No with 0 being yes and 1 being no, Binary reversed.
   const response = await readline.toggler([{text : "Yes"}, {text : "No"}], await readline.sitePrompt(siteData), 5);
    if(response == 0)
    {
      const {name, score, testCase} = await this.submittingAssignment();
      console.log(
      `

                                  Final Result

        Name : ${name}

        Score : ${score}

        Result : ${testCase}
      `
      )
    }
    else
    {
      console.log(" Figure out something from here. ")
    }
  }








  async getCookie()
  {
    const credentials = await readline.aquireLoginDetails();
    if(await this.fillLogin(credentials) == false)
    {
      console.log
      (
            `
The username and password you provided didn't work, try again!
            `
      )
        return this.getCookie(false);
      }
      else
      {
        console.log("This is valid")
      }

  }


  







  
  async fillLogin(credentials)
  {
    await this.page.locator("#session_email").fill(credentials.username);
    await this.page.locator("#session_password").fill(credentials.password);
    await this.page.locator(".tiiBtn-full").click();

    //This only works because gradescope redirects when using http request methods.
    await this.page.waitForNavigation();

    try
    {
      // Site always redirects, however if it redirects with an error 
      await this.page.waitForSelector(".alert-error", {timeout : 4000});
      return false
    }
    catch(e)
    {
      return true
    }
  }







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
 










  async submittingAssignment()
  {
    // This is the submit button located in the submitting modal.
    await this.page.locator('.tiiBtn-primary').click();
    await this.page.waitForNavigation();

    // Waiting for these essential elements to appear
    await this.page.waitForSelector("div.submissionOutlineHeader--totalPoints", {timeout : 100000}); // 10 minutes of waiting, the wait time is longer depending on tests, and file size. 
    await this.page.waitForSelector(".submissionOutlineTestCase");

    // These elements appear after all tests are passed.
    const assignmentAssessment = await this.page.evaluate( () => {
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
 









  
async assignmentsDueDetails() // This function extracts assignments' html from inside gradescope course.
  {
    // Wait for the rows to load (assuming multiple <th> elements with the class table--primaryLink)
    

    // Extract details for each row
    const assignments = await this.page.evaluate( async () => {
        
        // New Assignments 
        const newAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => th.querySelector('button'))
        .map(th => 
        ({
          text : th.querySelector("button").textContent,
          postUrl : th.querySelector("button") ? th.querySelector("button").getAttribute('data-post-url') : "find something else to do it!",
          date : th.querySelector(".submissionTimeChart--dueDate").textContent
        }))


        // Graded Assignments 
        const accessableAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => th.querySelector('a'))
        .map(th => 
        ({
          text : th.querySelector(".table--primaryLink").textContent,
          score : th.querySelector(".submissionStatus--score") ? th.querySelector(".submissionStatus--score").textContent : th.querySelector("a").href,

          // Handles the scrapper's search for grades 
          scoreChecker : th.querySelector(".submissionStatus--score") ? false : true,

          // Contains time chart? then we can resubmit it, else just display that score if it hasn't already.
          resubmission : th.querySelector(".submissionTimeChart--timeRemaining") ? true : false,
          
          ResubmissionLink : th.querySelector(".submissionTimeChart--timeRemaining") ? th.querySelector("a").getAttribute("href") : null,

          date : th.querySelector(".submissionTimeChart--dueDate") ? th.querySelector(".submissionTimeChart--dueDate").textContent : "Not Provided",

        }));
          

        /*
            Submitted assignments with no complete grade will have a link.
            The link will be used to grab the score from the phyiscal site.

         */

        // Assignments unable to submit
        const unaccessableAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => !th.querySelector('a') && !th.querySelector("button"))
        .map(th => 
        ({
            text : th.querySelector(".table--primaryLink").textContent,
            date : th.querySelector(".submissionTimeChart--dueDate") ? th.querySelector(".submissionTimeChart--dueDate").textContent : "Not Provided",
        }));

        return {
          assignments : newAssignments,
          gradedAssignments : accessableAssignments,
          unfinishedAssignments : unaccessableAssignments
        }
      });

    // returns gradescope assignments in an object format.
    return assignments
  }



  // Handles scores that haven't been approved by the system
  async urlToScore(url)
  {
    await this.page.goto(url,
    {
      waitUntil: 'domcontentloaded', // Loading DOM
      timeout: 60000, // 60 seconds timeout
    });

      const score = await this.page.evaluate(() =>
      {
        const scoreElement = document.querySelector(".submissionOutline--sectionHeading .submissionOutlineHeader--totalPoints");
        return scoreElement ? scoreElement.textContent.trim() : null;
      })

    return score
  }







}













const readline = new readlineFunctionality();const gradescope = new pup();const cs = new cookieStorage();const ls = new localStorage(gradescope.page);const path = new Path();
gradescope.gatheringInformation();
