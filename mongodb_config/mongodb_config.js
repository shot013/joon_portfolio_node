var express = require('express'),
    http    = require('http'),
    path    = require('path');

var bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    static          = require('serve-static'),
    errorHandler    = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/views/assets/css', static(path.join(__dirname, 'main')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var router = express.Router();

router.route('/process/login').post((req, res) => {
    console.log('login 호출');
});

app.use('/', router);

var errorHandler = expressErrorHandler({
                                        static: {
                                            '404': './mongodb_config/views/index.html'
                                        }
                                    });

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), () => {
   console.log('server start  :: ' + app.get('port')); 
});