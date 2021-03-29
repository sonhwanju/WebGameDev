class Game {
    constructor(canvas) {
        this.objectList = [];
        let img = new Image();
        img.src = "/player.jpg";

        let p = new Player(220, 740, 200, 40, 60, img);
        this.objectList.push(p);
        
        this.ctx = canvas.getContext("2d");

        setInterval(()=>{
            this.update();
            this.render(this.ctx);
        },1000/60);
    }

    update() {
        this.objectList.forEach(item => item.update());
    }
    render(ctx) {
        this.objectList.forEach(item => item.render(this.ctx));
    }
}