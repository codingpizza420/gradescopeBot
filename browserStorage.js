const puppeteer = require("puppeteer");
const fs = require("fs").promises; // Handles async code only
// Login Handler
class cookieStorage
{
  constructor()
  {
    
  }
  async loadLoginCookies(page)
  {
    try
    {
      const cookieString = await fs.readFile("./cookies.json");
      if(cookieString)
      {
        const cookies = JSON.parse(cookieString);
    
        //Setting the Cookies
        await page.setCookie(...cookies);
        await page.goto("https://www.gradescope.com/courses/843649");

        return true
      }
      else
      {
        return false
      }
    }
    catch(e) // Easy way to handle, No cookies causes an error and we take advantage of that.
    {
      return false
    }
  }


  // This function is accessed post navigation handling.
  async saveLoginCookie(moose)
  {
    const cookies = await moose.cookies();
    await fs.writeFile("./cookies.json", JSON.stringify(cookies, null, 2));
    console.log("cookies have been handled.")
  }

  updateLoginCookie()
  {
    return
  }

  deleteCookie()
  {
    return
  }

}

// attribute data storage (previously returned grades,)
class localStorage
{
  constructor(page)
  {
    this.page = page
  }
  
  saveLocally()
  {
    return
  }

  updateLocally()
  {
    return
  }

  deleteLocally()
  {
    return
  }
  

}


module.exports = {cookieStorage, localStorage};

