var axios   = require('axios');
var cheerio = require('cheerio'); // 셀렉터
var iconv   = require('iconv-lite'); // 인코딩용

const scrap_html = async (url, keyword) => {
    try {
        return await axios.get(url);
    } catch(error) {
        console.log(error);
    }
}

const result = async (scrap_scheduler, keyword) => {
    const result = await scrap_html(scrap_scheduler, keyword);
    return await result;
}

module.exports = (app) => {
    // router
    app.get('/scrap', (req, res) => {
        console.log('scrap start');
        
        let keyword = req.query.keyword;
        let scrap_scheduler = [
           'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%B0%B0%ED%8B%80%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C&oquery=%EB%B0%B0%ED%8B%80%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C&tqi=UAZHRlp0J14ssBG3KyNssssssC0-284443',
            'https://www.google.com/search?q=',
            'https://search.daum.net/search?w=tot&q='
        ]

        result(scrap_scheduler[0], keyword).then((html) => {
            const $ = cheerio.load(html.data);
            const $reviews = $('.type01._content');
            console.log("html 받는중 :: " + $reviews);
        }); 
    });
}
