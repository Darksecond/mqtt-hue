"use strict";

// TODO: capabilities

// sensors/hue/{unique_id}/get/battery
// sensors/hue/{unique_id}/get/name
// sensors/hue/{unique_id}/get/buttons/on
// sensors/hue/{unique_id}/get/buttons/off
// sensors/hue/{unique_id}/get/buttons/up
// sensors/hue/{unique_id}/get/buttons/down

let sensors = {
  timeout: 50,
  sensors: {}
};
module.exports = sensors;

sensors.init = function(options) {
  this.hue  = options.hue;
  this.mqtt = options.mqtt;

  this.callback();
};

sensors.callback = function() {
  this.hue.sensors.getAll()
    .then(sensors => {
      for (let sensor of sensors) {
        let previous = this.sensors[sensor.uniqueId];
        this.sensors[sensor.uniqueId] = sensor;

        if(sensor.type == "ZLLSwitch") {
          this.zll(previous, sensor);
        }
      }
      setTimeout(this.callback.bind(this), this.timeout);
    })
   .catch(error => {
      console.log(`An error occurred: ${error.message}`);
    });
};

sensors.zll = function(previous, current) {
  if(!previous || previous.name != current.name)
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/name`, `${current.name}`, { retain: true });

  if(!previous || previous.config["battery"] != current.config["battery"])
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/battery`, `${current.config["battery"]}`, { retain: true });

  if(previous && (previous.state["lastupdated"] != current.state["lastupdated"] || previous.state["buttonevent"] != current.state["buttonevent"])) {
    switch(current.state["buttonevent"]) {
      case 1001:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/on`, "hold");
        break;
      case 2001:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/up`, "hold");
        break;
      case 3001:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/down`, "hold");
        break;
      case 4001:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/off`, "hold");
        break;
      case 1002:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/on`, "short");
        break;
      case 2002:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/up`, "short");
        break;
      case 3002:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/down`, "short");
        break;
      case 4002:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/off`, "short");
        break;
      case 1003:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/on`, "long");
        break;
      case 2003:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/up`, "long");
        break;
      case 3003:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/down`, "long");
        break;
      case 4003:
        this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/buttons/off`, "long");
        break;
    }
  }
}
