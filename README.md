# MQTT - Hue Bridge

This is a MQTT to Philips Hue Bridge. It is written in Node.js and provides MQTT control over hue sensors and lights.

## Endpoints

### Lights

```
lights/hue/{unique_id}/get/on
lights/hue/{unique_id}/get/hue
lights/hue/{unique_id}/get/brightness
lights/hue/{unique_id}/get/saturation
lights/hue/{unique_id}/get/name

lights/hue/{unique_id}/set/state
  {
    brightness: 0,
    hue: 0,
    transitionTime: 0,
    on: true,
    saturation: 0
  }
lights/hue/{unique_id}/set/on
lights/hue/{unique_id}/set/brightness
```

These are the light endpoints. All of the 'get' endpoints are retained.
The state requires JSON. An example is given.

### Sensors
#### Switches (ZLLSwitch)

```
sensors/hue/{unique_id}/get/battery
sensors/hue/{unique_id}/get/name
sensors/hue/{unique_id}/get/buttons/on
sensors/hue/{unique_id}/get/buttons/off
sensors/hue/{unique_id}/get/buttons/up
sensors/hue/{unique_id}/get/buttons/down
```
Each Button action can have 3 different events `hold, short` or `long`.

#### Temperature (ZHATemperature)
```
sensors/hue/{unique_id}/get/temperature
sensors/hue/{unique_id}/get/battery
sensors/hue/{unique_id}/get/name
```

#### Humidity (ZHAHumidift)
```
sensors/hue/{unique_id}/get/humidity
sensors/hue/{unique_id}/get/battery
sensors/hue/{unique_id}/get/name
```
