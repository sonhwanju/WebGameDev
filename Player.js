class Player {
    constructor(x,y,speed,w,h,sprite) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.w = w;
        this.h = h;
        this.sprite = sprite;

        this.input = new InputSystem();
    }

    update() {
        if(this.input.getkey(37)) {
            this.x -= this.speed * (1 / 60);
        }
        if(this.input.getkey(39)) {
            this.x += this.speed * (1 / 60);
        }
    }
    render(ctx) {
        ctx.clearRect(0,0,500,800);
        ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);
    }
}