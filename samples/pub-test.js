var mqtt = require('mqtt');
var client = mqtt.connect({
    host: 'localhost',
    port: 1883,
    clientId: 'publisher2'
});

var obj = {
    name: 'test',
    value:0,
    hoge:'huga'
};


client.on('connect', function () {
    client.subscribe('tupleSpace/samples/+/+/+');
    client.publish('tupleSpace/samples/a/a/a', JSON.stringify(obj));
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    client.end();
});
