//import * as mongoose from "mongoose";
const mongoose = require("mongoose");

//let Schema = mongoose.Schema;

const Tuple = new mongoose.Schema({
    data: {type: Object, require: true},
    publisher: {type: Object},
    time: {type: Number, require: true},
    topic: {type: String, require: true}
});

let TupleModel = mongoose.model('tuple', Tuple);

export {TupleModel};