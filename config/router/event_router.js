var naver       = require('./naver_modules');
var daum        = require('./daum_modules');

module.exports = async (app) => {
    // 웹툰검색
    app.get('/search_toon', async (req, res) => {
        const portal = req.query.portal.toUpperCase();
        const toon   = encodeURIComponent(req.query.toon);

        if (portal == 'NAVER' || portal == '네이버') {
            const host  = 'https://comic.naver.com';
            const toon_search_url   = '/search.nhn?keyword=' + toon;
            const toon_scarp_url    = await naver.get_toon_number(host, toon_search_url);

            if (toon_scarp_url == 0) { return res.send('0'); }

            const toon_scrap_epi    = await naver.get_toon_epi(host, toon_scarp_url);
            const toon_epi_info_list = await naver.get_toon_epi_info(host, toon_scrap_epi);
            res.send(toon_epi_info_list);

        } else if (portal == 'DAUM' || portal == '다음') {
            const host = 'http://webtoon.daum.net';
            const toon_search_nick  = '/data/pc/search?q=' + toon;
            const toon_scarp_url    = await daum.get_toon_nick(host, toon_search_nick);

            if (toon_scarp_url == 0) { return res.send('0'); }

            const toon_scrap_epi    = await daum.get_toon_epi(host, toon_scarp_url);
            const toon_free_select  = await daum.get_free_selector(toon_scrap_epi);
            const toon_epi_info_list= await daum.get_toon_epi_info(toon_free_select);
            res.send(toon_epi_info_list);
        } else {
            res.send('0');
        }
    });
}