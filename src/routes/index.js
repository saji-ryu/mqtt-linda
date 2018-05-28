import express from 'express';
import mqtt from "mqtt";

require('dotenv').config();

const router = express.Router();
const mqttClient = mqtt.connect({
    host: "localhost",
    port: process.env.MQTT_PORT,
    clientId:"browser2"
});

import {pubTopicFormatter} from '../topicFormatter'


router.get('/', (req, res) => {
    res.render('index', {
        tupleSpace: process.env.TUPLE_SPACE,
        watchTuple: req.query,
        httpHost:process.env.HTTP_HOST,
    });
});


router.post('/', (req, res) => {
    // let tupleData = JSON.parse(req.body.tuple);
    let tupleData = JSON.parse(req.body.tuple);
    let pubtopic = pubTopicFormatter(tupleData);
    console.log("tes　"+tupleData+" "+pubtopic);
    console.log(typeof req.body.tuple);
    mqttClient.publish(pubtopic, req.body.tuple);
    res.send(tupleData);
});


export default router;