# Thermostat API Contract

This document defines the REST API that must be running on the Raspberry Pi to support the home-sync thermostat UI.

**Base URL (dev):** Proxied via `/api/thermostat` → `http://10.0.0.210` (see `proxy.conf.json`)  
**Base URL (prod):** Configured via `environment.prod.ts` → `thermostatBaseUrl`

---

## Endpoints

### `GET /state`

Returns the current hardware state of the thermostat.

**Response `200 OK`:**
```json
{
  "currentTemp": 71,
  "setpoint": 72,
  "mode": "cool",
  "online": true
}
```

| Field | Type | Description |
|---|---|---|
| `currentTemp` | `number \| null` | Current measured temperature in °F |
| `setpoint` | `number` | Target temperature set by the user (°F) |
| `mode` | `"heat" \| "cool" \| "fan" \| "off"` | Active HVAC mode |
| `online` | `boolean` | Always `true` when this endpoint responds |

---

### `POST /mode`

Sets the HVAC operating mode.

**Request body:**
```json
{ "mode": "cool" }
```

Valid values: `"heat"`, `"cool"`, `"fan"`, `"off"`

**Response `200 OK`:**
```json
{ "ok": true }
```

---

### `POST /setpoint`

Sets the target temperature setpoint.

**Request body:**
```json
{ "setpoint": 72 }
```

Range: `32`–`90` °F

**Response `200 OK`:**
```json
{ "ok": true }
```

---

## Legacy Endpoints (GPIO PHP Scripts)

The following endpoints are used by the current hardware wiring via PHP scripts on the Pi. These will be deprecated once the new REST API is fully wired.

| Endpoint | Action |
|---|---|
| `GET /thermostat_control.php?action=cool_on` | Turn cooling ON |
| `GET /thermostat_control.php?action=cool_off` | Turn cooling OFF |
| `GET /thermostat_control.php?action=heat_on` | Turn heating ON |
| `GET /thermostat_control.php?action=heat_off` | Turn heating OFF |
| `GET /thermostat_control.php?action=fan_on` | Turn fan ON |
| `GET /thermostat_control.php?action=fan_off` | Turn fan OFF |

---

## Pi-Side Implementation Notes

A lightweight REST server must run on the Pi at port 80 (or adjust `proxy.conf.json` target port). Recommended options:

- **Flask (Python):** Simple, runs well on Pi 4. See example below.
- **FastAPI (Python):** Async-friendly with auto docs at `/docs`.
- **Express (Node.js):** If you prefer JavaScript on the Pi.

### Minimal Flask Example

```python
from flask import Flask, request, jsonify
import RPi.GPIO as GPIO

app = Flask(__name__)

# Configure GPIO pins for heat/cool/fan relays
HEAT_PIN = 17
COOL_PIN = 27
FAN_PIN  = 22

GPIO.setmode(GPIO.BCM)
GPIO.setup([HEAT_PIN, COOL_PIN, FAN_PIN], GPIO.OUT, initial=GPIO.LOW)

state = {"currentTemp": None, "setpoint": 72, "mode": "off", "online": True}

@app.route('/state')
def get_state():
    # TODO: read currentTemp from sensor (e.g. DS18B20 1-wire)
    return jsonify(state)

@app.route('/mode', methods=['POST'])
def set_mode():
    mode = request.json.get('mode')
    # Drive GPIO pins based on mode
    GPIO.output(HEAT_PIN, mode == 'heat')
    GPIO.output(COOL_PIN, mode == 'cool')
    GPIO.output(FAN_PIN,  mode in ('heat', 'cool', 'fan'))
    state['mode'] = mode
    return jsonify({'ok': True})

@app.route('/setpoint', methods=['POST'])
def set_setpoint():
    state['setpoint'] = request.json.get('setpoint', 72)
    return jsonify({'ok': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
```

---

## Future: A/C Wall Unit Integration

When the Pi GPIO switches are replaced with a direct A/C wall unit connection, the Pi-side server will need to translate the same REST API calls into the wall unit's protocol (IR blaster, RS-485, or proprietary bus). The Angular app does not need to change — only the Pi-side implementation.
