import mosca from "mosca";
import mongoose from "mongoose";
import express from "express";
import http from 'http';

import {TupleModel} from "./model";

const mongoURI = 'mongodb://127.0.0.1:27017/mqtt';

const settings = {
    port: 1883
};


mongoose.connect(mongoURI, () => {
    console.log('connected to mongo');
});


const app = express();
const httpServer = http.createServer(app);

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