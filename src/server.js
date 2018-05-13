const mosca = require("mosca");
const mongoose = require("mongoose");

import {TupleModel} from "./model";

const mongoURI = 'mongodb://127.0.0.1:27017/mqtt';

const settings = {
    port: 1883
};


mongoose.connect(mongoURI, () => {
    console.log('connected to mongo');
});


const server = new mosca.Server(settings);

server.on('ready', function () {
    console.log('Server is ready.');
});

server.on('clientConnected', function (client) {
    console.log('broker.on.connected.', 'client:', client.id);
});

server.on('clientDisconnected', function (client) {
    console.log('broker.on.disconnected.', 'client:', client.id);
});

server.on('subscribed', function (topic, client) {
    console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic);
});

server.on('unsubscribed', function (topic, client) {
    console.log('broker.on.unsubscribed.', 'client:', client.id);
});

server.on('published', function (packet, client) {


    if (/\/new\//.test(packet.topic)) {
        return;
    } else if (/\/disconnect\//.test(packet.topic)) {
        return;
    } else {
        console.log(client);
        console.log(packet);
        let mes = JSON.parse(packet.payload.toString('UTF-8'));
        console.log('message= ' + mes.name);
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
    //console.log('broker.on.published.', 'client:', client.id);
});