const leds = require("rpi-ws2801");
const numLeds = 100;

leds.connect(numLeds);

let actualHue = 0;
let actualBrigthness = 0;
let actualSaturation = 100;

const steps = 60;

let doingSomething = false;
const queue = [];
const currentLedStrip = [];

const priority = {
    brightness : 2,
    onOff : 1,
    color: 0
}

for (i = 0; i <= 0;i++) {
    currentLedStrip[i] = {
        brightness: 0,
        colorRGB: [0,0,0],
        delay: 0,
    }
}

/* HELPERS */
const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(255 * f(0)),
             g: Math.round(255 * f(8)), 
             b: Math.round(255 * f(4))};
  };

const timer = ms => new Promise(r => setTimeout(r, ms));


/* FUNCTIONS*/

const _writeColor = async (hslColor = actualHue, saturation = actualSaturation, brightness = actualBrigthness ) => {
    doingSomething = priority.color;
    // Differences between actual color and desired color
    const colorPerStep = (actualHue - hslColor) / steps;
    const saturationPerStep = (actualSaturation - saturation)/ steps;
    const brightnessPerStep = (actualBrigthness - brightness )/ steps;

    let rgbColor = 0;
    // Do the transition
    for (step = 0; step < steps;step++) {
        rgbColor = hslToRgb(actualHue + colorPerStep * step, actualSaturation + saturationPerStep * step, 50);
        leds.fill(rgbColor.r, rgbColor.g, rgbColor.b);
        await timer(3)
    }

    const finalRgbColor = hslToRgb(hslColor, 50, 50);
    leds.fill(finalRgbColor.r, finalRgbColor.g, finalRgbColor.b);
    actualHue = hslColor;
    doingSomething = false;
}

const _setBrightnes = async (brightness) => {
    doingSomething = priority.brightness;
    for (i = 0; i < numLeds*3; i++){
        leds.setChannelPower(i, brightness);
    }
    leds.update();
    doingSomething = false;
}

const _onOff = async (onoff) => {
    doingSomething = priority.onOff
    const color = onoff ? [255, 255, 255] : [0,0,0]
    for (step = 0; step <= numLeds; step++){
        const direction = onoff ? step : numLeds - step
        leds.setColor(direction, color);
        leds.update();
        await timer(3)
    }
    doingSomething = false;
}

/* Cosas */

const actions = {
    brightness : _setBrightnes,
    onoff: _onOff,
    color: _writeColor,
}

const verifyPriority = ({actionId, data}) => {
    if (Number.isInteger(doingSomething)) {
        // Algo se está ejecutando
        if (priority[actionId] > doingSomething) {
            doingSomething = priority[actionId];
            return true;
        } else if (priority[actionId] === doingSomething) {
            queue.push({actionId, data})
            return true;
        }
        return false;
    } 
    doingSomething = priority[actionId];
    return true;
}

const doAction = ({actionId, data}) => {
    if (queue[0] !== undefined) {
        // si hay algo en la cola, primero realizamos lo de la cola,
        // eliminamos lo que acabamos de ejecutar en la cola
        // llamamos de nuevo a la misma funcion con la acción a realizar
        actions[queue[0].actionId](queue[0].data);
        actions.shift()
        doAction({actionId, data});
    }

    if (verifyPriority({actionId, data})) {
        console.log(actions)
        con
        actions[actionId](data)
        return true
    }
    return false
}

/* EXPORT */

const ledStrip = {
    setPower: function setPower(status) {
        doAction({actionId : 'onOff', data: status});
        return status
    },
    setBrightness: function setBrightness(brightness) {
        doAction({actionId: 'brightness', data: brightness/100});
        return brightness
    },
    setSaturation: function setSaturation(saturation){
        // writeColor(undefined, saturation);
        return saturation
    },
    setHue: function setHue(hue){
        doAction({actionId: 'color', data: hue});
        return hue
    } 
}

module.exports = {
    ledStrip: ledStrip
};