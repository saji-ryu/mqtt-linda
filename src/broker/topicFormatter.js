require('dotenv').config();

const topicFromatter = (obj) => {
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
}

export default topicFromatter;