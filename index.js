require('node-persist').initSync();
const hap = require("hap-nodejs");

// const uuid = require('hap-nodejs').uuid;
const Accessory = hap.Accessory;
const Service = hap.Service;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;

const accessoryUuid = hap.uuid.generate("light");
const accessory = new Accessory("WS2801", accessoryUuid);

const lightService = new Service.Lightbulb("Example Lightbulb");

let currentLightState = false;
let currentBrightnessLevel = 0;

const onCharacteristic = lightService.getCharacteristic(Characteristic.On);
const brightnessCharacteristic = lightService.getCharacteristic(Characteristic.Brightness);
const colorCharacteristic = lightService.getCharacteristic(Characteristic.Hue);


// ON / OFF characteristic
onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
    callback(undefined, currentLightState);
});

onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("Setting light state to: " + value);
    currentLightState = value;
    callback();
});


// Brightness characteristic
brightnessCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    console.log("Queried current brightness level: " + currentBrightnessLevel);
    callback(undefined, currentBrightnessLevel);
});

brightnessCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    currentBrightnessLevel = value;
    callback();
});


// Color characteristic
colorCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    console.log("Queried current brightness level: " + currentBrightnessLevel);
    callback(undefined, currentBrightnessLevel);
});

colorCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    currentBrightnessLevel = value;
    callback();
});

accessory.addService(lightService);

// Publishing Accesory

const ifaces = require('macaddress').networkInterfaces();

accessory.publish({
    username: ifaces[Object.keys(ifaces)[0]].mac.toUpperCase(),
    pincode: "678-90-876",
    port: 47129,
    category: hap.Categories.LIGHTBULB,
});