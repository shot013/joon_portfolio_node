module.exports = (app) => {
    // router
    app.get('/', (req, res) => {
        console.log('index로');
        res.render('./index.html');
    });

    app.get('/guestbook', (req, res) => {
        console.log('guestbook으로');
        res.render('./guestbook.html');
    });
}