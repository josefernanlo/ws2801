'use strict';

// Required to excute Python files
const express = require('express');
const app = express();
const { spawn } = require('child_process');

// Led config



const setPower = (status) => {
    spawn('python', ['functions.py', 1, status]);
    return status
}
const setBrightness = (brightness) => {
    spawn('python', ['functions.py', 2, brightness]);
    return brightness
}
const setHue = (hue) => {
    spawn('python', ['functions.py', 3, hue]);
    return hue
}

const LEDStrip = {
    setPower: setPower,
    setBrightness: setBrightness,
    setHue: setHue
}

module.exports = {
    LightAccessory: LEDStrip
};