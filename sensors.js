"use strict";

// TODO: capabilities

// sensors/hue/{unique_id}/get/battery
// sensors/hue/{unique_id}/get/name
// sensors/hue/{unique_id}/get/buttons/on
// sensors/hue/{unique_id}/get/buttons/off
// sensors/hue/{unique_id}/get/buttons/up
// sensors/hue/{unique_id}/get/buttons/down
//

let sensors = {
  timeout: 15000,
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
        } else if(sensor.type == "ZHATemperature" || sensor.type == "ZLLTemperature") {
          this.temp(previous, sensor);
        } else if(sensor.type == "ZHAHumidity") {
          this.humidity(previous, sensor);
        }
      }
      setTimeout(this.callback.bind(this), this.timeout);
    })
   .catch(error => {
      console.log(`An error occurred: ${error.message}`);
    });
};

sensors.humidity = function(previous, current) {
  var currentAttr = current.state.attributes.attributes;
  var prevAttr;
  if(previous) {
    var prevAttr = previous.state.attributes.attributes;
  }

  if(!previous || previous.name != current.name)
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/name`, `${current.name}`, { retain: true });

  if(!previous || previous.config["battery"] != current.config["battery"])
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/battery`, `${current.config["battery"]}`, { retain: true });

  if(previous && (prevAttr["lastupdated"] != currentAttr["lastupdated"])) {
    var humidity =  current.state.attributes.attributes["humidity"] / 100;
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/humidity`, `${humidity}`, { retain: true });
  }

  if(!previous) {
    var humidity =  current.state.attributes.attributes["humidity"] / 100;
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/humidity`, `${humidity}`, { retain: true });
  }
}

sensors.temp = function(previous, current) {
  var currentAttr = current.state.attributes.attributes;
  var prevAttr;
  if(previous) {
    var prevAttr = previous.state.attributes.attributes;
  }

  if(!previous || previous.name != current.name)
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/name`, `${current.name}`, { retain: true });

  if(!previous || previous.config["battery"] != current.config["battery"])
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/battery`, `${current.config["battery"]}`, { retain: true });

  if(previous && (prevAttr["lastupdated"] != currentAttr["lastupdated"])) {
    var temp =  current.state.attributes.attributes["temperature"] / 100;
    this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/temperature`, `${temp}`, { retain: true });
  }

  if(!previous) {
    var temp =  current.state.attributes.attributes["temperature"] / 100;
      this.mqtt.publish(`sensors/hue/${current.uniqueId}/get/temperature`, `${temp}`, { retain: true });
  }
}

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
