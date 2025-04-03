const mongoose = require('mongoose');

const connect = () => {
    console.log("Mongodb connection requested");
    return mongoose.connect('mongodb://127.0.0.1:27017/AirLineBookingDb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = {
    connect
}