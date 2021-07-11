import React, { useRef, useState, forwardRef, useImperativeHandle,makeStyles} from "react";


import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';


//global.counter=2;


const Splash = forwardRef((props, ref) => {

    const [counter,setCounter] = useState(1);

    let w=window.innerWidth;
    let h = window.innerHeight;
    let p=counter.toString();
    if (p.length==1) p="0"+p;
    global.url = "./images/Identifly/page"+p+".png";

    const nextImage = () => {
       // ++global.counter;
        setCounter(counter+1);
        if (counter>22) setCounter(1);
        p=counter.toString();
        if (p.length==1) p="0"+p;
        global.url = "./images/Identifly/page"+p+".png";

    }

    const prevImage = () => {
        // ++global.counter;
         if (counter>1) setCounter(counter-1);
         p=counter.toString();
         if (p.length==1) p="0"+p;
         global.url = "./images/Identifly/page"+p+".png";

     }

    return (
        <Box textAlign='center'>
        
        <Paper  onClick={() => {nextImage()}}> <img src={global.url} width={w} height = {h} /> </Paper>

        <Button variant="contained" color="primary" onClick={() => {prevImage()}}>   Back</Button>
      
        </Box>
    )

});

export default Splash