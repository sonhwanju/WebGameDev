const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let novelId = process.argv[2];
let no = process.argv[3]*1;
let no2 = process.argv[4]*1;


for(let j = no; j <= no2; j++) {
    let uri = `https://novel.naver.com/webnovel/detail.nhn?novelId=${novelId}&volumeNo=${j}`;
    request(uri, function(err,res,body) {

    
        let $ = cheerio.load(body);
        let text = $(".detail_view_content").text();
        
        fs.mkdirSync(novelId + "/" + j, {recursive:true});

        fs.writeFile(`${novelId}/${j}/${j}화.txt`,text,(err)=> {
            if(err) {
                console.log(err);
            }
        });
    });
}