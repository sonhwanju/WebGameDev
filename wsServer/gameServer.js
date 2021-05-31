const WebSocket = require('ws');
const port = 32000;

let socketIdx = 0;
let userList = {}; //로그인한 유저들을 관리하는 리스트
let connectedSocket = {}; //연결된 소켓들을 관리

const wsService = new WebSocket.Server({port}, () => {
    console.log(`웹 소켓이 ${port}에서 구동중`);
});

const getPayLoad = str => {
    let idx = str.indexOf(":");
    let op = str.substr(0,idx);
    let payload = str.substr(idx+1);
    return {op,payload};
}

wsService.on("connection", socket => {
    console.log("소켓 연결");
    socket.on("close", () => {
        console.log("소켓 끊김");
    });
    socket.on("message", msg => {
        const {op,payload} = getPayLoad(msg);
        console.log(op, payload);
        socket.send(payload);
    });
});
