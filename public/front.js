$(function () {
    var topic_data = $("#main").data("topic");
    var client = mqtt.connect({
        host:'localhost',
        port:3000,
        clientId:'browser-test'
    });

    topic_data = topic_data.slice(1);
    topic_data = topic_data.slice(0,-1);

    client.subscribe(topic_data);

    client.on("message", function (t, p) {
        console.log("topic=" + t + " data=" + p.toString('utf-8'));
        $('<li>' + p.toString() + '</li>').prependTo('#content').hide().fadeIn(500);
    });
});



