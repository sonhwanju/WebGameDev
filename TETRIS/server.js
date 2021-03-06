const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const { Query, Pool } = require('./DB.js');
const State = require("./State.js");

const app = new express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

let roomList = [
    //{name:'', roomName:1, number:1}
];

io.on("connect", socket => {
    console.log(`socket connected : ${socket.id}`);
    socket.state = State.IN_LOBBY;

    socket.on("disconnecting", async () => {
        console.log(`${socket.id}님이 떠났어요`);

        if (socket.state === State.IN_GAME || socket.state === State.IN_PLAYING) {
            let rooms = [...socket.rooms];
            let targetRoom = rooms.find(x => x !== socket.id);
            let idx = roomList.findIndex(x => x.roomName === targetRoom);
            roomList[idx].number--;
            if (roomList[idx].number <= 0) {
                roomList.splice(idx, 1);
            }
            else if (socket.state === State.IN_GAME) {
                io.to(roomList[idx].roomName).emit("leave-player", { isAdmin: true });
            }
            else if (socket.state === State.IN_PLAYING) {
                io.to(roomList[idx].roomName).emit("leave-player", { isAdmin: false });
                recordMatchData(socket, roomList[idx].roomName);
            }
            
        }
    });

    socket.on("login-process", async data => {
        const { email, pw } = data;
        let sql = "SELECT * FROM users WHERE email = ? AND password = PASSWORD(?)";
        let result = await Query(sql, [email, pw]);
        if (result.length !== 1) {
            socket.emit("login-response", { status: false, msg: "로그인 실패" });
            return;
        }
        // let socketMap = io.sockets;

        // let connectList = [...await io.allSockets()];
        // for(let i = 0; i < connectList.length; i++) {
        //     if(socketMap.get([connectList[i]]).loginUser !== undefined && socketMap.get([connectList[i]]).loginUser.email === result[0].email) {
        //         socket.emit("bad-access", {msg:"중복 로그인"});
        //         return;
        //     }
        // }

        socket.emit("login-response", { status: true, msg: "로그인 성공", roomList });
        socket.loginUser = result[0]; //로그인된 유저를 socket 데이터에 넣어준다.
        socket.state = State.IN_LOBBY;
    });

    socket.on("register-request", async data => {
        const { email, name, pw, pwc } = data;

        if (email.trim() === "" || name.trim() === "" || pw.trim() === "" || pw !== pwc) {
            socket.emit("register-response", { status: false, msg: "비어있거나 비밀번호 확인이 올바르지 않습니다." });
            return;
        }

        let sql = "SELECT * FROM users WHERE email = ?";

        let result = await Query(sql, [email]);
        if (result.length != 0) {
            socket.emit("register-response", { status: false, msg: "이미 존재하는 회원입니다." });
            return;
        }

        sql = `INSERT INTO users(email, name, password) VALUES (?, ?, PASSWORD(?))`;
        result = await Query(sql, [email, name, pw]);

        if (result.affectedRows == 1) {
            socket.emit("register-response", { status: true, msg: "정상적으로 회원가입 되었습니다." });
        } else {
            socket.emit("register-response", { status: false, msg: "데이터베이스 처리중 오류 발생" });
        }
        return;
    });

    socket.on("create-room", data => {
        if (socket.state !== State.IN_LOBBY) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다." });
            return;
        }
        const { name } = data;

        const roomName = roomList.length < 1 ? 1 : Math.max(...roomList.map(x => x.roomName)) + 1;
        roomList.push({ name, roomName, number: 1 });
        socket.join(roomName);

        socket.state = State.IN_GAME;
        socket.emit("enter-room");
    });

    socket.on("join-room", data => {
        if (socket.state !== State.IN_LOBBY) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다" });
            return;
        }
        const { roomName } = data;
        let targetRoom = roomList.find(x => x.roomName === roomName);

        if (targetRoom === undefined || targetRoom.number >= 2) {
            socket.emit("bad-access", { msg: "들어갈 수 없는 방입니다." });
            return;
        }
        socket.join(roomName);
        socket.emit("join-room");
        socket.state = State.IN_GAME;
        targetRoom.number++;
    });
    socket.on("game-start", data => {

        if (socket.state !== State.IN_GAME) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다.." });
            return;
        }
        let socketRooms = [...socket.rooms];

        let room = socketRooms.find(x => x != socket.id);

        let targetRoom = roomList.find(x => x.roomName === room);
        if (targetRoom === undefined || targetRoom.number < 2) {
            socket.emit("bad-access", { msg: "시작할 수 없는 상태입니다." });
            return;
        }

        io.to(room).emit("game-start");

    });

    socket.on("in-playing", data => {
        socket.state = State.IN_PLAYING;
    });

    socket.on("game-data", data => {
        if (socket.state !== State.IN_PLAYING) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다." });
            return;
        }

        let room = findRoom(socket);
        data.sender = socket.id;

        socket.broadcast.to(room).emit("game-data", data);
    });
    socket.on("remove-line", data => {
        if (socket.state !== State.IN_PLAYING) {
            socket.emit("bad-access", { msg: "잘못된 접근입니다." });
            return;
        }

        let room = findRoom(socket);
        data.sender = socket.id;

        socket.broadcast.to(room).emit("remove-line", data);
    })

    socket.on("game-lose", data => {
        let room = findRoom(socket);
        //다중 게임이라면 여기서 해당방에있는 모든 유저가 전부 패배했는질ㄹ 체크
        recordMatchData(socket, room);
        socket.broadcast.to(room).emit("game-win");
    });

    socket.on("goto-lobby", data => {
        socket.state = State.IN_LOBBY;
        let room = findRoom(socket);
        let idx = roomList.findIndex(x => x.roomName === room);
        roomList[idx].number--;

        if(roomList[idx].number<=0) {
            roomList.splice(idx,1)
        }
    });
    socket.on("room-list", data => {
        socket.emit("room-list", { roomList });
    });
    socket.on("rank-list",async () => {
        let result = await Query("SELECT id,name FROM users");

        for(let i = 0; i < result.length; i++) {
            let win = await Query(`SELECT users.email, COUNT(*) AS cnt FROM matches, users 
            WHERE (matches.host_id = users.id AND matches.result = 1)
            OR (matches.client_id = users.id AND matches.result = 0)
            AND users.id = ?`,[result[i].id]);
            result[i].win = win[0].cnt;

            let lose = await Query(`SELECT users.email, COUNT(*) AS cnt FROM matches, users 
            WHERE (matches.host_id = users.id AND matches.result = 0)
            OR (matches.client_id = users.id AND matches.result = 1)
            AND users.id = ?`,[result[i].id]);
            result[i].lose = lose[0].cnt;
        }
        result.sort((a,b)=> (b.win - b.lose) - (a.win - a.lose));
        
        socket.emit("rank-list", {result});
    });
});

function findRoom(socket) {
    let socketRooms = [...socket.rooms];
    let room = socketRooms.find(x => x != socket.id);
    return room;
}

async function recordMatchData(depeatSocket, roomName) {
    let sql = `INSERT INTO matches (result, host_id, client_id, host_score, client_score, date) 
                            VALUES ( ?, ?, ?, ?, ?, NOW())`;
    let list = [...await io.in(roomName).allSockets()];

    let data = [];
    if (list[0] === depeatSocket.id) {
        //내가 방장
        data.push(0); //방장패배
        data.push(depeatSocket.loginUser.id);
        data.push(io.sockets.sockets.get(list[1]).loginUser.id);
    } else {
        //내가 클라
        data.push(1); //방장승리
        data.push(io.sockets.sockets.get(list[0]).loginUser.id);
        data.push(depeatSocket.loginUser.id);
    }
    data.push(0);
    data.push(0);
    await Query(sql, data); //전적정보의 기록
}

server.listen(9500, () => {
    console.log("Server is running on 9000 port");
});