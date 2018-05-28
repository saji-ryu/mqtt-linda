import express from 'express';

const router = express.Router();
require('dotenv').config();

const baseTopic = process.env.TOPIC_STRUCTURE.split("/");

router.get('/', (req, res) => {
    console.log(baseTopic);
    res.set('Access-Control-Allow-Origin','*');
    res.send({
        topicStructure: baseTopic,
        tupleSpace : process.env.TUPLE_SPACE,
        mqttPort: process.env.MQTT_PORT,
    });
});

export default router;