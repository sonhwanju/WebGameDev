const http = require('http');
//http 웹서버 => 요청과 응답
const server = http.createServer(function(req, res) {
    res.write("<h1> Hello node server </h1?");
    res.end("<p>미안하다...이거보여주려고 어그로끌었다>/p>");
});

server.listen(8080);