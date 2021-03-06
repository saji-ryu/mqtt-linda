"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
require('dotenv').config();

const pubTopicFormatter = obj => {
    let topic = process.env.TUPLE_SPACE;
    let topicStructure = process.env.TOPIC_STRUCTURE.split("/");

    for (let p of topicStructure) {
        if (obj[p]) {
            topic = topic + "/" + obj[p];
        } else {
            topic += "/?";
        }
    }
    return topic;
};

const subTopicFormatter = obj => {
    let topic = process.env.TUPLE_SPACE;
    let topicStructure = process.env.TOPIC_STRUCTURE.split("/");

    for (let p of topicStructure) {
        if (obj[p]) {
            topic = topic + "/" + obj[p];
        } else {
            topic += "/+";
        }
    }
    return topic;
};

exports.pubTopicFormatter = pubTopicFormatter;
exports.subTopicFormatter = subTopicFormatter;