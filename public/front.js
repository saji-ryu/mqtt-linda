$(function () {
    var topic_data = $("#main").data("topic");
    var client = mqtt.connect('mqtt://localhost:3000');
    console.log("watching:" + JSON.stringify(topic));
    var topic = topic_data.type ? topic_data.type : '#';
    client.subscribe(topic);
    client.on("message", function (t, p) {
        console.log("topic=" + t + " data=" + p.toString('utf-8'));
        $('<li>' + p.toString() + '</li>').prependTo('#content').hide().fadeIn(500);
    });
});



