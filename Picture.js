export default class Picture {
    image=null
    x=0;
    y=0;
    width=0;
    height=0;
    stretch=true;
    name="";
    url="";
    font="";
    text="Foo";


    constructor(name,url,x,y,width,height,stretch) {
        this.name=name;
        this.url=url;
        if (stretch===undefined) stretch=true;
        this.stretch=stretch;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.image = new Image();
    
        this.onload= () =>{

        }
        if (!url.includes(".")) url="data:image/png;base64, "+url;
        this.image.src=url;
    }

    draw = (ctx) => {
        let w=this.width;
        if (window.innerWidth<w) w=window.innerWidth;
        if (this.stretch) {
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x,this.y, ctx.canvas.width, ctx.canvas.height);
        }
        else {
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x,this.y, this.width, this.height);
            if (this.text!="") {
                ctx.fillStyle = "#FFFFFF";
                ctx.textAlign="center";
                ctx.font = ((this.height*60)/100).toString()+"px serif";
                ctx.fillText(this.text, this.x+this.width/2, this.y+this.height-this.height/3,this.width);
            }
        }
    }

    isHit = (x,y) => {
        let d=4;
        if (x>this.x+d && x< this.x+this.width-d && y>this.y+d && y< this.y+this.height-d) return this;
        return null;
    }


    clone = () => {
        let p= new Picture(this.name,this.url,this.x,this.y,this.width,this.height,this.stretch);
        return p;

    }
}