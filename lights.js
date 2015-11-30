"use strict";

// TODO: capabilities

// lights/hue/{unique_id}/get/on
// lights/hue/{unique_id}/get/hue
// lights/hue/{unique_id}/get/brightness
// lights/hue/{unique_id}/get/saturation
// lights/hue/{unique_id}/get/name
//
// lights/hue/{unique_id}/set/state
//   {
//     brightness: 0,
//     hue: 0,
//     transitionTime: 0,
//     on: true,
//     saturation: 0
//   }
// lights/hue/{unique_id}/set/on
// lights/hue/{unique_id}/set/brightness

let lights = {
  timeout: 1000,
  regex: "lights/hue/(.*)/set/(.*)",
  lights: {}
};
module.exports = lights;

lights.init = function(options) {
  this.hue  = options.hue;
  this.mqtt = options.mqtt;

  this.callback();

  this.mqtt.subscribe('lights/hue/+/set/+');
  this.mqtt.on('message', this.onMessage.bind(this));
};

lights.onMessage = function(topic, message) {
  let parts = topic.match(this.regex);
  if(parts == null) return;
  let identifier = parts[1];
  let property = parts[2];
  let light = this.lights[identifier];
  if(light === undefined) return;

  switch(property) {
    case "on":
      light.on = message.toString() == 'true';
      break;
    case "brightness":
      light.brightness = message.toString();
      break;
    case "state":
      try {
        let json = JSON.parse(message.toString());
        if(json["brightness"]!=undefined) light.brightness = json["brightness"];
        if(json["transitionTime"]!=undefined) light.transitionTime = json["transitionTime"];
        if(json["hue"]!=undefined) light.hue = json["hue"];
        if(json["saturation"]!=undefined) light.saturation = json["saturation"];
        if(json["on"]!=undefined) light.on = json["on"]=='true';
      } catch (ex) {
        console.log(ex);
      }
      break;
  }
  this.hue.lights.save(light);
};

lights.callback = function() {
  this.hue.lights.getAll()
    .then(lights => {
      for (let light of lights) {
        let previous = this.lights[light.uniqueId];
        this.lights[light.uniqueId] = light;

        this.publishLight(previous, light);
      }
      setTimeout(this.callback.bind(this), this.timeout);
    })
    .catch(error => {
      console.log(`An error occurred: ${error.message}`);
    });
};

lights.publishLight = function(previous, current) {
  if(!previous || previous.name != current.name)
    this.mqtt.publish(`lights/hue/${current.uniqueId}/get/name`, `${current.name}`, { retain: true });
  if(!previous || previous.on != current.on)
    this.mqtt.publish(`lights/hue/${current.uniqueId}/get/on`, `${current.on}`, { retain: true });
  if(!previous || previous.hue != current.hue)
    this.mqtt.publish(`lights/hue/${current.uniqueId}/get/hue`, `${current.hue}`, { retain: true });
  if(!previous || previous.saturation != current.saturation)
    this.mqtt.publish(`lights/hue/${current.uniqueId}/get/saturation`, `${current.saturation}`, { retain: true });
  if(!previous || previous.brightness != current.brightness)
    this.mqtt.publish(`lights/hue/${current.uniqueId}/get/brightness`, `${current.brightness}`, { retain: true });
};
