let canvas = document.querySelector("#gameCanvas");
//캔버스 가져오고
let ctx = canvas.getContext("2d");

let x = 0;
let y = 0;
let speed = 300;

let width = 40;
let height = 40;

let ex = 200;
let ey = 60;
let eWidth = 30;
let eHeight = 100;

let keyArr = [];

document.addEventListener("keydown", function(e) {
    keyArr[e.keyCode] = true;

    // switch(e.keyCode) {
    //     case 37:
    //         x-=10;
    //         break;
    //     case 38:
    //         y-=10;
    //         break;
    //     case 39:
    //         x+=10;
    //         break;
    //     case 40:
    //         y+=10;
    //     default:
    //         break;
    // }
});

document.addEventListener("keyup", function(e) {
    keyArr[e.keyCode] = false;
});

let eDerection = 1;
function update()
{
        //좌표저장
        let beforeX = x;
        let beforeY = y;

        if(keyArr[37] && x > 0) {
            x -= speed * 1/60;
        }
        if(keyArr[38] && y > 0) {
            y-= speed * 1/60;
        }
        if(keyArr[39] && x < 960 - width) {
            x+= speed * 1/60;
        }
        if(keyArr[40] && y < 480 - height) {
            y+= speed * 1/60;
        }
        

        //적이랑 충돌했는지 검사
        if((x < ex+eWidth && y < ey+eHeight && x+width > ex && y+height > ey)) {
            x = 0;
            y = 0;
        }

        if(ey+eHeight > 480) {
            eDerection = -1;
        }else if (ey<0){
            eDerection = 1;
        }
        ey+= eDerection*10;

}

function render() 
{
    ctx.clearRect(0,0,960,480);
    ctx.fillStyle = "rgba(0,255,0,1)";
    ctx.fillRect(x,y,width,height);

    //적을 그리기전에
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fillRect(ex, ey, eWidth, eHeight);
}

setInterval(function(){
    update();
    render();
}, 1000/30);
//시간간격동안 함수를 실행, 이때 시간은  ms 단위 (함수, 시간간격);