$(function () {
    var watchTuple = $("#main").data("watch");

    let linda = new mqttLinda();

    let settings = {
        host: 'localhost',
        port: 3000,
        clientId: "server-view",
        tupleSpace: "masuilab"
    };

    linda.connect(settings).then(() => {
        linda.on('connect', () => {
            linda.watch(watchTuple, (topic, data) => {
                console.log("get data :" + JSON.stringify(data));
                $('<li>' + JSON.stringify(data) + '</li>').prependTo('#content').hide().fadeIn(500);
            });
        });
    });

    $("#write-button").on("click",()=>{
        linda.write(watchTuple,(err, topic, tuple) => {
            console.log("write topic:" + topic + " tuple:" + JSON.stringify(tuple));
        });
    });
});



