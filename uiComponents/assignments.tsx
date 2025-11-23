import React, {useState} from "react";
import{render, Box, Text} from "ink";
import AssignmentModel from "./assignmentStateModels.js";
import ProgressMenu from "../uiComponents/progress-main.js";
import { ProgressBar } from "@inkjs/ui";


import { Section } from "../tools/sectionToggler.js";
import {Toggler} from "../tools/selectionToggler.js";


function selectedItem(selected)
{
  return (
	  <Text bold>[{selected ? <Text color="green" bold>X</Text> : " "}]</Text>
	);
}




function DisplaySubmittableDesign({item, active, index, selectedAssignments})
{
  const {text, date, score} = item;
  const hasGrade = score ? score : "N/A";
  const isActive = index == active;
  //const selected = selectedAssignments[pointer]
  /*
  
  We're going to be creating our own selected. Therefore, this means when an item is selected it'd be displayed like this [x](green and bolded)
  If not selected, it will be displayed like this [ ]
  
  */
 return (
		<Box
			borderStyle="round"
			borderColor="cyan"
			borderDimColor={!isActive}
			width={50}
			height={5}
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
		>
			<Box
				width={5}
				alignItems="center"
				justifyContent="flex-start"
			>
				{selectedItem(selectedAssignments.includes(index))}
			</Box>

			<Box
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
			>
				<Text color="cyan" bold dimColor={!isActive}>
					{text}
				</Text>

				<Text color="white" bold dimColor={!isActive}>
					Grade: {hasGrade}
				</Text>

				<Text color="white" bold dimColor={!isActive}>
					Due Date: {date}
				</Text>
			</Box>
		</Box>
	);
  }

function DisplaySubmittableAssignments({data, setMenu})
{
  const [pointer, setPointer] = useState(0);
  const limit = 6;
  const [selectedAssignments, setSelectedAssignments] = useState([]); // an array storing indicies of assingmnets chosen.
  const [refresh, setRefresh] = useState(false);
  
  function selectAssignment() 
  {
	  const exists = selectedAssignments.includes(pointer);
	  let newSA;

	  if (exists)
    {
		  // remove → compress the queue
		  newSA = selectedAssignments.filter(i => i !== pointer);
	  } 

    else
    {
		  // push to the end
		  newSA = [...selectedAssignments, pointer];
	  }

	  setSelectedAssignments(newSA);
	  setRefresh(r => !r);
}

 	const assignmentDisplayer = () => (
    <Box 
      // Forcing the refresh, so selected status are show instantly!
      key={refresh ? 'r1' : 'r0'}>
		<Section
			items={data}
			limit={limit}
			pointer={pointer}
			height={45}
			width={55}
			renderComponent={(item, index, key) => (
				<DisplaySubmittableDesign
					key={key}
					item={item}
					active={pointer}
					index={index + ((Math.ceil((pointer + 1) / limit) - 1) * limit)}
          selectedAssignments={selectedAssignments}
				/>
			)}
		/>
    </Box>
	);

	return (
		<Box
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
			width="100%"
			height="100%"
		>
			<Toggler
				pointerLimit={data.length - 1}
				activeElement={pointer}
				setActiveElement={setPointer}
				enterFunction={selectAssignment}
				DisplayElements={assignmentDisplayer}
				verticalArrows={true}
				horizontalArrows={false}
				setMenu={setMenu}
				location="submit"
			/>

      <Box
        height={45}
        width={55}
        borderStyle="single"
        borderColor="gray"
        flexDirection="column"
        alignItems="center"
      >
      {
        selectedAssignments.map((index, i) => 
        {
		      const item = data[index];
		      return (
			      <Box key={i}>
				      <Text color="gray">{item.text}</Text>
			      </Box>
		      );
	      })
      }
      </Box>
		</Box>
	);


}


function setAssignment({setCurrentAssignmentDetails, assignment})
{
  setCurrentAssignmentDetails(assignment);
}



function AssignmentMenuToggler({result, setCurrentAssignmentDetails, active, setMenu})
{
// Result contains 3 objects
  const {assignments, gradedAssignments} = result;
  //const [activeElement, setActiveElement] = useState(0); // Starting at the first index, latest assignment. 
  // minus one because we need to start at the zeroth index
  //const limit = assignments.length == 0 ? 0 : assignments.length - 1;
  

  // This is the menu to choose whether to resubmit or to view a grade.
  return(
    <Box>
      <ProgressMenu
        assignments={assignments}
        gradedAssignments={gradedAssignments}
        active={active}
        setMenu={setMenu}
    />
    </Box>
  )
};

/*
 Breif explanation

 3 states of assignments,

 Assignments
 Text
 PostURL
 date



 Assignments with resubmission available( Due date has not passed )
 Text
 score (usually a url, gradescope will not give you a definate answer if it isn't passed due date)
 scoreChecker
 resubmissionLink
 date




 Graded Assignments (Simplest)
 Text
 score (usually a number)
 scoreChecker url, if not grade
 resubmission (false)
 resubmissionLink (false)
 date



*/

export {AssignmentMenuToggler, DisplaySubmittableAssignments};
