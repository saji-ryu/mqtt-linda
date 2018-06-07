"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onSublist = undefined;

var _mosca = require("mosca");

var _mosca2 = _interopRequireDefault(_mosca);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _model = require("./model");

var _topicFormatter = require("./topicFormatter");

var _index = require("./routes/index");

var _index2 = _interopRequireDefault(_index);

var _settings = require("./routes/settings");

var _settings2 = _interopRequireDefault(_settings);

var _watchlist = require("./routes/watchlist");

var _watchlist2 = _interopRequireDefault(_watchlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mqtt";
console.log(mongoURI);
const mqttsettings = {
    port: Number(process.env.MQTT_PORT) || 1883
};

const sublist_exception = ["server-view", "server-http-post", "server-watch"];
const onSublist = {};
const app = (0, _express2.default)();
const httpServer = _http2.default.createServer(app);

app.set('views', 'views/');
app.set('view engine', 'pug');

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static('public/'));

app.use('/', _index2.default);
app.use('/settings', _settings2.default);
app.use('/watch', _watchlist2.default);

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

const mqttServer = new _mosca2.default.Server(mqttsettings);

mqttServer.on('ready', function () {
    console.log('Server is ready.');
});

mqttServer.on('clientConnected', function (client) {
    storeState('connect', client.id, 'none', true);
    console.log('broker.on.connected.', 'client:', client.id);
});

mqttServer.on('clientDisconnected', function (client) {
    storeState('connect', client.id, 'none', false);
    console.log('broker.on.disconnected.', 'client:', client.id);
});

mqttServer.on('subscribed', function (topic, client) {
    if (!isSublistMatch(client.id)) {
        onSublist[client.id] = {};
        onSublist[client.id].topic = topic;
        onSublist[client.id].time = Date.now();
        publishSubscriber(client.id, 'on');
        storeState('subscribe', client.id, topic, true);
    }
    console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic);
});

mqttServer.on('unsubscribed', function (topic, client) {
    if (!isSublistMatch(client.id)) {
        delete onSublist[client.id];
        publishSubscriber(client.id, "off");
        storeState("subscribe", client.id, topic, false);
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
        let tuple = new _model.TupleModel({
            data: mes,
            publisher: client.id,
            time: Date.now(),
            topic: packet.topic
        });
        tuple.save(err => {
            if (err) {
                console.log(err);
            }
        });
    }
});

mqttServer.attachHttpServer(httpServer);
httpServer.listen(Number(process.env.PORT) || 3000);
//httpServer.listen(3000);

_mongoose2.default.connect(mongoURI, () => {
    console.log('connected to mongo');
});

exports.onSublist = onSublist;


const isSublistMatch = str => {
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
    let tuple = { type: 'sublist', value: on_off, name: Id };
    let message = {
        topic: (0, _topicFormatter.pubTopicFormatter)(tuple),
        payload: JSON.stringify(tuple),
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };
    //console.log(message);
    mqttServer.publish(message);
};

const storeState = (type, name, topic, isOn) => {
    let subscriber = new _model.UserStateModel({
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