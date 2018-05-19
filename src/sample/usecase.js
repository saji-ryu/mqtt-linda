import mqttLindaClient from '../lib/mqtt-linda';


const linda = new mqttLindaClient();
let tuple = {type:"test",name:"hoge",value:30,where:"delta"};
let wtuple = {type:"test"};


linda.connect({tupleSpace:"masuilab"});
linda.on('connect', () => {
    console.log('connected!');
    linda.watch(wtuple,(data)=>{
        console.log(data);
        linda.close();
    });
    linda.write(tuple);
});
