class App 
{
    constructor(){
        this.player = new Player(290, 190);
        this.canvas = document.querySelector("#myGame");
        this.ctx = this.canvas.getContext("2d");

        this.coinList = []; //비어있는 배열 생성
        for(let i = 0; i < 10; i++){
            this.coinList.push(new Coin());
        }

        this.canvas.addEventListener("click", (e)=>{
            this.player.setTarget(e.offsetX, e.offsetY);
        });

        this.gameOver = false; //게임오버가 아닌상태

        setInterval(()=> {
            this.update();
            this.render();
        }, 1000/60);
        
    }

    update(){
        if(this.gameOver) return;

        this.player.update(1/60);
        
        for(let i = 0; i < this.coinList.length; i++){
            this.coinList[i].update(1/60);
            if(this.coinList[i].checkCol(this.player)){
                //충돌시에 this.coinList[i]가 isRed 가 true
                if(this.coinList[i].isRed){
                    this.setGameOver();//게임오버함수 실행
                }else{
                    this.coinList[i].remove();//코인제거
                }
            }
        }

        // let coinCnt = 0;
        // for(let i = 0; i < this.coinList.length; i++){
        //     if(this.coinList[i].active){
        //         coinCnt++;
        //     }
        // }
        let coinCnt = this.coinList.filter(x => x.active).length;

        if(coinCnt == 0){
            this.setGameClear();
        }

    }

    setGameOver(){
        alert("게임오버");
        this.gameOver = true;
    }
    setGameClear(){
        alert("게임 클리어");
    }

    render(){
        this.ctx.clearRect(0,0,600, 400);
        this.player.render(this.ctx);
        for(let i = 0; i < this.coinList.length; i++){
            this.coinList[i].render(this.ctx);
        }
    }
    
}

                                