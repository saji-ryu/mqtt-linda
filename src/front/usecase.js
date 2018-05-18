import mqttLindaClient from './linda_adapter';


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

// linda.connect().then(linda.watch(wtuple,(data)=>{
//     console.log(data);
//     linda.close();
// })).then(linda.write(tuple));
//pub
//linda.read(wtuple);

//linda.close();