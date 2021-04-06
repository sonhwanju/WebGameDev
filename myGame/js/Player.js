class Player {
    constructor(x,y) {
        this.speed = 120;
        this.sprite = new Image();
        this.sprite.src = "/myGame/images/mario.png";
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.targetX = x;
        this.targetY = y;

    }

    setTarget(x,y) {
        this.targetX = x //- this.w / 2;  //정중앙으로 위치하도록 너비랑 높의 절반만큼 빼줌.
        this.targetY = y// - this.h / 2;

    //여기서는 정말 타겟을 설정하는거만 한다.
    }
    update(d){
        /*if(this.x >= 600 - this.w || this.x < 0) {
            this.speed *= -1;
        }
        this.x += this.speed * d;*/
        //이쪽 코드에서 문제가 있는데 먼저 목표지점과  현재위치사이의 방향벡터를 구해야함
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        //그 뒤 두 점사이의 거리구하는 공식을 이용하여 다음과 같이 거리를 구함
        let distance = Math.sqrt(dx * dx + dy * dy); 

        if(distance > 0.5){ //거리가 일정이상일때 다가가도록 처리함
            //길이 1인 방향벡터를 구하기 위해 거리로 dx,와 dy를 나눠줌
            this.x += dx / distance * this.speed * d;
            this.y += dy / distance * this.speed * d;
        }
    }

    render(ctx){
        ctx.clearRect(0,0,600,400);
        ctx.drawImage(this.sprite,this.x,this.y,this.w,this.h);
    }
    checkCol(){
        
    }
}