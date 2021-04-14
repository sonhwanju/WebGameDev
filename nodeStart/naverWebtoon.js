const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let name = process.argv[2];
let no = process.argv[3]*1;
let no2 = process.argv[4]*1;


let listUrl = "https://comic.naver.com/webtoon/weekday.nhn"; //사이트

let result = [];
request(listUrl, (err, res, body) => {
    const $ = cheerio.load(body); 
    let titleList = $(".col_inner li .title"); //타이틀 리스트를 가져온다.
    for(let i = 0; i < titleList.length; i++){
        let href = titleList.eq(i).attr("href"); //href를 받아온다. (titleId를 가져오기 위함) a href="/webtoon/list.nhn?titleId=758037&weekday=mon"
        let startIdx = href.indexOf("="); // titleId앞에있는 =을 가져오고
        let endIdx = href.indexOf("&"); //titleId뒤에있는 &을 가져오고
        let id = href.substring(startIdx+1, endIdx); // startIndex 한칸 앞에서 시작하며 endIdx전까지 있는 titleId를 가져옴
        result[titleList.eq(i).text()] = id; //넣어준다
    }
    
    let titles = Object.keys(result); //제목을 가져옴 result의 키값이 제목이다.

    let filteredList = titles.filter(x => x.includes(name)).map(x => ({id:result[x], name:x}) ); //필터를 사용하여 name에 입력한 얘들이 포함된 얘를 보여줌

    console.log(filteredList); //로그를 찍어서 id를 보여줌
    
});
//



// for(let j = no; j <= no2; j++) {
//     let uri = `https://comic.naver.com/webtoon/detail.nhn?titleId=${titleId}&no=${j}`;
//     request(uri, function(err,res,body) {

    
//         let $ = cheerio.load(body);
//         let list = $(".wt_viewer > img");
//         let comicName = $(".detail").text();
//         let comicName2 = comicName.split()
//         console.log(comicName);
    
//         fs.mkdirSync(titleId + "/" + j, {recursive:true});
//         for(let i = 0; i < list.length;i++) {
//             let src = list.eq(i).attr("src");
//             download(src,j + "/" + `${i}.jpg`);
//         }
        
//     });
// }


function download(src,filename) {
    let option = {
        method:"GET", // POST, PUT, DELETE
        uri:src,
        headers:{"User-Agent":"Mozilla/5.0"},
        encoding:null
    };
    
    request(option).pipe(fs.createWriteStream(titleId + "/" + filename));

}