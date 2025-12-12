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
      // This is a bit sloppy, can defintley figure out a better way!!!!
      // this is the original course url, before the score grabber takes over
      const currentCourseURL = this.page.url();  

      const assignments = await this.page.evaluate( () => 
      {
        try
        {
          // assignments
          const newAssignments = Array.from(document.querySelectorAll("tbody tr"))
          .filter(th => th.querySelector('button'))
          .map(th =>
          ({
          text : th.querySelector("button").textContent,
          postUrl : th.querySelector("button") ? 
            th.querySelector("button").getAttribute('data-post-url') : 
            "find something else to do it!",
          date : th.querySelector(".submissionTimeChart--dueDate").textContent
        }))

        // graded assignments
        const accessableAssignments = Array.from(document.querySelectorAll("tbody tr"))
        .filter(th => th.querySelector('a'))
        .map(th =>
        ({
          text : th.querySelector(".table--primaryLink").textContent,
          score : th.querySelector(".submissionStatus--score") ? 
            th.querySelector(".submissionStatus--score").textContent : 
            th.querySelector("a").href,
          // determines if the scrapper needs to search for the grade
          scoreChecker : th.querySelector(".submissionStatus--score") ? false : true,
          // Contains time chart? then we can resubmit it, else just display that score if it hasn't already.
          resubmission : th.querySelector(".submissionTimeChart--timeRemaining") ? true : false,
          ResubmissionLink : th.querySelector(".submissionTimeChart--timeRemaining") ?
            th.querySelector("a").getAttribute("href") : 
            null,

          date : th.querySelector(".submissionTimeChart--dueDate") ? 
            th.querySelector(".submissionTimeChart--dueDate").textContent : 
            "Not Provided",
        }));
        return {
          assignments : newAssignments,
          gradedAssignments : accessableAssignments,
        }
        }
        catch(error)
        {
          console.error(error);

          // default
          return { assignments: [], gradedAssignments: [] };
        }
      });
    
      // We're given two objs, one storing an array of assignments, and the other storing graded/resubmittable asssignments 
    
      // Running some swapping filtering 
      const resubmittable = assignments.gradedAssignments.filter(a => a.resubmission);
      assignments.assignments.push(...resubmittable); // Have to flatten it out 
      assignments.gradedAssignments = assignments.gradedAssignments.filter(a => !a.resubmission);

      
      // URL -> SCORE
      // important for resubmittable assignments
      for (const list of [assignments.assignments, assignments.gradedAssignments]) 
      {
        for (const a of list) 
        {
          if (a.scoreChecker && a.score) 
          {
            a.score = await this.urlToScore(a.score);
            a.scoreChecker = false;
          }
        }
      }
      
      // before returning assignments return back to course page, again, can figure out a better and more optimal solution. solution is simple, don't use main page to do this job, that's what the browser contexts are for.
    //
      await this.page.goto(currentCourseURL, 
      {
        waitUntil: "domcontentloaded"
      });
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
