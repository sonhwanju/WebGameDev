let canvas = document.querySelector("#gameCanvas");
//캔버스 가져오고
let ctx = canvas.getContext("2d");

let x = 0;
let y = 0;
let speed = 200;
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


function update()
{
    if(keyArr[37]) {
        x -= speed * 1/60;
    }
    if(keyArr[38]) {
        y-= speed * 1/60;
    }
    if(keyArr[39]) {
        x+= speed * 1/60;
    }
    if(keyArr[40]) {
        y+= speed * 1/60;
    }

}

function render() 
{
    ctx.clearRect(0,0,960,480);
    ctx.fillRect(x,y,10,10);
}

setInterval(function(){
    update();
    render();
}, 1000/30);
//시간간격동안 함수를 실행, 이때 시간은  ms 단위 (함수, 시간간격);