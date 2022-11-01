'use strict';

const leds = require("rpi-ws2801");
attemps = 0;
leds.connect(100);

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
 const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
  };

const updateLed = (color, saturation, brightness) => {
    attemps++;
    if (attemps%2 !== 0) {
        const rgbColor = hslToRgb(color, 100, 50)
        leds.fill(rgbColor[0], rgbColor[1], rgbColor[2]);
        // leds.setChannelPower(100, brightness);
        leds.update();
    }
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
        updateLed(hue,1,1)
        return hue
    }
    
}

module.exports = {
    ledStrip: ledStrip
};