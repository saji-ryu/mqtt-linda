const assert = require("power-assert"); // assertモジュールのinclude

import mqttLindaClient from "../src/lib/mqtt-linda";

describe('mqttlindaのモジュールをテスト', () => {
    describe('constructor', () => {
        let obj = new mqttLindaClient();
        it('初期値の設定ができてるか', () => {
            assert.equal(obj.tupleSpace, 'tupleSpace');
            assert.equal(obj.default_settings.host, 'localhost');
            assert.equal(obj.default_settings.port, 1883);
            assert.equal(obj.default_settings.clientId, 'cl1');
        });
        it('settingsの代入',()=>{
            let settings = {
                tupleSpace: "test",
                clientId: "test"
            };
            obj.connect(settings,(err,data)=>{
                assert.equal(obj.tupleSpace, 'test');
                assert.equal(obj.option.clientId, 'test');
                if(err) assert(false);
            });
        });
        it('watchの検査',()=>{
            let testTuple2 = {type:"test",name:"test",where:"delta"};
            obj.watch(testTuple2,(topic,data)=>{
                assert.equal(topic,"test/test/test/delta/?");
                assert.equal({type:"test",name:"test",value:100,where:"delta"},data);
            });

        });
        it('writeの検査',()=>{
            let testTuple = {type:"test",name:"test",value:100,where:"delta"};
            obj.write(testTuple,(err,topic,data)=>{
                assert.equal(topic,"test/test/test/delta/?");
                assert.equal(testTuple,data);
            });

        });

    });

});