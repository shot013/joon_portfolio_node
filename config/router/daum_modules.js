var async_request = require('request');   //비동기 요청시
var moment  = require('moment');

let option = {
    headers : {
        'user-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-Encoding': 'gzip, deflate',
        'accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'connection': 'keep-alive',
        'cookie': 'webid=4e65530aae8144ce96466c7239b8ea7f; RECENT_USE=on; AGEN=ZMquRxAJM0qI70wqRiwZIW_gfTFc9mKBPkQFhb8RKWU; SLEVEL=1; _fbp=fb.1.1579577854831.1265511253; RECENT_VIEW="1968,80027,81640"; VOTE=MTAuNTE%3D; MY=MTAuNTE%3D; ORDER=MTAuNTE%3D; RECENT_SEARCH=%EB%AC%B4%EC%9E%A5%2C%EB%AC%B4%EC%9E%A5%2C%2F%EB%AC%B4%EC%9E%A5%2C%ED%95%B4%EC%B9%98%EC%A7%80%EC%95%8A%EC%95%84%2C%EC%B0%A8%ED%94%BC; TIARA=wPWu986oUfL.PQZnEeP5.8j5LbWu-LPR4k5YHAX4g6FjFELlWFJSwa7Gr7Jyw.-3PhqYSr63z4922hxf.6a17pdnqIPLKdnb; webid_sync=1579924156508',
    }
};

exports.get_toon_nick = (host, toon_search_url) => {
    return new Promise((resolve) => {
        option.url = host + toon_search_url; // url 세팅
        async_request(option, (err, res, toon_list) => { // 파싱부, 다음은 직렬화를 통해 데이터를 주고받음(REST)
            let json_parse = JSON.parse(toon_list); // 역직렬화
            if (json_parse.data.webtoon == undefined) { resolve(0); }
            else { resolve(json_parse.data.webtoon[0].nickname); } // 가장 처음것 리턴 -> 신뢰도 가장 높음
        });
    });
}

exports.get_toon_epi = (host, toon_nick) => {
    return new Promise((resolve) => {
        option.url = host + '/data/pc/webtoon/view/' + toon_nick;
        async_request(option, (err, res, epi_list) => {
            let json_parse  = JSON.parse(epi_list);
            let avgScroe    = parseFloat(json_parse.data.webtoon.averageScore).toFixed(2);
            resolve([json_parse.data.webtoon.webtoonEpisodes, avgScroe]); // idx=1 -> 작품의 평점
        });
    });
}

exports.get_free_selector = (toon_list) => {
    return new Promise((resolve) => {
        let free_toon_list = [];
        
        // 순서가 반대인것도 있으니 정렬
        toon_list[0] = toon_list[0].sort(
            (a, b) => { return a.dateCreated < b.dateCreated ? -1 : a.dateCreated > b.dateCreated ? 1 : 0; }
            );
            
        for (let i=0; i<toon_list[0].length; i++) {
            if (toon_list[0][i].price == '0' || toon_list[0][i].price == 0){
                let free_epi = {
                    title       : toon_list[0][i].title,
                    regDate     : moment(toon_list[0][i].dateCreated.substring(0,8), 'YYYYMMDD').format('YYYY[.]MM[.]DD'),
                    pointNum    : toon_list[1],
                    pointPer    : toon_list[0][i].voteTarget.voteCount
                }
                free_toon_list.push(free_epi);
            };
        }
        resolve(free_toon_list);
    });
}

exports.get_toon_epi_info = (free_toon_list) => {
    return new Promise((resolve) => {
        const scrap_length  = (free_toon_list.length >= 5) ? 5 : free_toon_list.length;
        const for_length    = free_toon_list.length - scrap_length;
        let epi_list = []

        for(let i=free_toon_list.length-1; i>= for_length; i--) {
            epi_list[free_toon_list.length-1-i] = free_toon_list[i];
        }
        resolve(epi_list);
    });
}