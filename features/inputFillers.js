class inputFillers
{
  constructor(page)
  { 
    this.page = page;
  } 

  async fillLoginDetails(username, password)
  {
    await this.page.locator("#session_email").fill(username);
    await this.page.locator("#session_password").fill(password);
    await this.page.locator(".tiiBtn-full").click();
    //This only works because gradescope redirects when using http request methods.
    await this.page.waitForNavigation(); // Trust this will get recirect us to "https://gradescope.com/account"

      // Site always redirects, however if it redirects with an error 
      // credentials were valid is to check the status code response
      // When the redirection takes place, regardless of right or wrong, the status code for a valid user will be 302.
      // All that's left is to display the courses available. 
      //
      //
     try
     { // Based on reactions of the login service, not the best way to handle it but this'll do. Update it when this project works, Look at network response!!!
       await this.page.waitForSelector(".alert-error", {timeout : 4000})    
       const errorMSG = await this.page.evaluate (async () => { return document.querySelector(".alert-error").textContent });
       return {error_message: await errorMSG, valid: false}
     } 
     catch(e)
     {
       return true
     }
  }

    async loadCourses() // Only works if we're at https://gradescope.com/account
    {
      const courses = await this.page.evaluate(async () => 
      {
        const courseBox = document.querySelector(".courseList");
        // I notice that there is a division between courses taken in different terms. I believe it to be divided by 4 seasons, alongside year. However, the most recent ones are in the front, therefore, I'm just going to get a list of terms alongside their dates for now.

        const listOfCourses = Array.from(courseBox.querySelectorAll("a.courseBox"))
        .map( course =>
        ({
            name:  course.querySelector(".courseBox--name").textContent,
            shortname :  course.querySelector(".courseBox--shortname").textContent,
            numOfAssignments : course.querySelector(".courseBox--assignments").textContent,
            href : course.getAttribute("href"),
        }))

        return listOfCourses; // returning a list of courses
      });
      return courses
    }




    async assignmentsDueDetails() // Assuming we're currently at https://gradescope.com/${courses[index].href}
    {
      // Wait for the rows to load (assuming multiple <th> elements with the class table--primaryLink)
      // Extract details for each row
      let newAssignments = [];
      let accessableAssignments = []; 

        const assignments = await this.page.evaluate( () => {
        try
        {
        // New Assignments
        newAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => th.querySelector('button'))
        .map(th =>
        ({
          text : th.querySelector("button").textContent,
          postUrl : th.querySelector("button") ? th.querySelector("button").getAttribute('data-post-url') : "find something else to do it!",
          date : th.querySelector(".submissionTimeChart--dueDate").textContent
        }))


        // Graded Assignments
        accessableAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => th.querySelector('a'))
        .map(th =>
        ({
          text : th.querySelector(".table--primaryLink").textContent,
          score : th.querySelector(".submissionStatus--score") ? th.querySelector(".submissionStatus--score").textContent : th.querySelector("a").href,

          // determines if the scrapper needs to search for the grade
          scoreChecker : th.querySelector(".submissionStatus--score") ? false : true,

          // Contains time chart? then we can resubmit it, else just display that score if it hasn't already.
          resubmission : th.querySelector(".submissionTimeChart--timeRemaining") ? true : false,

          ResubmissionLink : th.querySelector(".submissionTimeChart--timeRemaining") ? th.querySelector("a").getAttribute("href") : null,

          date : th.querySelector(".submissionTimeChart--dueDate") ? th.querySelector(".submissionTimeChart--dueDate").textContent : "Not Provided",

        }));
        }
        catch(error)
        {
        console.error(error, "this is the error")
        }



        /*
            Submitted assignments with no complete grade will have a link.
            The link will be used to grab the score from the phyiscal site.

         */

        // Assignments unable to submit
        /*const unaccessableAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => !th.querySelector('a') && !th.querySelector("button"))
        .map(th =>
        ({
            text : th.querySelector(".table--primaryLink").textContent,
            date : th.querySelector(".submissionTimeChart--dueDate") ? th.querySelector(".submissionTimeChart--dueDate").textContent : "Not Provided",
        }));*/

        return {
          assignments : newAssignments,
          gradedAssignments : accessableAssignments,
          //unfinishedAssignments : unaccessableAssignments
        }
      });

      //  returns gradescope assignments in an object format.
      return assignments
    }
  





  // Handles scores that haven't been approved by the system
  async urlToScore(url) // When using this function, it's important to go back into the original https://gradescope.com/${courses[index].href}
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


    async updateCourse()
    {
      return
      //const course = 
    }

    async loadCourseDetails()
    {
      // search the loaded object. if the object contains the details display them. Can refresh at any point!
      return;  
    }
  }

  

export default inputFillers;
