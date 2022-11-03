const leds = require("rpi-ws2801");

leds.connect(100);

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

const writeColor = async (hslColor) => {
    const colorPerStep = (actualHue - hslColor) / steps;
    let rgbColor = 0;
    for (step = 0; step < steps;step++) {
        rgbColor = hslToRgb(actualHue + colorPerStep * step, 50, 50);
        leds.fill(rgbColor.r, rgbColor.g, rgbColor.b);
        await timer(10)
    }
    const finalRgbColor = hslToRgb(hslColor, 50, 50);
    leds.fill(finalRgbColor.r, finalRgbColor.g, finalRgbColor.b);
    actualHue = hslColor
}

const ledStrip = {
    setPower: function setPower(status) {
        status ? updateLed(0,1,1) : updateLed(0,0,0)
        return status
    },
    setBrightness: function setBrightness(brightness) {
        updateLed(0,1,brightness/100)
        return brightness
    },
    setSaturation: function setSaturation(saturation){
        updateLed(0,saturation,1)
        return saturation
    },
    setHue: function setHue(hue){
        writeColor(hue)
        return hue
    } 
}

module.exports = {
    ledStrip: ledStrip
};