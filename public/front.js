$(function () {
    var watchTuple = $("#main").data("watch");

    let linda = new mqttLinda();

    let settings = {
        host: 'localhost',
        port: 3000,
        clientId: "browser",
        tupleSpace: "masuilab"
    };

//標準的記法
    linda.connect(settings).then(() => {
        linda.on('connect', () => {
            linda.watch(watchTuple, (topic, data) => {
                console.log("get data :" + JSON.stringify(data));
                $('<li>' + JSON.stringify(data) + '</li>').prependTo('#content').hide().fadeIn(500);
            });
        })
    });

});



