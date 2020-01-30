var async_request = require('request');   //비동기 요청시
var cheerio       = require('cheerio');   //dom parse
var naver         = require('./naver_modules');
let option = {
    headers : {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
    }
};

exports.get_toon_number = (host, toon_search_url) => {
    return new Promise((resolve) => {
        option.url = host + toon_search_url; // url 세팅
        async_request(option, (err, res, html) => { // 파싱부
            const $ = cheerio.load(html);
            const $resultLength = $('#content .resultList');
            const $resultList = $('#content .resultList h5');
            if ($resultLength[0].children[0].type === 'text') { resolve(0); }
            else { resolve($resultList[0].children[3].attribs.href); } // 해당툰 url 뽑아냄 
        });
    });
}

exports.get_toon_epi = (host, toon_url) => {
    return new Promise((resolve) => {
        option.url = host + toon_url;
        async_request(option, (err, res, html) => {
            const $ = cheerio.load(html);
            const $resultList = $('.viewList tbody tr .title');
            
            let episode_new = [];
            let scrap_length = ($resultList.length >= 5) ? 5 : $resultList.length; // 웹툰갯수가 5보다 적으면 연재중인 길이로
            for (let i=0; i<scrap_length; i++) { episode_new[i] = $resultList[i].children[1].attribs.href; } // 최신화들 저장
            resolve(episode_new);
        });
    });
}

exports.get_toon_epi_info = (host, toon_epi_url_list) => {
    return new Promise(async (resolve) => {
        let scrap_toon_info_list = await Promise.all(toon_epi_url_list.map(async (url, idx) => {
            return naver.select_toon_info(host, url);
        }));
        resolve(scrap_toon_info_list);
    });
}

exports.select_toon_info = (host, epi_url) => {
    return new Promise((resolve) => {
        option.url = host + epi_url;
        async_request(option, (err, res, html) => {
            const $         = cheerio.load(html);
            const $title    = $('.tit_area .view h3');
            const $regDate  = $('.rt .date');
            const $pointNum = $('#topPointTotalNumber strong');
            const $pointPer = $('.pointTotalPerson em');

            let scrap_toon_info = {
                title   : $title[0].children[0].data,
                regDate : $regDate[0].children[0].data,
                pointNum: $pointNum[0].children[0].data,
                pointPer: $pointPer[0].children[0].data
            };
            resolve(scrap_toon_info);
        });
    });
}