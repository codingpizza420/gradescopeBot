import fs from "fs/promises" // Handling async calls
// Login Handler
class cookieStorage
{
  constructor(page)
  {
    this.page = page;
  }
  async loadLoginCookies()
  {
    try
    {
      const cookieString = await fs.readFile("./cookies.json");
      if(cookieString)
      {
        const cookies = JSON.parse(cookieString);
      
        //Setting the Cookies, we should be redirected to the main menu
        await this.page.setCookie(...cookies);
        // Need to error handle if cookie doesn't work. saveLoginCookie is good, however we can create an update cookie.
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
  
  async loadCookie(browserContext)
  {
    const cookieString = await fs.readFile("./cookies.json");
    if(cookieString)
    {
      const cookie = JSON.parse(cookieString);
      await browserContext.setCookie(...cookie);
      return true;
    }
    else
    {
      return false;
    }

  }

  async validateCookie()
  {
    // This function will become really important later on.
  }

  // This function is accessed post navigation handling.
  async saveLoginCookie()
  {
    const cookies = await this.page.cookies();
    await fs.writeFile("./cookies.json", JSON.stringify(cookies, null, 2));
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


export default cookieStorage;

