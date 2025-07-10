/*
  - Please take into consideration that file paths should be handled differently based on one's opeating system
  - Project can only be ran in the project's directory.

  This will be apart of an awesome directory toggler.
  Using a pointer I can 

*/

import {stat, readdir} from "fs/promises";
import path, {join} from "path";
import os from "os";
import fs from "fs/promises"



class Path
{
  constructor()
  {
    this.currentDirectory = os.homedir(); // This should list out the home directory 
    //this.maxDepth = 5;
    this.directoryLayers = // This is a stack
    [ 
        // First layer is always the home directory
        // contains objs, referencing directory names and directory size 
    ];

    // When done, this should be used in a seperate script, folder/file script 
    this.maxKB = 10;

    // Hard coded file path, will update later on...
    this.jsonFile = "path.json";
  }
  
  async loadPath()
  { // This function is always ran first to check whether or not the path already exists. If the path does exist check its validity   
    try
    { // if this file exists it'll just read as normal


    const fileContent = await fs.readFile(this.jsonFile, 'utf-8'); 
    const data = JSON.parse(fileContent); // parse the data

    return data.path;
    }
    catch(e)
    {
      return false;
    }
    
  }

  sizeToPercentage(size) // since we got the size limit already, we'll just use this instances
  { // in relations to kb
    const sizeInKB = size / 1024;
    return Math.min(100, Math.round((sizeInKB / this.maxKB) * 100));
  }

  formatSize(bytes) 
  {
    const units = ['B', 'KB', 'MB', 'GB'];
  
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) 
    {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  }


  async readDirectory(d) // I think name is fine, find path through this.currentDirectory/name
  { // Adding my own reusable filtering
    const directories = (await readdir(d, { withFileTypes: true}))
    .filter(dir => dir.isDirectory() && !dir.name.startsWith('.'))
    .map(dir => dir.name);

    let totalSize = 0;
    const dir = await Promise.all( directories.map(async (directory) => 
    {
      const fullPath = path.join(this.currentDirectory, directory);
      try 
      {
        const size = (await stat(fullPath)).size;
        totalSize += size;
        return { name: directory, size: this.formatSize(size), barSize: this.sizeToPercentage(size) };
      } 

      catch (e) 
      {
        return { name: directory, size: 'unknown', barSize:0};
      }

    }))
    return { stats : dir, totalSize : this.formatSize(totalSize) };
  }
  
  async listDirectory() // ensuring items
  {
    const files = await this.readDirectory(this.currentDirectory);
    return files;
  }
  



  // I should take the argument of size, since it's limited to the size of the toggler. It wouldn't make sense to push useless data into memory, however, I could store it just in case the user want's to actually push it into the directorieslayers 
  async viewDirectory(directory) // viewing the directory doesn't write the change, but allows the user to view its content to ensure it's the correct directory.
  {
    // First check if it's a directory / folder , if not it can't be selected
    const folder = path.join(this.currentDirectory, directory);

    // list of items.
    return await this.readDirectory(folder);
  }

  // These two functionalities will be controlled by the arrow keys, gotta write new controllers for these two.
  
  async enterDirectory(dir)
  {
    let folder = this.currentDirectory;
    if(dir != this.currentDirectory) // For new directories being added to the main path
    {
      // This is particularly for the first instance, 
      folder = path.join(this.currentDirectory,dir);
      this.currentDirectory = folder;
    }
    const data = await this.readDirectory(folder);
    this.directoryLayers.push(data);
  }

  async leaveDirectory()
  { 
    // this is set into place so you cannot get past the home directory
    if(this.directoryLayers.length == 1)
    {
      //console.log("You cannot go back any further")
      return false;
    }

    // pop the current layer off 
    this.directoryLayers.pop();

    // change the path
    // To go back to the previous directory, we can just change current directory to its parent.
    this.currentDirectory = path.dirname(this.currentDirectory);

    return true;
  }

  async setDirectory(filePath)
  {
    // The directory can be typed in, so please validate it 
    try
    {
      // if the file exists just change it's value 
      const data = await fs.readFile(this.jsonFile, "utf-8");
      let jsonData = JSON.parse(data);
      jsonData.path = filePath;

      await fs.writeFile(this.jsonFile, JSON.stringify(jsonData), "utf-8")
    }
    catch(e)
    {
      await fs.writeFile(this.jsonFile, JSON.stringify({path : filePath}), 'utf-8')
    }
  }
}

//const moose = new Path();


/*
 
 These functions don't work as taking indicies, this is the react's side, you must actually put the directory's path's name 


 EXAMPLE
cwd = /Users/pizza/

directoriesToEnter = ["/desktop", "/folder1", "/folder2"]

viewDirectory(directoryName)

the directory name must me one the of string values and not just an index, therefore the react size must explicitlyreturn "/Desktop" instead of 0.

 
 
*/



/*//Testing the opeartions to see if they work
const test = async function()
{
    // This function is always called first to ensure we make a matrix with the appropriate starting directory. Home directory of the user.
    await moose.enterDirectory(moose.currentDirectory);
    const g = moose.directoryLayers[0].stats[3].name; // Desktop
    console.log(moose.directoryLayers);
    await moose.viewDirectory(g)
    //await moose.viewDirectory(g)
    await moose.enterDirectory(g);

    await moose.enterDirectory(moose.directoryLayers[1].stats[7].name)
    
    await moose.enterDirectory(moose.directoryLayers[2].stats[1].name)
      
    console.log(moose.directoryLayers)
    
    await moose.leaveDirectory();
    await moose.leaveDirectory();
    await moose.leaveDirectory();
    console.log(moose.directoryLayers)

}

test();*/

export default Path;




/*
    Vision

arrow is the where the pointer is. The pointer will 
 
 /desktop      |  Items.txt
>/moose        |  Goose.txt
 /applications |  Virus.exe 
               |  Boston.exe
      1/6               2/3

Current path = /Users/Diego/moose

choose this path?
yes or continue looking


Making it simple for someone who is new to the terminal experience.


Adding this way of seeing your files ahead of time is so awesome, makes everything easier. 



*/


/*
 
 Thinking ahead, we'll defintley need a file and folder script, to pretty print the stats.
 



viewDirectory.


we currently have 

this.currentdirectory = /usr/pizza
this.directoryLayers[[...][...][][]]






 
*/
