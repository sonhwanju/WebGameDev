const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let titleId = process.argv[2];
let no = process.argv[3]*1;
let no2 = process.argv[4]*1;


for(let j = no; j <= no2; j++) {
    let uri = `https://comic.naver.com/webtoon/detail.nhn?titleId=${titleId}&no=${j}`;
    request(uri, function(err,res,body) {

    
        let $ = cheerio.load(body);
        let list = $(".wt_viewer > img");
    
        fs.mkdirSync(titleId + "/" + j, {recursive:true});
        for(let i = 0; i < list.length;i++) {
            let src = list.eq(i).attr("src");
            download(src,j + "/" + `${i}.jpg`);
        }
        
    });
}


function download(src,filename) {
    let option = {
        method:"GET", // POST, PUT, DELETE
        uri:src,
        headers:{"User-Agent":"Mozilla/5.0"},
        encoding:null
    };
    
    request(option).pipe(fs.createWriteStream(titleId + "/" + filename));

}