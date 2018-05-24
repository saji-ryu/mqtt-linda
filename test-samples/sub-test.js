var mqtt = require('mqtt');
var client = mqtt.connect({
    host: 'localhost',
    port: 1883,
    clientId: 'publisher3'
});

client.on('connect', function () {
    client.subscribe('#');
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
});
