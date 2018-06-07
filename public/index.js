$(function () {
    var watchTuple = $("#main").data("watch");

    let linda = new mqttLindaClient();

    let clid = "server-view" + Date.now().toString();

    let settings = {
        host: 'localhost',
        port: 3000,
        clientId: clid,
        tupleSpace: "masuilab"
    };

    let isDisconnected = false;

    linda.connect(settings).then(() => {
        linda.on('connect', () => {
            if(isDisconnected){
                location.reload();
            }
            linda.watch(watchTuple, (topic, data) => {
                console.log("get data :" + JSON.stringify(data));
                $('<li>' + JSON.stringify(data) + '</li>').prependTo('#content').hide().fadeIn(500);
            });
        });
        linda.on("offline",()=>{
            console.log("offline");
            isDisconnected = true;
        });
        linda.on("reconnecting",()=>{
            console.log("reconnect");
        });
        $("#write-button").on("click",()=>{
            linda.write(watchTuple,(err, topic, tuple) => {
                console.log("write topic:" + topic + " tuple:" + JSON.stringify(tuple));
            });
        });
    });
});



