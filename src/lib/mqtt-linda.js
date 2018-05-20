import mqtt from "mqtt";
import 'babel-polyfill';
import * as JSONDiffPatch from "jsondiffpatch";

const jsondiffpatch = JSONDiffPatch.create();

export default class mqttLindaClient {
    constructor() {
        this.default_settings = {
            host: 'localhost',
            port: 1883,
            clientId: "cl1"
        }
        this.topic_structure = ["type", "name", "where", "who"];
        this.tupleSpace = "tupleSpace";
    }

    on(state, callback) {
        this.mqttClient.on(state, callback);
    }

    connect(settings) {
        if (!settings) {
            this.option = this.default_settings;
        } else {
            this.tupleSpace = settings.topic_structure || this.topic_structure;
            this.tupleSpace = settings.tupleSpace || this.tupleSpace;
            this.option = {
                host: settings.host || this.default_settings.host,
                port: settings.port || this.default_settings.port,
                clientId: settings.clientId || this.default_settings.clientId
            }
        }
        this.mqttClient = mqtt.connect(this.option);
    }

    write(write_tuple, callback) {
        console.log('written-tipic:' + this.write_transform(write_tuple));
        let ptopic = this.write_transform(write_tuple);
        this.mqttClient.publish(ptopic, JSON.stringify(write_tuple), (err) => {
            callback(err, ptopic, write_tuple);
        });
    }

    watch(read_tuple, callback) {
        console.log(this.read_transform(read_tuple));
        let stopic = this.read_transform(read_tuple);
        this.mqttClient.subscribe(stopic);
        this.mqttClient.on('message', (topic, message) => {
            let resdata = JSON.parse(message.toString());
            let condition = JSON.parse(JSON.stringify(read_tuple));
            if (this.diff_condition(resdata, condition)) {
                callback(topic, resdata);
            }
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

    diff_condition(data, cond) {
        let result = true;
        let delta = jsondiffpatch.diff(data, cond);
        for (let p in delta) {
            if (delta[p][2] == null) {
                result = false;
            }
        }
        return result;
    }
}