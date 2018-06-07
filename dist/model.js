'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
//import * as mongoose from "mongoose";
const mongoose = require("mongoose");

const Tuple = new mongoose.Schema({
    data: { type: Object, require: true },
    publisher: { type: Object },
    time: { type: Number, require: true },
    topic: { type: String, require: true }
});

const UserState = new mongoose.Schema({
    type: { type: String, require: true },
    name: { type: String, require: true },
    time: { type: Number, require: true },
    topic: { type: String },
    isOn: { type: Boolean, require: true }
});

let TupleModel = mongoose.model('tuple', Tuple);
let UserStateModel = mongoose.model('user_state', UserState);

exports.TupleModel = TupleModel;
exports.UserStateModel = UserStateModel;