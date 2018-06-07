'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mqtt = require('mqtt');

var _mqtt2 = _interopRequireDefault(_mqtt);

var _topicFormatter = require('../topicFormatter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const router = _express2.default.Router();
const mqttClient = _mqtt2.default.connect({
    host: "localhost",
    port: process.env.MQTT_PORT,
    clientId: "server-http-post"
});

router.get('/', (req, res) => {
    res.render('index', {
        tupleSpace: process.env.TUPLE_SPACE,
        watchTuple: req.query,
        httpHost: process.env.HTTP_HOST
    });
});

router.post('/', (req, res) => {
    let tupleData = JSON.parse(req.body.tuple);
    let pubtopic = (0, _topicFormatter.pubTopicFormatter)(tupleData);
    mqttClient.publish(pubtopic, req.body.tuple);
    res.send(tupleData);
});

exports.default = router;