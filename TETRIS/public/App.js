import { Game } from '/Game.js';
import { $ } from '/Query.js';

class App {
    constructor() {
        this.socket = new io();
        this.addSocketEvent();
        this.pageContainer = $(".page-container");
        this.init();
        //this.debug(); //테스트용코드
        this.game = new Game(this.socket);
        Game.instance = this.game;
    }
    init() {
        $("#btnLogin").addEventListener("click", () => {
            // let pc = document.querySelector(".page-container");
            // pc.style.left = "-2048px";
            let email = $("#loginEmail").value;
            let pw = $("#loginPassword").value;

            if (email.trim() === "" || pw.trim() === "") {
                alert("필수값이 비어있습니다.")
                return;
            }
            this.socket.emit("login-process", { email, pw });

        });
        $("#btnStart").addEventListener("click", () => {
            //this.game.start();
            this.socket.emit("game-start");
        });
        $("#btnStart").addEventListener("keydown", e => {
            e.preventDefault();
            return false;
        });

        $("#btnRegister").addEventListener("click", e => {
            this.registerProcess();
        });

        $("#btnCreate   Room").addEventListener("click", e => {
            this.createRoom();
        })
        $("#btnLobby").addEventListener("click", e => {
            this.socket.emit("goto-lobby");
            this.pageContainer.style.left = "-1024px";
            this.socket.emit("room-list"); //방 정보 요청 프로토콜
        });
        $("#btnRefreshRoom").addEventListener("click", e=> {
            this.socket.emit("room-list");
        });
        //디버그용 이벤트
        document.addEventListener("keydown", e => {
            if (e.keyCode == 81) {
                this.debug("asd", "asd");
                setTimeout(() => {
                    this.socket.emit("create-room", { name: "더미 방입니다." });
                }, 500);
            }
            else if (e.keyCode == 87) {
                this.debug("as", "as");
                setTimeout(() => {
                    this.socket.emit("join-room", { roomName: 1 });
                }, 500);
            }
        });
    }

    addSocketEvent() {
        this.socket.on("register-response", data => {
            alert(data.msg);

            if (data.status) {
                $("#registerEmail").value = "";
                $("#registerName").value = "";
                $("#registerPass").value = "";
                $("#registerPassConfirm").value = "";
            }
        });
        this.socket.on("login-response", data => {
            //alert(data.msg);
            if (data.status) {
                $("#loginEmail").value = "";
                $("#loginPassword").value = "";
                this.pageContainer.style.left = "-1024px";

                this.makeRoomData(data.roomList);
            }
        });
        this.socket.on("room-list", data => {
            const { roomList } = data;
            this.makeRoomData(roomList);
        });
        this.socket.on("enter-room", data => {
            this.pageContainer.style.left = "-2048px";
        });
        this.socket.on("join-room", data => {
            this.pageContainer.style.left = "-2048px";
            //$("#btnStart").style.visibility = "hidden";
            $("#btnStart").disabled = true;
        });
        this.socket.on("bad-access", data => {
            alert(data.msg);
        });

        this.socket.on("game-start", data => {
            this.game.start();
            this.socket.emit("in-playing");
            document.querySelector("#btnStart").disabled = true;
        });

    }

    createRoom() {
        let result = prompt("방 이름을 입력해라");
        if (result !== "" && result !== null) {
            this.socket.emit("create-room", { name: result });
        } else {
            alert("방이름이 있어야 함");
        }
    }

    registerProcess() {
        let email = $("#registerEmail").value;
        let name = $("#registerName").value;
        let pw = $("#registerPass").value;
        let pwc = $("#registerPassConfirm").value;

        if (email.trim() === "" || name.trim() === "" || pw.trim() === "" || pw !== pwc) {
            alert("공백이거나 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        this.socket.emit("register-request", { email, name, pw, pwc });
    }

    makeRoomData(roomList) {
        const roomBox = $("#roomListBox");
        roomBox.innerHTML = "";
        roomList.forEach(room => {
            let div = document.createElement("div");
            div.classList.add("room");
            div.innerHTML = `<span class="name">${room.name}</span>
                             <span class="number">${room.number}</span>`;
            div.addEventListener("click", e => {
                this.socket.emit("join-room", { roomName: room.roomName });
            });

            roomBox.appendChild(div);
        });
    }

    debug(id, pw) {
        $("#loginEmail").value = id;
        $("#loginPassword").value = pw;
        $("#btnLogin").click();
    }
}

window.addEventListener("load", e => {
    let app = new App();
});