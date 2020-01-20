var axios   = require('axios');
var cheerio = require('cheerio'); // 셀렉터
var request = require('request');
var puppeteer = require('puppeteer');

function google_search(body) {
    const $ = cheerio.load(body);
    const $titleList    = $('.srg .g .LC20lb');
    const $textList     = $('.srg .s span.st');
    const $blogName     = $('.srg .iUh30.rpCHfe');
    let   googleSearchList    = [];

    for(let i=0; i<3; i++) {
        let text = '';
        let temp = $textList[i].children;
        for (let j=0; j<temp.length; j++) {
            if (temp[j].type == 'text') { text += temp[j].data }
            else                        { text += temp[j].children[0].data }
        }
        
        let googleSearchInfo = {
            title   : $titleList[i].children[0].data,
            text    : text,
            blogName: $blogName[i].children[0].data,
            regDate : ''
        }
        googleSearchList[i] = googleSearchInfo;
    }
    return googleSearchList;
}

function naver_search(body){
    const $ = cheerio.load(body);
    const $titleList    = $('.type01._content .review_tit');
    const $textList     = $('.type01._content .review_txt');
    const $blogInfo     = $('.type01._content .detail_box');
    let   naversearchList    = [];
    for(let i=0; i<3; i++) {
        let naversearchInfo = {
            title   : $titleList[i].attribs.title,
            text    : $textList[i].children[0].data,
            blogName: $blogInfo[i].children[1].children[0].data,
            regDate : $blogInfo[i].children[3].children[0].data
        };
        naversearchList[i] = naversearchInfo;
    }
    return naversearchList;
}

function daum_search(body) {
    const $ = cheerio.load(body);
    const $titleList    = $('#blogColl .f_link_b');
    const $textList     = $('#blogColl .f_eb.desc');
    const $blogName     = $('#blogColl a.f_nb');
    const $regDate      = $('#blogColl span.f_nb.date');
    let daumsearchList = [];
    for(let i=0; i<3; i++) {
        let title   = '';
        let text    = '';

        for(let j=0; j<$titleList[i].children.length; j++) {
            let temp = $titleList[i].children[j];
            if (temp.type == 'text') { title += temp.data }
            else                     { title += temp.children[0].data}
        }
        
        for(let j=0; j<$textList[i].children.length; j++) {
            let temp = $textList[i].children[j];
            if (temp.type == 'text') { text += temp.data }
            else                     { text += temp.children[0].data}
        }
        let daumsearchInfo = {
            title   : title,
            text    : text,
            blogName: $blogName[i].children[0].data,
            regDate : $regDate[i].children[0].data
        };
        daumsearchList[i] = daumsearchInfo;
    }
    return daumsearchList;
}

module.exports = (app) => {
    // router
//  퍼펫티어 사용하여 스크린샷 처리
    app.get('/scrapCapture', async (req, res) => {
        let keyword = encodeURIComponent(req.query.keyword);
        let scrap_scheduler = [
            ['https://search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=', 'naver.png'],
            ['https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q=', 'daum.png'],
            ['https://www.google.com/search?sxsrf=ACYBGNS9zevVWU4jma9n3fBFbmijQVsnJA%3A1579500092917&source=hp&ei=PEIlXsTkNeCMr7wP4ai7wAM&gs_l=psy-ab.3..35i39j0i131j0i20i263j0l7.810.3632..3845...8.0..4.131.1661.0j15......0....1..gws-wiz.....10..0i10j35i362i39j0i67.NlceH30-Oug&ved=0ahUKEwjE8tWvwJHnAhVgxosBHWHUDjgQ4dUDCAY&uact=5&q=', 'google.png']
        ]
        
        for(let i=0; i<scrap_scheduler.length; i++) {
            console.log('screenshot' + i);
            const browser   = await puppeteer.launch();
            const page      = await browser.newPage();
            await page.goto(scrap_scheduler[i][0]+keyword);
            await page.screenshot({path: scrap_scheduler[i][1]});
            await browser.close();
        }

        
    });
    
    app.get('/scrap', (req, res) => {
        let keyword = encodeURIComponent(req.query.keyword);
        let scrap_scheduler = [
            'https://search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=',
            'https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&q=',
            'https://www.google.com/search?sxsrf=ACYBGNS9zevVWU4jma9n3fBFbmijQVsnJA%3A1579500092917&source=hp&ei=PEIlXsTkNeCMr7wP4ai7wAM&gs_l=psy-ab.3..35i39j0i131j0i20i263j0l7.810.3632..3845...8.0..4.131.1661.0j15......0....1..gws-wiz.....10..0i10j35i362i39j0i67.NlceH30-Oug&ved=0ahUKEwjE8tWvwJHnAhVgxosBHWHUDjgQ4dUDCAY&uact=5&q='
        ]
        let searchList = {};

        for (let i=0; i<scrap_scheduler.length; i++) {
            let opt = {
                url : scrap_scheduler[i]+keyword,
                headers : { // 네이버는 헤더없이 긁어지는데 다음은 안되서 추가
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
                }
            }
            request.get(opt, (err, res, body) => {
                if      (i == 0) { searchList.naver = naver_search(body);   }
                else if (i == 1) { searchList.daum  = daum_search(body);    }
                else if (i == 2) { searchList.google= google_search(body);  }
            });
        }     
                        
        setTimeout( () => {
//            console.log(searchList.naver);
//            console.log(searchList.daum);
//            console.log(searchList.google);
            res.send(searchList);
        }, 3000);
    });
}
