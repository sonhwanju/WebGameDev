const loginIdInput = document.querySelector("#userId");
const loginPage = document.querySelector(".inner-box:nth-child(1)");
const lobbyPage = document.querySelector(".inner-box:nth-child(2)");
const chatPage = document.querySelector(".inner-box:nth-child(3)");
const btnLogin = document.querySelector("#btnLogin");

const msgInput = document.querySelector("#msgInput");
const btnSend = document.querySelector("#btnSend");
const chatList = document.querySelector("#chatList"); //채팅을 집어넣는거
const userListDom = document.querySelector("#connectionList"); //사용자 정보

// 김경혁 1승, 박선우 1승, 이준협 1승
// 2500원 이내

const popup = document.querySelector("#popup");
const roomTitleInput = document.querySelector("#roomTitle");

let nickName = "";
let socket = null;
let roomList = []; //채팅방 리스트고
let userList = []; //해당 채팅방에 있는 유저들의 리스트다

document.querySelector("#btnCreateRoom").addEventListener("click", e =>{
    popup.classList.add("on");
});

document.querySelector("#btnCreate").addEventListener("click", e => {
    let title = roomTitleInput.value;
    if(title.trim() === ""){
        Swal.fire("방 이름은 공백일 수 없습니다.");
        return;
    }
    //여기에 방 최대인원에 대한 정보도 같이 체크하고 전송해야 해.
    //여기까지 왔다면 방을 생성할 수 있으니 소켓으로 전송
    socket.emit("create-room", {title}); //지금은 title만 보내고 있다.
    popup.classList.remove("on"); //전송후 팝업은 닫아준다.
});

btnLogin.addEventListener("click", e =>{
    let name = loginIdInput.value;
    if(name.trim() === ""){
        alert("이름은 공백일 수 없습니다.");
        return;
    }
    nickName = name;
    socketConnect(); //소켓 연결 함수 실행하기
});

function socketConnect(){
    socket = io(); //소켓 연결 시작

    socket.emit("login", {nickName});

    socket.on("login", data => {
        roomList = data.roomList;
        loginPage.classList.add("left");
        lobbyPage.classList.remove("right");  //로비페이지로 진행
        makeRoomData(roomList); //룸리스트를 기반으로 html을 만들어준다.
        //console.log(roomList);
    });
    
    socket.on("enter-room", data => {
        //data에는 userList가 들어온다.
        lobbyPage.classList.add("left");
        chatPage.classList.remove("right");
    });

    socket.on("user-refresh", data =>{
        userList = data.userList;
        makeUserData(userList);
    });

    socket.on("chat", data => {
        let li = document.createElement("li");
        li.classList.add("chat-item");
        li.innerHTML = `<div class="inner-data">
                            <span class="sender">${data.nickName}</span>
                            <span class="msg">${data.msg}</span>
                        </div>`;
        if(data.sender === socket.id){
            li.classList.add("my");
        }
        chatList.appendChild(li);
        chatList.scrollTop = chatList.scrollHeight;
    });

    socket.on("bad-access", data => {
        Swal.fire(data.msg);
        return;
    });

    //메시지 전송버튼 눌렀을때
    btnSend.addEventListener("click", e=>{
        if(msgInput.value.trim() === "") return;
        let msg = msgInput.value;
        msgInput.value = "";//전송된 데이터는 공백으로 초기화
        socket.emit("chat", {nickName, msg});
    });
}

const roomListDom = document.querySelector("#roomList");


function makeUserData(userList){
    userListDom.innerHTML = "";
    userList.forEach(x => {
        let li = document.createElement("li");
        li.innerHTML = x.nickName;
        userListDom.appendChild(li);
    });
}

function makeRoomData(roomList){
    roomListDom.innerHTML = "";

    roomList.forEach(x => {
        let li = document.createElement("li");
        li.innerHTML = `<span class="title">
                            ${x.title}
                        </span>
                        <span class="number">
                            ${x.number}/${x.maxNumber}
                        </span>`;
        li.classList.add("room");
        roomListDom.appendChild(li);

        li.addEventListener("click", e => {
            socket.emit("enter-room", {roomNo : x.roomNo});
        });
    });
}

//test코드 개발이 끝나면 지울것
loginIdInput.value = "테스트";
document.querySelector("#btnLogin").click();


// async function test(){
//     for(let i = 0; i < 10; i++){
//         await print(i);
//     }
// }

// test();

// function print(i){
//     return new Promise((resolve, reject)=>{
//         setTimeout(()=>{
//             console.log(i);
//             resolve();
//         }, Math.random() * 2000);
//     });
// }