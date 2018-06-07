'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

const router = _express2.default.Router();
const baseTopic = process.env.TOPIC_STRUCTURE.split("/");

router.get('/', (req, res) => {
    console.log(baseTopic);
    res.set('Access-Control-Allow-Origin', '*');
    res.send({
        topicStructure: baseTopic,
        tupleSpace: process.env.TUPLE_SPACE,
        mqttPort: process.env.MQTT_PORT
    });
});

exports.default = router;