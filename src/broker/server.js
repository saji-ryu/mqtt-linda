import mosca from "mosca";
import mongoose from "mongoose";
import express from "express";
import http from 'http';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {TupleModel} from "./model";
import index from "./routes/index"

const mongoURI = 'mongodb://127.0.0.1:27017/mqtt';
const settings = {
    port: 1883
};

const app = express();
const httpServer = http.createServer(app);

app.set('views','views/');
app.set('view engine', 'pug');

app.use(logger('dev')); //アクセスログをとる
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public/'));

app.use('/',index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


const mqttServer = new mosca.Server(settings);

mqttServer.on('ready', function () {
    console.log('Server is ready.');
});

mqttServer.on('clientConnected', function (client) {
    console.log('broker.on.connected.', 'client:', client.id);
});

mqttServer.on('clientDisconnected', function (client) {
    console.log('broker.on.disconnected.', 'client:', client.id);
});

mqttServer.on('subscribed', function (topic, client) {
    console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic);
});

mqttServer.on('unsubscribed', function (topic, client) {
    console.log('broker.on.unsubscribed.', 'client:', client.id);
});

mqttServer.on('published', function (packet, client) {

    if (/\/new\//.test(packet.topic)) {
        return;
    } else if (/\/disconnect\//.test(packet.topic)) {
        return;
    } else {
        console.log('broker.on.published.', 'client:', client.id);
        let mes = JSON.parse(packet.payload.toString('UTF-8'));
        let tuple = new TupleModel({
            data: mes,
            publisher: client.id,
            time: Date.now(),
            topic: packet.topic
        });
        tuple.save((err) => {
            if (err) {
                console.log(err);
            }
        });
    }

});



mqttServer.attachHttpServer(httpServer);
httpServer.listen(3000);

mongoose.connect(mongoURI, () => {
    console.log('connected to mongo');
});