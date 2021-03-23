let btn = document.querySelector("#startBtn");
btn.addEventListener("click", function () {
    //alert("버튼 클릭");
});

let canvas = document.querySelector("#gameCanvas");

let ctx = canvas.getContext("2d");

let cp = document.querySelector("#colorPicker");

let num = document.querySelector("#widthSel");


let isDown = false;
let x = 0;
let y = 0;

/*canvas.addEventListener("click", function(e) {
    //console.log(cp.value);
    //console.log(e.offsetX,e.offsetY);
    ctx.fillStyle = cp.value;
    ctx.fillRect(e.offsetX,e.offsetY,10,10);
});*/

canvas.addEventListener("mousedown", function (e) {
    isDown = true;
    x = e.offsetX;
    y = e.offsetY;


});

canvas.addEventListener("mouseup", function (e) {
    isDown = false;
});

canvas.addEventListener("mousemove", function (e) {
    if (!isDown) return;

    if (document.getElementById('drawRadio').checked) {
        //Male radio button is checked
        ctx.lineWidth = num.value;
        ctx.strokeStyle = cp.value;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (document.getElementById('removeRadio').checked) {
        ctx.clearRect(x, y, 10, 10);
    }

    // if()
    // {
    //     ctx.lineWidth = num.value;
    //     ctx.strokeStyle = cp.value;
    //     ctx.beginPath();
    //     ctx.moveTo(x,y);
    //     ctx.lineTo(e.offsetX,e.offsetY);
    //     ctx.stroke();

    // }
    // else {
    //     ctx.beginPath();
    //     ctx.moveTo(x,y);
    //     ctx.lineTo(e.offsetX,e.offsetY);
    //     ctx.clearRect(x,y,5,5);
    // }

    //ctx.clearRect(x,y,5,5);
    x = e.offsetX;
    y = e.offsetY;
});



/*ctx.strokeStyle = "rgba(255,0,0,0.5)";
ctx.strokeRect(20, 20, 100, 100);
ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
ctx.fillRect(150, 20, 100, 100);

ctx.beginPath();
ctx.moveTo(250,250);
ctx.lineTo(360,100);
ctx.lineTo(480,250);
ctx.moveTo(600,250);
ctx.lineTo(700,100);
ctx.lineTo(820,250);
ctx.moveTo(600,400);
ctx.lineTo(300,360);
ctx.lineTo(560,600);
ctx.moveTo(100,100);


ctx.closePath();
ctx.stroke();*/
