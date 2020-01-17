module.exports = (app) => {
    // router
    app.get('/', (req, res) => {
        console.log('index로');
        res.render('./index.html');
    });
    
    app.get('/myways', (req, res) => {
        console.log('myways로');
        res.render('./myways.html');
    });

    app.get('/guestbook', (req, res) => {
        console.log('guestbook으로');
        res.render('./guestbook.html');
    });
    
    app.get('/scraping', (req, res) => {
        console.log('scraping');
        res.render('./scraping.html');
    });
}