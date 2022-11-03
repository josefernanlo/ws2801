'use strict';

const leds = require("rpi-ws2801");

leds.connect(100);

var gamma = [];
for (var i = 0; i < 256; i++) {
    gamma[i] = Math.pow(parseFloat(i) / 255.0, 2.5) * 255.0;
}

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


const writeColor = (hslColor) => {
    leds.fill(hslColor.r, hslColor.g, hslColor.b);
}

/*const updateLed = (color, saturation, brightness) => {
    attemps++;
    if (attemps%2 !== 0) {
        const rgbColor = hslToRgb(color, 100, 50)
        leds.fill(rgbColor[0], rgbColor[1], rgbColor[2]);
        // leds.setChannelPower(100, brightness);
        leds.update();
    }
} 
*/


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
        writeColor(hslToRgb(hue))
        return hue
    }
    
}

module.exports = {
    ledStrip: ledStrip
};