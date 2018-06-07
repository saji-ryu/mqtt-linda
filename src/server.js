import mosca from "mosca";
import mongoose from "mongoose";
import express from "express";
import http from 'http';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import {TupleModel} from "./model";
import {UserStateModel} from "./model";
import {pubTopicFormatter} from "./topicFormatter";

import index from "./routes/index";
import settings from "./routes/settings";
import watchlist from "./routes/watchlist"

require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
const mqttsettings = {
    port: Number(process.env.MQTT_PORT) || 1883
};

const sublist_exception = ["server-view", "server-http-post", "server-watch"];
const onSublist = {};
const app = express();
const httpServer = http.createServer(app);

app.set('views', 'views/');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public/'));

app.use('/', index);
app.use('/settings', settings);
app.use('/watch', watchlist);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


const mqttServer = new mosca.Server(mqttsettings);

mqttServer.on('ready', function () {
    console.log('Server is ready.');
});

mqttServer.on('clientConnected', function (client) {
    storeState('connect',client.id,'none',true);
    console.log('broker.on.connected.', 'client:', client.id);
});

mqttServer.on('clientDisconnected', function (client) {
    storeState('connect',client.id,'none',false);
    console.log('broker.on.disconnected.', 'client:', client.id);
});

mqttServer.on('subscribed', function (topic, client) {
    if (!isSublistMatch(client.id)) {
        onSublist[client.id] = {};
        onSublist[client.id].topic = topic;
        onSublist[client.id].time = Date.now();
        publishSubscriber(client.id, 'on');
        storeState('subscribe',client.id, topic, true);
    }
    console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic);
});

mqttServer.on('unsubscribed', function (topic, client) {
    if (!isSublistMatch(client.id)) {
        delete onSublist[client.id];
        publishSubscriber(client.id, "off");
        storeState("subscribe",client.id, topic, false);
    }
    console.log('broker.on.unsubscribed.', 'client:', client.id);
});

mqttServer.on('published', function (packet, client) {
    if (/\/new\//.test(packet.topic)) {
        return;
    } else if (/\/disconnect\//.test(packet.topic)) {
        return;
    } else if (/masuilab\/sublist/.test(packet.topic)) {
        return;
    } else {
        console.log('broker.on.published.', 'client:', client.id);
        console.log(packet.topic);
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
httpServer.listen(process.env.HTTP_PORT || 3000);

mongoose.connect(mongoURI, () => {
    console.log('connected to mongo');
});


export {onSublist};

const isSublistMatch = (str) => {
    let rval = false;
    for (let i = 0; i < sublist_exception.length; i++) {
        if (str.indexOf(sublist_exception[i]) > -1) {
            rval = true;
            break;
        }
    }
    return rval;
};

const publishSubscriber = (Id, on_off) => {
    let tuple = {type: 'sublist', value: on_off, name: Id};
    let message = {
        topic: pubTopicFormatter(tuple),
        payload: JSON.stringify(tuple),
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };
    //console.log(message);
    mqttServer.publish(message);
};

const storeState = (type, name, topic, isOn) => {
    let subscriber = new UserStateModel({
        type: type,
        name: name,
        time: Date.now(),
        topic: topic,
        isOn: isOn
    });
    subscriber.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
};