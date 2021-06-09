const SocketState = require('./SocketState');
const Vector3 = require('./Vector3');

let respawnPoint = [
    new Vector3(3,5,0),
    new Vector3(5,4,0),
    new Vector3(7,2,0)
];

function LoginHandler(data, socket) {
    data = JSON.parse(data);
    const {tank,name} = data;

    //탱크가 랜덤한 위치에 등장하도록 처리
    socket.state = SocketState.IN_GAME;
    
    let position = respawnPoint[Math.floor(Math.random() * respawnPoint.length)];
    
    let sendData = {
        //탱크가 제네레이트된 지점
        position:position,
        rotation:Vector3.zero,
        turretRotation:Vector3.zero,
        socketId:socket.id,
        name,
        tank
    }

    let payload = JSON.stringify(sendData);
    let type = "LOGIN";
    socket.send(JSON.stringify({type,payload}));
    return sendData;

    //로그인된 유저를 리턴해주면 메인게임서버에서 해당 유저를 리스트에 등록하게 될것
}

module.exports = LoginHandler;