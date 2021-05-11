const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendfile(path.join(__dirname, "views", "index.html"));
});

io.on("connect", socket=> {
    console.log(`socket connected : ${socket.id}`);

    socket.on("register-request", data=> {
        const {email,name,pw,pwc} = data;

        if(email.trim() === "" || name.trim()==="" || pw.trim() === "" || pw!==pwc) {
            socket.emit("register-response", {status:false,msg:"비어있거나 비밀번호 확인이 올바르지 않습니다."});
            return;
        }
    });
});

server.listen(9500, ()=> {
    console.log("Server is running on 9000 port");
});