import {
	AccessoryConfig,
	AccessoryPlugin,
	API,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	HAP,
	HAPStatus,
	Logging,
	Service
} from "homebridge";

var miio = require('miio');
var devices = [];

let hap: HAP;

export = (api: API) => {
	hap = api.hap;
	api.registerAccessory("ChuangmiPlug", ChuangmiPlugAccessory);
};

class ChuangmiPlugAccessory implements AccessoryPlugin {
	private readonly name: string;
	private readonly ip: string;
	private readonly token: string;
	private readonly powername: string;
	private readonly usbname: string;

	private device: any;

	private readonly poweroutletService: Service;
	private readonly usbswitchService: Service;
	private readonly informationService: Service;

	constructor(private log: Logging, private config: AccessoryConfig, api: API) {
		this.name = "ChuangmiPlug"
		this.ip = config.ip;
		this.token = config.token;
		this.powername = config.powername;
		this.usbname = config.usbname;

		this.informationService = new hap.Service.AccessoryInformation()
			.setCharacteristic(hap.Characteristic.Manufacturer, config.manufacturer || "Xiaomi")
			.setCharacteristic(hap.Characteristic.Model, config.model || "chuangmi.plug.hmi208");

		this.poweroutletService = new hap.Service.Outlet(this.powername);
		this.poweroutletService.getCharacteristic(hap.Characteristic.On)
			.on('get', this.getPowerHandler.bind(this))
			.on('set', this.setPowerHandler.bind(this));

		this.usbswitchService = new hap.Service.Switch(this.usbname);
		this.usbswitchService.getCharacteristic(hap.Characteristic.On)
			.on('get', this.getUSBHandler.bind(this))
			.on('set', this.setUSBHandler.bind(this));

		this.log.info("Initialization finished");

		miio.device({ address: this.ip, token: this.token })
			.then(device => {
				this.device = device;
			})
			.catch(err => {
				this.log.error("ERROR: ", err);
			});

	}

	getServices(): Service[] {
		return [
			this.informationService,
			this.poweroutletService,
			this.usbswitchService
		];
	}


	async getPowerHandler(callback: CharacteristicGetCallback) {
		this.device.call("get_prop", ["power"])
			.then(result => {
				this.log.debug("getPower: " + result);
				if (result[0] === "off") callback(null, false);
				if (result[0] === "on") callback(null, true);
			}).catch(err => {
				this.log.error("getPower Error: " + err);
				callback(err);
			});
	}

	async setPowerHandler(value: CharacteristicValue, callback: CharacteristicSetCallback) {
		const pmessage = value ? "on" : "off";
		this.device.call("set_power", [pmessage])
			.then(result => {
				this.log.debug("setPower Result: " + result);
				callback(null);
			}).catch(err => {
				this.log.error("setPower Error: " + err);
				callback(err);
			});
	}


	async getUSBHandler(callback: CharacteristicGetCallback) {
		this.device.call("get_prop", ["usb_on"])
			.then(result => {
				this.log.debug("getUSB: " + result);
				callback(null, result[0]);
			}).catch(err => {
				this.log.error("getUSB Error: " + err);
				callback(err);
			});
	}
	
	async setUSBHandler(value: CharacteristicValue, callback: CharacteristicSetCallback) {
		const umessage = value ? "set_usb_on" : "set_usb_off";		
		this.device.call(umessage, [])
			.then(result => {
				this.log.debug("setUSB Result: " + result);
				callback(null);
			}).catch(err => {
				this.log.error("setUSB Error: " + err);
				callback(err);
			});
	}

}
