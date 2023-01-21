# homebridge-chuangmi-plug

**This plugin supports only chuangmi.plug.hmi208 (米家智能插座蓝牙网关版)**

chuangmi.plug.hmi208 has one socket and two USB swtiches. 

It was released in 2019 and uses the **old** and **deprecated** **Miio** protocol, whose successor is the **MIoT** protocol. 

Homebridge-miot can only control chuangmi.plug.hmi208 via the **cloud**, but this plugin can control it **locally**. 

If you want to port this plugin to other chuangmi plug, please read [miio2miot.py](https://github.com/al-one/hass-xiaomi-miot/blob/master/custom_components/xiaomi_miot/core/miio2miot_specs.py) to see different parameters used by chuangmi plug.

Remember to install homebridge@1.5.1 to avoid this [problem](https://github.com/homebridge/HAP-NodeJS/issues/998)

## raw_command
**You see the goddamn chaos of logic.**

| raw_command | Power                | USB                   |
|-------------|----------------------|-----------------------|
| get         | get_prop '["power"]' | get_prop '["usb_on"]' |
| get_on      | on                   | True                  |
| get_off     | off                  | False                 |
| set_on      | set_power '["on"]'   | set_usb_on            |
| set_off     | set_power '["off"]'  | set_usb_off           |

## Thanks
https://github.com/szaboge/homebridge-mi-smart-plug

https://github.com/YinHangCode/homebridge-mi-outlet

https://github.com/kondratk/homebridge-mi-air-purifier
