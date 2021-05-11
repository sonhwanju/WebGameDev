import {Game} from '/Game.js';    

class App {
    constructor() {
        this.socket = new io();
        this.pageContainer = $(".page-container");
        this.init();
        //this.debug(); //테스트용코드
        this.game = new Game();
        Game.instance = this.game;
    }
    init() {
        $("#btnLogin").addEventListener("click", ()=> {
            let pc = document.querySelector(".page-container");
            pc.style.left = "-2048px";

        });
        $("#btnStart").addEventListener("click",()=>{
            this.game.start();
        });
        $("#btnStart").addEventListener("keydown",e=>{
            e.preventDefault();
            return false;
        });

        $("#btnRegister").addEventListener("click", e=> {
            this.registerProcess();
        });
    }

    registerProcess() {
        let email = $("#registerEmail").value;
        let name = $("#registerName").value;
        let pw = $("#registerPass").value;
        let pwx = $("#registerPassConfirm").value;

        if(email.trim() === "" || name.trim()==="" || pw.trim() === "" || pw!==pwc) {
            alert("공백이거나 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        this.socket.emit("register-request",{email,name,pw,pwc});
    }

    debug(){
        $("#btnLogin").click();
    }
}

function $(css) {
    return document.querySelector(css);
}

window.addEventListener("load",e => {
    let app = new App();
});