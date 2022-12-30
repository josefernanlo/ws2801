'use strict';

const leds = require("rpi-ws2801");
const color = require('onecolor');

//  leds/meter * meters of leds
const numLeds = 32 * 26;
const stepsToGo = 10;

let gamma = [];
for (let i = 0; i < 256; i++) {
    gamma[i] = Math.pow(parseFloat(i) / 255.0, 2.5) * 255.0;
}

leds.connect(numLeds);
writeColor(color('black'));

var timerIdH = null;
var timerIdS = null;
var timerIdV = null;

var ledsColor = color('red');
var lastValue = ledsColor.value();

ledsColor = ledsColor.value(100);


function setNextColorValue(value, callback) {
    terminateTimerEvent(timerIdV);

    var steps = stepsToGo;
    var step = (value - ledsColor.value()) / steps;

    timerIdV = setInterval(function () {
        writeColor(ledsColor);
        if (--steps <= 0) {
            ledsColor = ledsColor.value(value);
            writeColor(ledsColor);
            terminateTimerEvent(timerIdV);
            if (callback != null)
            callback();
        }
        ledsColor = ledsColor.value(ledsColor.value() + step);
    }, 1);
}

function setNextColorHue(hue, callback) {
    terminateTimerEvent(timerIdH);

    var steps = stepsToGo;
    var step = 0;
    var reversed = Math.abs(hue - ledsColor.hue()) > 0.5;
    if (reversed == false)
    step = (hue - ledsColor.hue()) / steps;
    else if (hue < ledsColor.hue())
    step = (1.0 - ledsColor.hue() + hue) / steps;
    else
    step = (1.0 - hue + ledsColor.hue()) / steps * -1.0;

    timerIdH = setInterval(function () {
        writeColor(ledsColor);
        if (--steps <= 0) {
            ledsColor = ledsColor.hue(hue);
            writeColor(ledsColor);
            terminateTimerEvent(timerIdH);
            if (callback != null)
            callback();
        }
        var nextHue = ledsColor.hue() + step;
        ledsColor = ledsColor.hue(nextHue);
    }, 1);
}

function setNextColorSaturation(saturation, callback) {
    terminateTimerEvent(timerIdS);

    var steps = stepsToGo;
    var step = (saturation - ledsColor.saturation()) / steps;

    timerIdS = setInterval(function () {
        writeColor(ledsColor);
        if (--steps <= 0) {
            ledsColor = ledsColor.saturation(saturation);
            writeColor(ledsColor);
            terminateTimerEvent(timerIdS);
            if (callback != null)
            callback();
        }
        ledsColor = ledsColor.saturation(ledsColor.saturation() + step);
    }, 1);
}

function terminateTimerEvent(id) {
    if (id != null) clearInterval(id);
    id = null;
}

function writeColor(newColor) {
    var r = gamma[Math.trunc(newColor.red()   * 255)];
    var g = gamma[Math.trunc(newColor.green() * 255)];
    var b = gamma[Math.trunc(newColor.blue()  * 255)];

    leds.fill(r, g, b);
}

const timer = ms => new Promise(r => setTimeout(r, ms));


const onOff = async (onoff) => {
    const color = onoff ? [255, 255, 255] : [0,0,0]
    leds.fill(color[0], color[1], color[2]);
}

const ledStrip = {
    setPower: (status) =>  {
        console.log("Power")
        this.power = status;
        if (status == false) {
            lastValue = ledsColor.value();
        } 
        onOff(status);
        return status
    },

    getPower: () => {
        return this.power ? true : false;
    },

    setBrightness: (brightness) => {
        console.log("Brightness")
        setNextColorValue(brightness/100.0);
        return brightness
    },

    getBrightness: () =>  {
        return ledsColor.value() * 100;
    },
    setSaturation: (saturation) => {
        console.log("saturation");
        setNextColorSaturation(saturation/100.0);
        return saturation
    },
    getSaturation: () =>  {
        return ledsColor.hue() * 360;
    },
    setSaturation: (hue) => {
        setNextColorHue(hue/360.0);
        return hue
    } 
}

module.exports = {
    ledStrip: ledStrip
};