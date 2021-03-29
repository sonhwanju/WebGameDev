class InputSystem {
    constructor() {
        this.arr = [];

        document.addEventListener("keydown", (e)=>{
            this.arr[e.keyCode] = true;
        });
        document.addEventListener("keyup", (e)=>{
            this.arr[e.keyCode] = false;
        });
    }
    getkey(code) {
        return this.arr[code];
    }
}