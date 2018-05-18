import mqttLindaClient from './linda_adapter';


const linda = new mqttLindaClient();
let tuple = {type:"test",name:"hoge",value:30,where:"delta"};


linda.connect();
linda.write(tuple);//pub