const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const app = new express();
const server = http.createServer(app);
const path = require('path');

const State = require('./State');

app.use(express.static('public'));

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

const io = socketio(server); //서버에 소켓이 붙는다.
//io는 서버의 모든 소켓을 관리하는 객체
//on은 이벤트를 연결해주는 것으로 addEventListener와 동일

let roomList = [
    {title:"dummyRoom1",roomNO:1, number:1, maxNumber:4},
    {title:"dummyRoom2",roomNO:2, number:1, maxNumber:4}
];

//let maxNo = Math.max(...roomList.map(x=>x.roomNO)) +1;

let conSo ={}; //connectedSocket

io.on("connection", socket =>{

    console.log(`${socket.id} is connected`);
    socket.state = State.IN_LOGIN;

    socket.on("disconnecting", ()=>{
        console.log(`${socket.id} is disconnected`);
        delete conSo[socket.id];
    });

    socket.on("login", data => {
        socket.nickname = data.nickName;
        socket.state = State.IN_LOBBY; //로비 진입

        conSo[socket.id] = socket;
        socket.emit("login", {roomList}); //로그인시 서버의 방정보 리스트를 보낸다.

        console.log(conSo);
    });

    socket.on("chat", data=> {
        // data => {msg:"asdasd",nickName:"오"}
        let {msg,nickName} = data;

        io.emit("chat", {sender:socket.id, msg, nickName});
    });
});

server.listen(15454, ()=> {
    console.log("서버가 15454포트에서 돌아가고 있다");
});