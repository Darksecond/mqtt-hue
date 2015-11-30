# MQTT - Hue Bridge

This is a MQTT to Philips Hue Bridge. It is written in Node.js and provides MQTT control over hue sensors and lights.

# Lights

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

# Sensors

```
sensors/hue/{unique_id}/get/battery
sensors/hue/{unique_id}/get/name
sensors/hue/{unique_id}/get/buttons/on
sensors/hue/{unique_id}/get/buttons/off
sensors/hue/{unique_id}/get/buttons/up
sensors/hue/{unique_id}/get/buttons/down
  hold
  short
  long
```

Are the endpoints for any ZLLSwitch sensors (Hue Dimmer remote).
The battery and name are retained whilst the buttons are event based.
The buttons have 3 different events.
