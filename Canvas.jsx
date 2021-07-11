import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import JPanel from './JPanel'
import Picture from './Picture'
import Paper from '@material-ui/core/Paper';



const Canvas = forwardRef((props, ref) => {

  const canvasRef = useRef(null)

  let x=100;
  let y = 100;
  let dragging=false;
  let panel=new JPanel(100,50,50,50);
  let target=null;
  let mouseDragXStart=0;
  let mouseDragYStart=0;
  let targetXStart=0;
  let targetYStart=0;
  let canvas=null;
  let ctx=null;
  let canvasReady=false;
  let isVisible=true;
  let picture=null;
  let panelAlreadyHit=false;
  let icons=[];
  let draggingIcon=null;
  let elements =[];
  let currentElement=null;
  let offX=0;
  let offY=0;



  const callback = () => {
      props.callback(panel.x,panel.y,panel.width,panel.height);
  }



  const loadIcons = () => {
    let buttonIcon =  new Picture("Button",'./images/button.png',30,30,100,50,false);
    icons.push(buttonIcon);
    let textInput =  new Picture("TextInput",'./images/textInput.png',30,90,100,50,false);
    icons.push(textInput);
  }

  const drawIcons = () => {
    for (var i=0;i<icons.length;++i) {
       icons[i].draw(ctx);
    }
  }

  
  const drawElements = () => {
    for (var i=0;i<elements.length;++i) {
       if (elements[i]!==null) {
          elements[i].draw(ctx);
       }
    }
  }

  const drawDraggingIcon = (x,y) => {
      draggingIcon.x=x-offX;
      draggingIcon.y=y-offY;
      draggingIcon.draw(ctx);
  }

  const updateCurrentElement = () => {
     panel.move(currentElement.x,currentElement.y,currentElement.width,currentElement.height);
  }
  
  const draw = () => {

    if (ctx===null) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    if (picture!==null) picture.draw(ctx);
    if (currentElement!=null) updateCurrentElement();
    drawElements();
    drawIcons();
    if (draggingIcon!==null) {
      drawDraggingIcon(x,y);
    }
    let dx=x-mouseDragXStart;
    let dy=y-mouseDragYStart;
    if (target!=null)  moveHandle(dx,dy,target);
    panel.draw(ctx);
    callback();
  }

  const moveHandle=(dx,dy,target) => {
      panel.moveDelta(dx,dy,target);
      if (currentElement!=null) {
        currentElement.width=panel.width;
        currentElement.height = panel.height;
        currentElement.x=panel.x;
        currentElement.y=panel.y;
      }
  }

  // called by onmousemove during dragging
   const moveCircle = (e) => {
   // e.preventDefault();
      if (canvas==null) return;
    if (canvas===null) canvas = canvasRef.current
    if (ctx==null) ctx = canvas.getContext('2d')
    if (!dragging) return;
    x=e.offsetX;
    y=e.offsetY;
    draw()
  } 

  const startDrag = (e) => {
    e.preventDefault();
    let xx=e.offsetX;
    let yy=e.offsetY;
    target=null;

    let iconHit=checkIfIconsHit(xx,yy);
    if (iconHit) {
       handleIconHit(iconHit,xx,yy);
       dragging=true;
       mouseDragXStart=xx;
       mouseDragYStart=yy;
       return;
    }

    let elementHit=checkIfElementsHit(xx,yy);
    if (elementHit) {
       handleElementHit(elementHit,xx,yy);
       dragging=true;
       mouseDragXStart=xx;
       mouseDragYStart=yy;
       return;
    }


    target=handleHit(xx,yy);
    if (target!==null) {
        mouseDragXStart=xx;
        mouseDragYStart=yy;
        panel.setStartXY(panel.x,panel.y);
        dragging=true;
    } 
  }

  const stopDrag = (e) => {
    e.preventDefault();
    dragging=false;
    if (draggingIcon!==null) {
      elements.push(draggingIcon);
      currentElement=draggingIcon;
      draggingIcon=null;
    }
    draw();
  }
  const checkIfElementsHit= (x,y) => {
    for (var i=0;i<elements.length;++i) {
      let elm=elements[i].isHit(x,y);
      if (elm!==null) return elm;
    }
    return null;
}

const handleElementHit = (elm,xx,yy) => {
  draggingIcon = elm;
  offX=xx-draggingIcon.x;
  offY=yy-draggingIcon.y;
}

  const checkIfIconsHit= (x,y) => {
      for (var i=0;i<icons.length;++i) {
        let icn=icons[i].isHit(x,y);
        if (icn!==null) return icn;
      }
      return null;
  }

  const handleIconHit = (icn,xx,yy) => {
    draggingIcon =icn.clone();
    offX=xx-draggingIcon.x;
    offY=yy-draggingIcon.y;
  }


  const handleHit = (x,y) => {



    let dl=5;
    if (x>panel.x+dl && x<panel.width+panel.x-dl  && y>panel.y+dl && y<panel.height+panel.y-dl ) {
      return panel;
    }
    target=null;
    let d=100000;
    let cd=0;
    cd = getDistance(x,y,panel.NW);
    if (cd<d) {
      d=cd;
      target=panel.NW;
    }
    cd = getDistance(x,y,panel.NE);
    if (cd<d) {
      d=cd;
      target=panel.NE;
    }
    cd = getDistance(x,y,panel.SE);
    if (cd<d) {
      d=cd;
      target=panel.SE;
    }
    cd = getDistance(x,y,panel.SW);
    if (cd<d) {
      d=cd;
      target=panel.SW;
    }
    if (d>15) target=null;
    return target;
  }

  const getDistance= (x,y,h) => {
    let dx=x-h.x;
    let dy=y-h.y;
    let d=dx*dx+dy*dy;
    return d;
  }

  const initCanvasEvents = () => {
    if (canvas===null) return;

   
    canvas.style.touchAction="none";
    canvas.addEventListener('pointerdown', (e) => startDrag(e));
    canvas.addEventListener('pointerup', (e) => stopDrag(e));
    canvas.addEventListener('pointermove', (e) => moveCircle(e));
    picture=new Picture("Background",'./images/grid.png',0,0,canvas.width,canvas.height);
    canvasReady=true;
  }

  useImperativeHandle(ref, () => {
    return {
        loadImage:loadImage
    };
  });

  const loadImage = (url) => {
    if (picture==null) picture=new Picture("SomePicture",url,0,0,canvas.width,canvas.height);
    else {
            global.amount+=0.05;
            picture.image.onload= () =>{
            draw();
        }
    }
    if (!url.includes(".")) url="data:image/png;base64, "+url;
    picture.image.src=url;
  
  }
  
  useEffect(() => {

    if (canvas==null) {
      canvas = canvasRef.current
      let w=window.innerWidth;
      let h=window.innerHeight;
     // if (window.innerWidth<w) w=window.innerWidth;
      canvas.width=w;
      canvas.height = h;
      loadIcons();
    }
    if (ctx==null) ctx = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId

    if (canvas!==null) {
        if (!canvasReady) initCanvasEvents();
    }
    global.canvas=canvas;

    const render = () => {
      frameCount++
      draw(ctx, frameCount)
 
    }
    render()
    
    return () => {
    //  window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
 
  return (
    <div>
    <canvas ref={canvasRef} {...props}/> 
    <p></p>

    </div>
    )

});  





export default Canvas