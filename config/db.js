const mongoose = require('mongoose');
module.exports = () => {
    var db = mongoose.connection;

    mongoose.connect('mongodb://54.180.32.10:27017/guestbook', 
        { 
            useNewUrlParser: true,
            useUnifiedTopology: false 
        }
    );

    db.on('error', console.error);
    db.once('open', () => {
        console.log('mongodb connect');
    });
}