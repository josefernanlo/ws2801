require('node-persist').initSync();

const hap = require("hap-nodejs");
const ledFunctions = require("./lib/functions").ledStrip;


const Accessory = hap.Accessory;
const Service = hap.Service;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;

const accessoryUuid = hap.uuid.generate("light");
const accessory = new Accessory("WS2801", accessoryUuid);

const lightService = new Service.Lightbulb("Example Lightbulb");

const onCharacteristic = lightService.getCharacteristic(Characteristic.On);
const brightnessCharacteristic = lightService.getCharacteristic(Characteristic.Brightness);
const colorCharacteristic = lightService.getCharacteristic(Characteristic.Hue);
const saturationCharacteristic = lightService.getCharacteristic(Characteristic.Saturation);


// ON / OFF characteristic
onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
    callback(null, ledFunctions.getPower());
});

onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    ledFunctions.setPower(value);
    callback();
});


// Brightness characteristic
brightnessCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    callback(null, ledFunctions.getBrightness());
});

brightnessCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    ledFunctions.setBrightness(value);
    callback();
});


// Color characteristic
colorCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    callback(null, ledFunctions.getSaturation());
});

colorCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    ledFunctions.setSaturation(value);
    callback();
});

// Saturation Characteristic
saturationCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    callback(null, ledFunctions.getSaturation());
});

saturationCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    ledFunctions.setSaturation(value);
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