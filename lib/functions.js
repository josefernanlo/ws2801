'use strict';

const leds = require("rpi-ws2801");
const color = require('onecolor');
const stepsToGo = 70.0;

var ledsColor = color('red');
var lastValue = ledsColor.value();

leds.connect(100);
writeColor(color('black'));

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
    console.log('//////')
    console.log([Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))])
    console.log('//////')
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

function writeColor(newColor) {
    // var r = gamma[Math.trunc(newColor.red()   * 255)];
    // var g = gamma[Math.trunc(newColor.green() * 255)];
    // var b = gamma[Math.trunc(newColor.blue()  * 255)];

    // leds.fill(r, g, b);

    console.log(newColor);
    // console.log(r, g, b);

    hslToRgb(newColor, 50, 50);

}

module.exports = {
    ledStrip: ledStrip
};