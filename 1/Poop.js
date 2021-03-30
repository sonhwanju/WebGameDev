class Poop {
    constructor() {
        this.x;
        this.y ;
        this.speed;
        this.r;
        this.color = 'rgba(230,150,30,0.5)';
        this.reset();
    }

    reset() {
        this.y = 0;
        this.x = Math.random()*400; // Math.random은 0~1까지의 랜덤값을 만듦
        this.speed = 20 + Math.random()*120;
        this.r = 5 + Math.random()*5;
        this.color = 'rgba(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ',0.5)';
    }
    update() {
        this.y += this.speed * 1/60;
        if(this.y > 800 + this.r) {
            this.reset();
        }
    }
    //1번과제 reset시 색상 랜덤
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}