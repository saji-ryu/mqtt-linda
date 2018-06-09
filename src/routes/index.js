import express from "express";
import mqtt from "mqtt";

import { pubTopicFormatter } from "../topicFormatter";

require("dotenv").config();

const router = express.Router();
const mqttClient = mqtt.connect({
  host: "localhost",
  port: process.env.MQTT_PORT,
  clientId: "server-http-post"
});

router.get("/", (req, res) => {
  res.render("index", {
    tupleSpace: process.env.TUPLE_SPACE,
    watchTuple: req.query,
    httpHost: process.env.HTTP_HOST
  });
});

router.post("/", (req, res) => {
  let tupleData = JSON.parse(req.body.tuple);
  let pubtopic = pubTopicFormatter(tupleData);
  mqttClient.publish(pubtopic, req.body.tuple);
  res.send(tupleData);
});

export default router;
