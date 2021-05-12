import {Game} from '/Game.js';    

class App {
    constructor() {
        this.socket = new io();
        this.addSocketEvent();
        this.pageContainer = $(".page-container");
        this.init();
        //this.debug(); //테스트용코드
        this.game = new Game();
        Game.instance = this.game;
    }
    init() {
        $("#btnLogin").addEventListener("click", ()=> {
            // let pc = document.querySelector(".page-container");
            // pc.style.left = "-2048px";
            let email = $("#loginEmail").value;
            let pw = $("#loginPassword").value;

            if(email.trim() === "" || pw.trim() === "") {
                alert("필수값이 비어있습니다.")
                return;
            }
            this.socket.emit("login-process",{email,pw});

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

    addSocketEvent() {
        this.socket.on("register-response",data=> {
            alert(data.msg);

            if(data.status) {
                $("#registerEmail").value = "";
                $("#registerName").value = "";
                $("#registerPass").value = "";
                $("#registerPassConfirm").value = "";
            }
        });
        this.socket.on("login-response", data=> {
            alert(data.msg);
            if(data.status) {
                $("#loginEmail").value = "";
                $("#loginPassword").value = "";
                this.pageContainer.style.left = "-1024px";
            }
        });
        
    }

    registerProcess() {
        let email = $("#registerEmail").value;
        let name = $("#registerName").value;
        let pw = $("#registerPass").value;
        let pwc = $("#registerPassConfirm").value;

        if(email.trim() === "" || name.trim()==="" || pw.trim() === "" || pw !==pwc) {
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