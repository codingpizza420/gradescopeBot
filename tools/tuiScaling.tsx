import {useState, useEffect} from "react";
import {useStdout} from "ink";

export function useTerminalSize() {
  const {stdout} = useStdout();

  // take one snapshot
  const [size, setSize] = useState(() => ({
    width: stdout.columns,
    height: stdout.rows
  }));

  useEffect(() => {
    const handler = () => {
      setSize({
        width: stdout.columns,
        height: stdout.rows
      });
    };

    stdout.on("resize", handler);
    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  return size;
}

export default useTerminalSize;

/*
 
    This function is designed to get the terminals width and height in pixel format without the buggy side effects of 
    using "process.stdout.rows" .

    This function also contains an event listener which will update the variables if the terminal is resized.

    function contains two variables, width and height 


    #HOW TO USE 

    const {width, height} = useTerminalSize();
 
*/
