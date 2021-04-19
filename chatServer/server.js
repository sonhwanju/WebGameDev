const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const app = new express();
const server = http.createServer(app); //미안 서버야...사과할께..
const path = require('path');

const State = require('./State');

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "index.html"));
});
const io = socketio(server); //이렇게하면 서버에 소켓이 붙는다.
//io는 서버의 모든 소켓을 관리하는 객체
//on은 이벤트를 연결해주는 것으로 addEventListener과 동일

let roomList = [
    {title:"dummyRoom1", roomNo:1, number:1, maxNumber:4},
    {title:"dummyRoom2", roomNo:2, number:1, maxNumber:4}
];

let maxNo = roomList.map( x => x.roomNo);

let conSo = {};

io.on("connection", socket => {
    console.log(`${socket.id} is connected`);
    socket.state = State.IN_LOGIN; //처음 접속하면 로그인 상태로 만든다.

    socket.on("disconnecting", ()=>{
        console.log(`${socket.id} is disconnected`);//소켓 연결 종료
        let list = [...socket.rooms].filter(x=>x!==socket.id);
        list.forEach(r=>{
            roomList.find(x=> x.roomNo === r).number--;
        });
        delete conSo[socket.id];

    });

    socket.on("login", data => {
        socket.nickname = data.nickName;
        socket.state = State.IN_LOBBY; //로비로 진입시킨다.

        conSo[socket.id] = socket;
        socket.emit("login", {roomList});  //로그인시 서버의 방정보 리스트를 보낸다.
    });

    socket.on("enter-room", data => {
        if(socket.state !== State.IN_LOBBY){
            socket.emit("bad-access", {msg:"잘못된 접근입니다"});
            return;
        }

        const {roomNo} = data;
        let targetRoom = roomList.find(x => x.roomNo === roomNo);
        if(targetRoom === undefined){
            socket.emit("bad-access", {msg:"존재하지 않는 방입니다"});
            return;
        }
        if(targetRoom.number >= targetRoom.maxNumber){
            socket.emit("bad-access", {msg:"방이 가득 찼습니다"});
            return;
        }
        //여기까지 왔다면 방에 조인을 해도 된다.
        socket.join(roomNo); //이렇게 하면 방에 들어가져

        let userList = []; //여기에 해당 방에 존재하는 모든 유저를 넣어준다.
        //근데 이부분은 좀 어려워서 내일할께

        socket.emit("enter-room", {userList});
        socket.state = State.IN_CHAT;
        targetRoom.number++;
        console.log(socket.rooms); //현재 입장해있는 방을 출력한다
    });

    socket.on("chat", data => {
        // data => {msg:"asdasd", nickName:"오"}

        if(socket.state !== State.IN_CHAT) {
            socket.emit("bad-access", {msg:"잘못된 접근"});
            return;
        }
        let {msg, nickName} = data;

        let room = socket.rooms; //들어가있는 방의 리스트가 나온다
        //내 아이디와 다른 방번호는 가져온다
        [...room].filter(x=>x != socket.id).forEach(r => {
            io.to(r).emit("chat", {sender:socket.id, msg, nickName});
        });
    });

});

server.listen(15454, ()=>{
    console.log("서버가 15454포트에서 돌아가고 있습니다.");
});