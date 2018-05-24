import express from 'express';
const router = express.Router();
import topicFormatter from '../topicFormatter'

require('dotenv').config();


router.get('/',(req,res)=>{
    res.render('index', {
        topic: topicFormatter(req.query),
        mqttPort: process.env.MQTT_PORT
    });
});

export default router;