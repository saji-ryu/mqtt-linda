import mqttLindaClient from '../lib/mqtt-linda';
import 'babel-polyfill';

const linda = new mqttLindaClient();
let tuple = {type: "test", name: "hoge", value: 30, where: "delta", cmd: "on",who:"saji"};
let wtuple = {type: "test", value: 10, test: "test"};
let w2tuple = {type: "test", who:"saji"};
let w3tuple = {type: "test", value: 30, name: "hoge", where: "delta"};

//標準的記法
linda.connect({tupleSpace: "masuilab"}).then(()=>{
    linda.on('connect',()=>{
        linda.watch(w2tuple, (topic, data) => {
            console.log("get data :" + data);
            linda.close();
        });
        linda.write(tuple, (err, topic, tuple) => {
            console.log("write topic:" + topic + " tuple:" + tuple);
        });
    })
});

//即時間数＆async-await
// (async ()=> {
//     await linda.connect({tupleSpace: "masuilab"});
//     linda.on('connect',()=>{
//         linda.watch(w2tuple, (topic, data) => {
//             console.log("get data :" + data);
//         });
//         linda.write(tuple, (err, topic, tuple) => {
//             console.log("write topic:" + topic + " tuple:" + tuple);
//         });
//     })
// })();

// async-await
// async function test() {
//     await linda.connect({tupleSpace: "masuilab"});
//     linda.on('connect',()=>{
//         linda.watch(w2tuple, (topic, data) => {
//             console.log("get data :" + data);
//         });
//         linda.write(tuple, (err, topic, tuple) => {
//             console.log("write topic:" + topic + " tuple:" + tuple);
//         });
//     })
// }
// test();
