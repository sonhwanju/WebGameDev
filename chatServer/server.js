const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const app = new express();
const server = http.createServer(app);
const path = require('path');
app.use(express.static('public'));

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

const io = socketio(server); //서버에 소켓이 붙는다.
//io는 서버의 모든 소켓을 관리하는 객체
//on은 이벤트를 연결해주는 것으로 addEventListener와 동일
io.on("connection", socket =>{
    socket.on("chat", data=> {
        // data => {msg:"asdasd",nickName:"오"}
        let {msg,nickName} = data;

        io.emit("chat", {sender:socket.id, msg, nickName});
    });
});

server.listen(15454, ()=> {
    console.log("서버가 15454포트에서 돌아가고 있다");
});