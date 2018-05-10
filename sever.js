import * as mosca from "mosca";
const server = new mosca.Server({
    port: 1883,
});

server.on('ready', function(){
    console.log('Server is ready.');
});

server.on('clientConnected', function(client){
    console.log('broker.on.connected.', 'client:', client.id);
});

server.on('clientDisconnected', function(client){
    console.log('broker.on.disconnected.', 'client:', client.id);
});

server.on('subscribed', function(topic, client){
    console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic);
});

server.on('unsubscribed', function(topic, client){
    console.log('broker.on.unsubscribed.', 'client:', client.id);
});

server.on('published', function(packet, client){
    if (/\/new\//.test(packet.topic)){
        return;
    }
    if (/\/disconnect\//.test(packet.topic)){
        return;
    }
    console.log('broker.on.published.', 'client:', client.id);
});