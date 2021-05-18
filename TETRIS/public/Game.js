import { Player } from '/Player.js';
import {Block} from '/Block.js';
import {$} from '/Query.js';

export class Game {
    static instance = null;
    constructor(socket) {
        this.socket = socket;
        this.addSocketEvent();
        this.canvas = $("#gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.otherCanvas = $("#otherCanvas");
        this.oCtx = this.otherCanvas.getContext("2d");
        this.frame = null;
        this.player = null; //가독성을 위한 코드
        this.arr = [];
        this.addKeyEvent(); //한번만 실행

        this.time = 2000;
        this.currentTime = 0;
        this.score = 0;
        this.scoreBox = $(".score-box");
        this.check = 1000;

        this.gameOverPanel = document.querySelector("#gameOverBox");
        this.gameOver = false;

        this.addLineCount = 0;
    }
    
    setGameOver(win = false) {
        clearInterval(this.frame);
        this.gameOver = true;
        this.gameOverPanel.classList.add("on");

        if(win) {
            this.gameOverPanel.querySelector(".title").innerHTML = "You Win";
        }
        else {
            this.gameOverPanel.querySelector(".title").innerHTML = "You Lose";
            this.socket.emit("game-lose"); //패배신호를 서버로 보낸다.
        }
        this.render();
    }

    addKeyEvent() {
        document.addEventListener("keydown", e=> {
            if(this.player == null || this.gameOver) return;
            if(e.keyCode == 37) {
                this.player.moveLeft(); 
            }
            else if(e.keyCode == 39) {
                this.player.moveRight();
            }
            else if(e.keyCode == 38) {
                this.player.rotate();
            }
            else if(e.keyCode == 40) {
                this.player.moveDown();
            }
            else if(e.keyCode == 32) {
                this.player.straightDown();
            }
        });
    }

    update(){
        this.arr.forEach(row=> row.forEach(item=>item.update(1000/30)));

        this.currentTime+= 1000/30;
        if(this.currentTime >= this.time) {
            this.currentTime = 0;
            this.player.moveDown();
        }
        //한줄 삭제하면 스코어 증가
        //스코어는 화면에 표시
        //스코어가 올라갈때마다 time이 줄어서 최대 0.5초까지 줄어든다.
        
        
    }
    render(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.arr.forEach(row=> row.forEach(item=>item.render(this.ctx)));

        this.scoreBox.innerHTML = `${this.score} 점`;

        this.player.render(this.ctx);
    }

    start() {
        this.gameOver = false;
        if(this.frame != null) {
            clearInterval(this.frame);
        }
        this.frame = setInterval(()=> {
            this.update();
            this.render();
        },1000/30);
        this.gameOverPanel.classList.remove("on");
        this.arr = [];
        for(let i = 0; i < 20; i++) {
            let row = []
            for(let j = 0; j < 10;j++) {
                row.push(new Block(j,i));
            }
            this.arr.push(row);
        }
        //this.debug();
        this.player = new Player();
        this.time = 2000;
    }
    //한줄이 꽉찼는지 검사
    checkLine() {
        let removedCount = 0;
        for(let i = this.arr.length - 1; i >= 0; i--) {
            let full = true; //무조건 해당 라인이 꽉 찻다고 가정
            for(let j = 0; j < this.arr[i].length; j++) {
                if(!this.arr[i][j].fill) {
                    full = false;
                    break;
                }
            }
            if(full) {
                this.lineRemove(i); //i윗줄을 전부 한칸씩 내린다
                this.addScore();
                i++;
                removedCount++;
            }
        }

        //내가 만약에 상테한테 3줄을 받은 상태

        if(this.addLineCount > 0) {
            if(this.addLineCount > removedCount) {
                this.addLineCount -= removedCount;
                removedCount = 0;
            }
            else {
                removedCount-=this.addLineCount;
                this.addLineCount = 0;
            }
        }
        if(removedCount > 0) {
            this.socket.emit("remove-line", {count:removedCount});
        }
        //내가 만약에 상대한테 몇줄으 ㄹ받앗다면
        if(this.addLineCount > 0) {
            this.addLine(this.addLineCount);
            this.addLineCount = 0;
        }

        let sendData = [];
        for(let i = 0; i < this.arr.length; i++) {
            sendData.push(this.arr[i].map(x=> ({color:x.color, fill:x.fill})));
        }
        this.socket.emit("game-data", {sendData});
    }
    addSocketEvent() {
        this.socket.on("game-data",data=> {
            const {sendData,sender} = data;
            this.drawOtherCanvas(sendData);

        });

        this.socket.on("remove-line",data=> {
            console.log(data.count);
            const {count, sender} = data;
            this.addLineCount += count;
        });
        this.socket.on("game-win",data=> {
            this.setGameOver(true);
        });
        this.socket.on("leave-player",data=> {
            const {isAdmin} = data;

            if(isAdmin) {
                document.querySelector("#btnStart").disabled = false;
            }
            else {
                this.setGameOver(true);
            }
        });
    }
    //해당줄의 위쪽부터 한칸씩 내리기
    lineRemove(from) {
        for(let i = from; i >= 1; i--) {
            for(let j = 0; j < this.arr[i].length; j++) {
                this.arr[i][j].copyBlockData(this.arr[i-1][j]);
            }
        }
        for(let j = 0; j < this.arr[0].length; j++) {
            this.arr[0][j].setBlockData(false);
        }
        
    }
    addLine(count) {
        //받은 카운트 만큼 현재 배열을 올려주면 도니다. 2ㄷ중 for문 2번써야함
        for(let i = count; i < this.arr.length; i++) {
            for(let j = 0; j < this.arr[i].length; j++) {
                this.arr[i-count][j].copyBlockData(this.arr[i][j]);
            }
        }

        for(let i = this.arr.length - count; i < this.arr.length; i++) {
            let empty = Math.floor(Math.random() * this.arr[i].length);
            for(let j = 0; j < this.arr[i].length; j++) {
                if(j !== empty) {
                    this.arr[i][j].setBlockData(true,"#555");
                }
                else {
                    this.arr[i][j].setBlockData(false,"#fff");
                } 
            }
        }
    }
    addScore() {
        this.score += 500;

        if(this.score % 5 == 0 && this.time > 100) {
            this.time -= 300;
            if(this.time < 100) {
                this.time = 100;
            }
        }
        // if(this.score >= this.check) {
        //     if(this.time > 500) {
        //         this.time -= 500;
        //         this.check += 1000;
        //         // console.log(this.score);
        //         // console.log(this.time);
        //     }
            
        // }
    }

    drawOtherCanvas(data) {
        this.oCtx.clearRect(0,0,100,200);
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < data[i].length; j++) {
                if(data[i][j].fill) {
                    this.oCtx.fillStyle = data[i][j].color;
                    this.oCtx.fillRect(j*10,i*10,10,10);
                }
            }
        }
    }

    debug(){
        this.arr[19][0].setBlockData(true, "#007bff");
        this.arr[19][1].setBlockData(true, "#007bff");
        this.arr[19][2].setBlockData(true, "#007bff");
        this.arr[19][3].setBlockData(true, "#007bff");

    }
}