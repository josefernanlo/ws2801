require('node-persist').initSync();
const hap = require("hap-nodejs");
import {setBrightness, setHue, setPower, setSaturation, init} from './lib/functions.js'

// Required to excute Python files
const express = require('express');
const app = express();
const { spawn } = require('child_process');

init();


const Accessory = hap.Accessory;
const Service = hap.Service;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;

const accessoryUuid = hap.uuid.generate("light");
const accessory = new Accessory("WS2801", accessoryUuid);

const lightService = new Service.Lightbulb("Example Lightbulb");

let currentLightState = false;
let currentBrightnessLevel = 0;
let currentColor = 0;
let currentSaturation = 0;

const onCharacteristic = lightService.getCharacteristic(Characteristic.On);
const brightnessCharacteristic = lightService.getCharacteristic(Characteristic.Brightness);
const colorCharacteristic = lightService.getCharacteristic(Characteristic.Hue);
const saturationCharacteristic = lightService.getCharacteristic(Characteristic.Saturation);


// ON / OFF characteristic
onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
    callback(undefined, currentLightState);
});

onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    currentLightState = setPower(value);
    callback();
});


// Brightness characteristic
brightnessCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    console.log("Queried current brightness level: " + currentBrightnessLevel);
    callback(undefined, currentBrightnessLevel);
});

brightnessCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log('Brigthness' + value)
    currentBrightnessLevel = setBrightness(value);
    callback();
});


// Color characteristic
colorCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    callback(undefined, currentColor);
});

colorCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log('Color' + value);
    currentColor = setHue(value);
    callback();
});

// Saturation Characteristic
saturationCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    callback(undefined, currentSaturation);
});

saturationCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log('Saturation' + value);
    currentSaturation = setSaturation(value);
    callback();
});

// Publishing Accesory

const ifaces = require('macaddress').networkInterfaces();
accessory.addService(lightService);

accessory.publish({
    username: ifaces[Object.keys(ifaces)[0]].mac.toUpperCase(),
    pincode: "678-90-876",
    port: 47129,
    category: hap.Categories.LIGHTBULB,
});