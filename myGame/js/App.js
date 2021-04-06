class App 
{
    constructor() {
        this.player = new Player(290,190);
        this.canvas = document.querySelector("#myGame");
        this.ctx = this.canvas.getContext("2d");

        this.coin = new Coin(80,80,20,20);
        this.coin2 = new Coin(160,160,20,20);
        this.coin3 = new Coin(20,20,20,20);
        
                                         //=> 써야 위 참조가능
        this.canvas.addEventListener("click", (e)=> {
        this.player.setTarget(e.offsetX - this.player.w/2,e.offsetY - this.player.h/2);
        });
       setInterval(()=>{
            this.update();
            this.render(); 
        }, 1000/60);
    }

    update() {
        this.player.update(1/60);
        this.coin.update(1/60);
        this.coin2.update(1/60);
        this.coin3.update(1/60);
    }
    render() {
        this.ctx.clearRect(0,0,600,400);
        this.player.render(this.ctx);
        this.coin.render(this.ctx);
        this.coin2.render(this.ctx);
        this.coin3.render(this.ctx);
    }

}