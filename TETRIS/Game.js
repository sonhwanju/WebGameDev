export class Game {
    constructor() {
        this.canvas = document.querySelector("#gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.frame = null;
        this.arr = [];
    }

    update(){

    }
    render(){

    }

    start() {
        if(this.frame != null) {
            clearInterval(this.frame);
        }
        this.frame = setInterval(()=> {
            this.update();
            this.render();
        });
    }
}