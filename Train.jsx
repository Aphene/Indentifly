import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Canvas from './Canvas'
import User from './User'
import Ajax from './Ajax'
import Amount from './Amount'
import { requirePropFactory } from "@material-ui/core";

const Train = forwardRef((props, ref) => {
    const divRef = useRef(null)
    const canvasRef = useRef(null)
    let x=0.0;
    let y=0.0;
    let width=0.0;
    let height=0.0;
    let imageIndex=0;
    let imageCount=50;
    let currentUrl="";
    let userID=0;


    const [count,setCount] = useState(0);

    useEffect (() => {
       // getNextImage();
    } ,[]);




    const getNextImage = () => {
     //   global.ajax.get(global.server+"GetNextAvailableTrain&UserID="+global.userID+"&JobID="+global.currentJob.ID+"&Amount="+global.Amount.toString(),getNextTrainReply);

    }

    const getNextTrainReply = (reply) => {
        if (reply.includes("Error:")) {
            if (reply.includes("No Train")) {
                alert ("All done for this job!");
                global.gotoPage("Dashboard");
                return;
            }
            alert(reply);
            return;
        }
        global.currentTrain=JSON.parse(reply);

        global.ajax.get(global.server+"GetTaskImage&TaskID="+global.currentTrain.TaskRecordID,getImageDataReply);
        ++imageIndex;
        setCount(imageIndex);
    }

    const getImageDataReply = (data) => {
        canvasRef.current.loadImage(data);
    }

    const getImage= (url) => {
        canvasRef.current.loadImage(url);
    }

 

    const report = (oldUrl) => {
        let t=global.currentTrain;
        t.X=x/global.canvas.width;
        t.Y=y/global.canvas.height;
        t.W=width/global.canvas.width;
        t.H=height/global.canvas.height;
        let data=JSON.stringify(t);        
       
     //   global.ajax.post(global.server+"ReportTrain&JobID="+global.currentJob.ID+"&UserID="+global.userID,data,reportReply);
    }

    const reportReply = (reply) => {
        
        getNextImage();
    }


      const callback = (xx,xy,xwidth,xheight) => {
        x=xx;
        y=xy;
        width=xwidth;
        height=xheight;
      }

      const showAmount = () => {
          var wtf=global.amount;
          return <Amount/>

      }

    return (
        <div ref ={divRef} >
            <p></p>
         <Box textAlign='center'>
          <Canvas ref={canvasRef} callback={callback} />
          <p></p>
    Move the sqare around the car with as tightly as possible, then press 'Submit Image'
          <p></p>

          <Button variant="contained" color="primary" onClick={() => {report()}}>   Submit Image</Button>
          ....
          <Button variant="contained" color="primary" onClick={() => {global.gotoPage("Dashboard")}}>  Finished</Button>
          <p></p>
          <p></p>
          {showAmount()}
          </Box>
      </div>

    )
});

export default Train