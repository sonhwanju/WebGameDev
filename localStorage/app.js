let saveBtn = document.querySelector("#btnSave");
let loadBtn = document.querySelector("#btnLoad");
let nameInput = document.querySelector("#nameInput");
let scoreInput = document.querySelector("#scoreInput");
let msgInput = document.querySelector("#msgInput");
let rl = document.querySelector("#rankList");

//이름 점수 남길말 3개 입력받고 저장

saveBtn.addEventListener("click", function(){
    //let name = nameInput.value;
    //let score = scoreInput.value;
    //let msg = msgInput.value;

    //localStorage.setItem("name", name);
    //localStorage.setItem("score", score);
    //localStorage.setItem("msg",msg);
    let list = localStorage.getItem("list");

    if(list == null) {
        list = []; //리스트에 새로운ㅂ ㅐ열 생성
    }else {
        list = JSON.parse(list);
    }

    let obj = {
        name : nameInput.value,
        score : scoreInput.value * 1,
        msg : msgInput.value
    }
    list.push(obj);
    localStorage.setItem("list", JSON.stringify(list));

    

    nameInput.value ="";
    scoreInput.value="";
    msgInput.value="";
});

loadBtn.addEventListener("click", function() {
    //let name = localStorage.getItem("name");
    //let score = localStorage.getItem("score");
    //let msg = localStorage.getItem("msg");
    let list = localStorage.getItem("list");
    if(list == null) {
        list = [];
    }
    else {
        list =JSON.parse(list);
    }
    rl.innerHTML="";
    for(let i = 0; i < list.length; i++) {
        //console.log(list[i]);
        let div = document.createElement("div");
        div.innerHTML = `
        <span>${list[i].name}</span>
        <span>${list[i].score}</span>
        <span>${list[i].msg}</span>
        `;

        rl.append(div);
    }

    //nameInput.value = list.name;
    //scoreInput.value = list.score;
   // msgInput.value = list.msg;
});