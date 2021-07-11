export default class Icon {

    x=0;
    y=0;
    width=0;
    height=0;
    imgUrl="";
    image=null;

    constructor(x,y,width,height,imgUrl) {
        this.x=x;        
        this.y=y;
        this.width=width;
        this.height=height;
        this.imgUrl=imgUrl;
    }

    draw = function(ctx) {

    }
}