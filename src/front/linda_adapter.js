import mqtt from "mqtt";
import 'babel-polyfill';

export default class mqttLindaClient {
    constructor() {
        this.default_settings = {
            tupleSpace: "tupleSpace",
            host: 'localhost',
            port: 1883,
            clientId: "cl1",
        }
    }

    on(state, callback) {
        this.mqttClient.on(state, callback);
    }

    connect(settings) {
        if (!settings) {
            this.option = this.default_settings;
            this.tupleSpace = this.default_settings.tupleSpace;
        } else {
            this.tupleSpace = settings.tupleSpace || this.default_settings.tupleSpace;
            this.option = {
                host: settings.host || this.default_settings.host,
                port: settings.port || this.default_settings.port,
                clientId: settings.clientId || this.default_settings.clientId
            }
        }
        this.mqttClient = mqtt.connect(this.option);
    }

    write(w_tuple) {
        console.log(this.write_transform(w_tuple));
        this.mqttClient.publish(this.write_transform(w_tuple), JSON.stringify(w_tuple));
    }

    watch(r_tuple, callback) {
        console.log(this.read_transform(r_tuple));
        this.mqttClient.subscribe(this.read_transform(r_tuple));
        this.mqttClient.on('message', (topic, message) => {
            callback(JSON.parse(message.toString()));
        })
    }

    close() {
        this.mqttClient.end();
    }

    read_transform(t) {
        let tp1 = t.type ? t.type : "+";
        let tp2 = t.name ? t.name : "+";
        let tp3 = t.where ? t.where : "+";
        let tp4 = t.who ? t.who : "+";
        return this.tupleSpace + "/" + tp1 + "/" + tp2 + "/" + tp3 + "/" + tp4;
    }

    write_transform(t) {
        let tp1 = t.type ? t.type : "?";
        let tp2 = t.name ? t.name : "?";
        let tp3 = t.where ? t.where : "?";
        let tp4 = t.who ? t.who : "?";
        return this.tupleSpace + "/" + tp1 + "/" + tp2 + "/" + tp3 + "/" + tp4;
    }
}