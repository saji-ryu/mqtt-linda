import mqtt from "mqtt";
import 'babel-polyfill';
import * as JSONDiffPatch from "jsondiffpatch";
import * as axios from "axios";

const jsondiffpatch = JSONDiffPatch.create();


export default class mqttLindaClient {
    constructor() {
        this.default_settings = {
            host: 'localhost',
            port: 1883,
            clientId: "cl1"
        };
        this.topic_structure = ["type", "name", "where"];
        this.tupleSpace = "tupleSpace";

    }

    async on(state, callback) {
        this.mqttClient.on(state, callback);
    }


    async connect(settings) {
        this.topic_structure = await this.get_settings();
        console.log('this tuplespace\'s topic_structure = ' + this.topic_structure);
        if (!settings) {
            this.option = this.default_settings;
        } else {
            //this.topic_structure = settings.topic_structure || this.topic_structure;
            this.tupleSpace = settings.tupleSpace || this.tupleSpace;
            this.option = {
                host: settings.host || this.default_settings.host,
                port: settings.port || this.default_settings.port,
                clientId: settings.clientId || this.default_settings.clientId
            }
        }
        await this.base_connect();
    }

    async write(write_tuple, callback) {
        //console.log('written-tipic:' + this.write_transform(write_tuple));
        let ptopic = this.write_transform(write_tuple);
        this.mqttClient.publish(ptopic, JSON.stringify(write_tuple), (err) => {
            //resolve(err, ptopic, write_tuple);
            callback(err, ptopic, write_tuple);
        });
    }

    async watch(read_tuple, callback) {
        console.log('watching-topic:' + this.read_transform(read_tuple));
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
        let topic_str = this.tupleSpace;
        for (let p of this.topic_structure) {
            topic_str += "/";
            topic_str += t[p] ? t[p] : "+";
        }
        return topic_str;
    }

    write_transform(t) {
        let topic_str = this.tupleSpace;
        for (let p of this.topic_structure) {
            topic_str += "/";
            topic_str += t[p] ? t[p] : "?";
        }
        return topic_str;
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

    get_settings() {
        return new Promise((resolve, reject) => {
            axios.get("http://localhost:3000/settings").then((mes) => {
                console.log("get settings data from server!");
                resolve(mes.data.topicStructure);
            });
        });
    }

    base_connect() {
        return new Promise((resolve, reject) => {
            this.mqttClient = mqtt.connect(this.option);
            resolve();
        })
    }

}