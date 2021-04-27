const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const mysql = require("mysql2/promise");
const s = require("./secret");
const connPool = mysql.createPool(s);

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "db.html"));
});

app.get("/game",(req,res)=> {
    res.sendFile(path.join(__dirname,"views","dodge.html"));
})
io.on("connection", socket =>{
    console.log(`유저 연결 : ${socket.id}`);
    socket.on("savescore", async data=>{
        let {name,score,msg} = data;  
        let con = await connPool.getConnection();
        
            const sql = `INSERT INTO score_list (name,score,msg) VALUES(?,?,?)`
            let result = await con.query(sql, [name,score,msg]);
            if(result[0].affectedRows == 1) {
                //성공시 해줘야할 일
                socket.emit("msg", {msg:"기록 완료"});
            }
        
    });

    
    socket.on("register", async data => {
        //register라는 메시지로 data가 넘어온다.
        let {name, email, pass} = data;
        let con = await connPool.getConnection();
        
        try {
            const sql = `INSERT INTO users (name,email,password) VALUES(?,?,PASSWORD(?))`
            let result = await con.query(sql, [name,email,pass]);
            if(result[0].affectedRows == 1) {
                //성공시 해줘야할 일
                socket.emit("msg", {msg:"성공적으로 회원가입되었습니다"});
            }
        }
        catch(e){
            //실패시 해줘야 할 일
            socket.emit("msg", {msg:"오류발생"});
        }
    });
});

server.listen(15454, ()=>{
    console.log("서버가 15454 포트에서 구동중입니다");
});

// async function test(email, pass)
// {
//     let con = await connPool.getConnection(); //연결을 하나 가져온다.
//     let result = await con.query(
//         `SELECT email FROM users 
//         WHERE email = ? AND 
//         password = PASSWORD(?)`, [email, pass]);

//     if(result[0].length >= 1){
//         console.log("로그인 성공");
//     }else{
//         console.log("로그인 실패");
//     }
//     con.release();
// }

// //SQL INJECTION
// test(`gondr99@nate.com' OR '1' OR '1`, "12444434");