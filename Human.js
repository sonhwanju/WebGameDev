class Human {
    constructor(name = "게마고", age = 1) {
        this.name = name;
        this.age = age;
    }
    move() {
        console.log("이동", this.x);
    }
}