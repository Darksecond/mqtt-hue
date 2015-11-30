"use strict";

let config = require('./config.json');

let huejay = require('huejay');
let mqtt    = require('mqtt');

let hueClient = new huejay.Client(config.hue);
let mqttClient  = mqtt.connect(config.mqtt);

let sensors = require('./sensors');
let lights = require('./lights');

sensors.init({hue: hueClient, mqtt: mqttClient});
lights.init({hue: hueClient, mqtt: mqttClient});
