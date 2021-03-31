class Player {
    constructor(x,y) {
        this.speed = 120;
        this.sprite = new Image;
        this.sprite.src = "/myGame/player.jpg";
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.targetX = x;
        this.targetY = y;

        this.l = 0.01;
    }

    setTarget(x,y) {
        this.targetX = x;
        this.targetY = y;
        this.l = Math.sqrt(Math.pow(this.targetX-this.x,2)+Math.pow(this.targetY-this.y,2));
    }
    update(d){
        /*if(this.x >= 600 - this.w || this.x < 0) {
            this.speed *= -1;
        }
        this.x += this.speed * d;*/
        this.x += ((this.targetX - this.x)/this.l)*this.speed* d;
        this.y += ((this.targetY - this.y)/this.l)*this.speed * d;
    }
    render(ctx){
        ctx.clearRect(0,0,600,400);
        ctx.drawImage(this.sprite,this.x,this.y,this.w,this.h);
    }
    checkCol(){
        
    }
}