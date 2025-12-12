import React, {useState, useEffect} from "react";
import{render, Box, Text, useInput} from "ink";
import {Section} from "../tools/sectionToggler.js";
import {Toggler} from "../tools/selectionToggler.js";
// The checkbox
import {selectedItem} from "./assignments.js";

/*

  How this will work, 

                                       |    {file.py}
  { Name Of Assignment } { Check Box } |    {file.py}
    {fileName}                         |    {file.cpp}
                                       |    {file.cpp}

                                            press C to confirm, press R to return to submission
 
 */

function assignmentDesign(assignment, active, checked, file)
{
  const {text, date} = assignment; 
  return (
    <Box
			flexDirection="column"
			borderStyle="round"
			borderColor={active ? "cyan" : "gray"}
			width={50}
      gap={1}
		>
			<Box flexDirection="row" justifyContent="space-between" >
				<Text bold>{text}</Text>
        {selectedItem(checked)}
			</Box>

			<Box flexDirection="row" justifyContent="space-between">
				<Text dimColor={active ? false : true}>{date}</Text>
				<Text dimColor={active ? false : true}>file: {file ? file.name : file}</Text>
			</Box>
		</Box>
  ) 
}

function FileDesign({data, active, index})
{
  // array of files (name, size)
  const trulyActive = active != index;
  const {name, size} = data;
  return(
    <Box
      width="100%"
      borderStyle="round"
      borderColor={trulyActive ? "grey" : "cyan"}
      borderDimColor={trulyActive}
    >
      <Text color="white" dimColor={trulyActive} bold={trulyActive}>{name}</Text>
      <Text color="green"> {size}</Text>
    </Box>
  )
}



function fileSection(items, limit, pointer)
{
   return (
    <Section
      items={items}
      limit={limit}
      pointer={pointer}
      height={45}
      width={55}
      renderComponent={(item,index,key) => 
      (
        <Box
          key={index}
          flexDirection={"column"}
          alignItems="center"
          gap={1}
        >
          <FileDesign
            key={key}
            data={item}
            active={pointer}
            index={index + (Math.ceil((pointer + 1) / limit) - 1) * limit}
          />
        </Box>
      )}
    />
  )
}


// write a script that updates files, sets them to change the submission statues

function assignFile(filesChosen, changeFiles, file, setRefresh)
{
  filesChosen.push(file);
  changeFiles(filesChosen);
  setRefresh(r => !r);
  return;
}

function unassignFile(filesChosen, changeFiles, setRefresh)
{
  filesChosen.pop();
  changeFiles(filesChosen);
  setRefresh(r => !r);
  return;
}

function submit(data, files)
{
  console.log("You've just submitted the assingmnets");
  console.log(data, files);

  return;
}


function AssignmentStatus({data, readDir, currentDirectory, setMenu, submitAssignments, path})
{
  const [files, setFiles] = useState([]); 
  const [filesReady, setReady] = useState(false);
  const [filePointer, setFilePointer] = useState(0);


  const [submitResults, setSubmitResults] = useState(null);
  async function handleSubmit() 
  {
    const results = await submitAssignments(data, filesChosen, path);
    setSubmitResults(results);
  }





  const limit = 10;
  
  // have to reset after every enter
  const [refresh, setRefresh] = useState(false);

  /*
    For changing different assignments in different orders, it'd be easier to use an object instead of a stack
    const [assignmentsStatus, updateAssignmentsStatus] = useState({})
  */
  // A stack, line up the files chosen with the assignments order
  //
  //  [assignment1, assignment5, assignment2, assignment4]
  //                        Selected
  //  [math.py, script.py, moose.cpp, goose.cpp]
  //

  const [filesChosen, changeFiles] = useState([]);
  // This can get a little confusing but we can use the length of the filesChosen to determine which assignments have been assigned a file

  useInput((input, key) => 
  {
    if(input === "d" && filesChosen.length > 0)
    {
      unassignFile(filesChosen, changeFiles, setRefresh);
    } 

    if(input === "s")
    {
      handleSubmit();
    }
  });
    
  useEffect(() => 
  {
    (async () => 
     {
        if(filesReady == false)
        {
          const result = await readDir(currentDirectory);
          setFiles(result);
          setReady(true);
        }
      })();
  }, []);
  
  if(filesReady)
  { 
    return(
    
      <Box 
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >

        <Box
          height={45}
          width={55}
          flexDirection={"column"}
          borderStyle="single"
          borderColor="grey"
        >
        {
          data.map( (item, i) => 
          {
            const isActive = i === filesChosen.length;

            const currentFile = filesChosen.length > 0 ?
              filesChosen[i]
              : "";

            // [assignment1, assignment2, assignment3,assignment4]
            // [file.py,file.cpp]
            const checked = i <= filesChosen.length -1

            return( <Box key={i}>
              {
                assignmentDesign(item, isActive, checked ,currentFile )
              }
            </Box>)
          })
        }
        
        </Box>
      <>
       <Toggler
        pointerLimit={files.length - 1}
        activeElement={filePointer}
        setActiveElement={setFilePointer}
        enterFunction={ () => assignFile(filesChosen, changeFiles, files[filePointer], setRefresh) }
        DisplayElements={() => fileSection(files, limit, filePointer ) }
        verticalArrows={true}
        horizontalArrows={false}
        setMenu={setMenu}
        location={"assignments"}
       /> 

      </>
        
    </Box>
    )
  }
}

export {AssignmentStatus};

