const { numLEDs } = require("rpi-ws2801");
const leds = require("rpi-ws2801");
const numLeds = 100;

leds.connect(numLeds);

let actualHue = 0;
let actualBrigthness = 0;
let actualSaturation = 100;

const steps = 60;

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

const writeColor = async (hslColor = actualHue, saturation = actualSaturation, brightness = actualBrigthness ) => {
    // Differences between actual color and desired color
    const colorPerStep = (actualHue - hslColor) / steps;
    const saturationPerStep = (actualSaturation - saturation)/ steps;
    const brightnessPerStep = (actualBrigthness - brightness )/ steps;

    let rgbColor = 0;
    // Do the transtion
    for (step = 0; step < steps;step++) {
        rgbColor = hslToRgb(actualHue + colorPerStep * step, actualSaturation + saturationPerStep * step, 50);
        leds.fill(rgbColor.r, rgbColor.g, rgbColor.b);
        await timer(1)
    }

    // 
    const finalRgbColor = hslToRgb(hslColor, 50, 50);
    leds.fill(finalRgbColor.r, finalRgbColor.g, finalRgbColor.b);
    actualHue = hslColor
}

const setBrightness = async (brightness) => {

}

const onOff = async (onoff) => {
    const color = onoff ? [255, 255, 255] : [0,0,0]
    for (step = 0; step < numLEDs; step++){
        const direction = onoff ? step : numLEDs - step
        leds.setColor(direction, color);
        leds.update();
        await timer(1)
    }
}

const ledStrip = {
    setPower: function setPower(status) {
        onOff(status);
        return status
    },
    setBrightness: function setBrightness(brightness) {
        setBrightness()
        return brightness
    },
    setSaturation: function setSaturation(saturation){
        writeColor(undefined, saturation);
        return saturation
    },
    setHue: function setHue(hue){
        writeColor(hue);
        return hue
    } 
}

module.exports = {
    ledStrip: ledStrip
};