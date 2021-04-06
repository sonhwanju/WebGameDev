class Coin 
{
    constructor() {
        this.x ;
        this.y ;
        this.coinSprite = new Image();
        this.coinSprite.src = "/myGame/images/coin.png";
        this.redCoinSprite =  new Image();
        this.redCoinSprite.src = "/myGame/images/redcoin.png";
        this.w ;
        this.h;

        this.t = 0;
        this.nextT = 3;
        this.isRed = false;

        this.reset();
    }
    reset() {
        this.w = this.h = Math.random()*30 + 10;
        this.x = Math.random()*(600-this.w);
        this.y = Math.random()*(400-this.h);
    }
    update(d) {
        this.t += d;
        if(this.t >= this.nextT) {
            this.t = 0;
            this.isRed = !this.isRed; 
        }
        
    }

    render(ctx) {
        if(this.isRed == true) {
            ctx.drawImage(this.redCoinSprite,this.x,this.y,this.w,this.h);
        }
        else if(this.isRed == false){
            ctx.drawImage(this.coinSprite,this.x,this.y,this.w,this.h);
        }
        
    }

   
}