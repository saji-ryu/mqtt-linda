import mqttLindaClient from '../lib/mqtt-linda';


const linda = new mqttLindaClient();
let tuple = {type:"test",name:"hoge",value:30,where:"delta",cmd:"on"};
let wtuple = {type:"test",value:10,test:"test"};
let w2tuple = {type:"test",value:30};
let w3tuple = {type:"test",value:30,name:"hoge"};



linda.connect({tupleSpace:"masuilab"});
linda.on('connect', () => {
    console.log('connected!');
    linda.watch(w3tuple,(data)=>{
        console.log(data);
        linda.close();
    });
    linda.write(tuple,(err)=>{
        if(err) console.log(err);
    });
});
