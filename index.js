"use strict";

let huejay = require('huejay');
let mqtt    = require('mqtt');

let hueCredentials = {
  host: "192.168.0.6",
  username: "360e6f271aca9b9fbbf191731a5c78f"
};

let hueClient = new huejay.Client(hueCredentials);
let mqttClient  = mqtt.connect('mqtt://test.mosquitto.org');

let sensors = require('./sensors');
let lights = require('./lights');

sensors.init({hue: hueClient, mqtt: mqttClient});
lights.init({hue: hueClient, mqtt: mqttClient});
