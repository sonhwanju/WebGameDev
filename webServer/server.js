const exp = require('constants');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken'); //인증에 사용할 토큰
// Oauth, jwt 중 하나를 사용한다.

//익스프레스 웹 서버 구축
const app = new express();
const server = http.createServer(app);

//post로 넘어오는 데이터들을 json형태로 파싱해주고, 한글도 받아주는 코드이다.
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//GET => 서버로부터 가져옴, POST => 서버로 데이터전송
//Get 요청으로 /save_data 라는 주소에 요청을 보내면 그때 요청은 req에 응답은 res에 기록된다.
app.post('/login', (req, res) => {
    //res.send("<h1>Hello world</h1>");
    // res.json({name:"명재문",wtf:true});
    //let token = jwt.sign("데이터", "비밀키", "옵션");

    //아이디와 비번을 받아서 데이터베이스에 그 값이 있는지 확인해서 있으면 토큰 발행.
    //비밀키는 이런식으로 넣으면안된다. secret사용 (따로빼서 require) + 깃이그노어 설정
    //.과 .사이에 있는게 데이터 (token debug찍었을때)
    let token = jwt.sign({email:"hwanjuson@gmail.com", level:5}, "ggm", {expiresIn:"24h"});

    res.json({success:true, msg:token});
});

app.post('/save_data', (req, res) => {
    console.log(req.body);

    let token = req.body.token;
    if(token === undefined || token ==="") {
        res.json({success:false, msg:"잘못된 접근입니다."});
        return;
    }
    try {
        //토큰을 시크릿키랑 같이 넣어줌
        let decoded = jwt.verify(token, "ggm");
        if(decoded) {
            res.json({success:true,msg:`데이터 저장 성공`});
        }
        else {
            res.json({success:false, msg:"잘못된 접근입니다."});
        }
    }
    catch(err) {
        res.json({success:false, msg:"잘못된 접근입니다."});
    }
});

server.listen(54000, () => {
    console.log(`server is running on 54000 port`);
});