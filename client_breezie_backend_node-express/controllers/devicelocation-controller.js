const Devicelocation = require('../model/devicelocation-model');
const Register = require('../model/register-model');
const Employee = require("../model/employee-model");

const jwt = require('jsonwebtoken')
const fs = require('fs');

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}


function deviceToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    // let userId = verifiedUser.userId
    return verifiedUser
}


const getAllDevices = async (req, res, next) => {
    try {
        const deviceData = await Devicelocation.find();
        res.status(200).json({
            error: false,
            message: "all data",
            deviceData
        })
    } catch (err) {
        next(err.message)
    }
}

const getCompanyLocations = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const deviceData = await Devicelocation.find({
            userId
        });
        res.status(200).json({
            error: false,
            message: "all data",
            deviceData
        })
    } catch (err) {
        next(err.message)
    }
}

const getCompanyDevicesDataForDevice = async (req, res, next) => {
    try {

        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        // let company = await Register.findOne({
        //     _id: userId
        // });
        const deviceData = await Devicelocation.findOne({
            _id: locationId,
            userId
        });
        res.status(200).json({
            error: false,
            message: "all data",
            deviceData: deviceData.devices
        })
    } catch (err) {
        next(err.message)
    }
}

const getCompanyDevicesData = async (req, res, next) => {
    try {
        const userId = await getUserToken(req)
        let company = await Register.findOne({
            _id: userId
        });
        const deviceData = await Devicelocation.findOne({
            _id: deviceId
        });
        res.status(200).json({
            error: false,
            message: "all data",
            deviceData
        })
    } catch (err) {
        next(err.message)
    }
}

const addNewLocation = async (req, res, next) => {
    try {
        const {
            officeName,
            address,
            timeZone
        } = req.body;
        const userId = await getUserToken(req)

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var MyDate = new Date();
        var MyString = MyDate.toTimeString();
        var MyOffset = MyString.slice(9, 17);
        var finalTimeZone = timezone + " (" + MyOffset + ")";

        function randomString(length) {
            var chars = '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        var rString = randomString(6);

        const devices = await Devicelocation.insertMany([{
            userId: userId,
            locations: {
                officeName: officeName,
                address: address,
                timeZone: finalTimeZone
            },
            deviceIdentifier: rString,
        }])

        await Register.updateOne({
            _id: userId
        }, {
            $push: {
                deviceAndLocationIds: devices[0]._id
            }
        })
        const User = await Register.findOne({
            userId
        });
        res.status(200).json({
            error: false,
            message: "New Device and Location Added",
            response: devices
        })
    } catch (err) {
        next(err.message)
    }
}

const editLocation = async (req, res, next) => {
    try {
        const {
            officeName,
            address,
            timeZone
        } = req.body;

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var MyDate = new Date();
        var MyString = MyDate.toTimeString();
        var MyOffset = MyString.slice(9, 17);
        var finalTimeZone = timezone + " (" + MyOffset + ")";

        await Devicelocation.updateOne({
            _id: req.params.id
        }, {
            $set: {
                locations: {
                    officeName,
                    address,
                    timeZone: finalTimeZone
                },
            }
        })
        const response1 = await Employee.updateMany({
            locationId: req.params.id
        }, {
            $set: {
                locationName: officeName
            }
        });
        const response = await Devicelocation.findOne({
            _id: req.params.id
        });
        res.status(200).json({
            error: false,
            message: "updated devices",
            response
        })
    } catch (err) {
        next(err.message)
    }
}

const removeLocation = async (req, res, next) => {
    try {
        const userId = await getUserToken(req)
        await Devicelocation.deleteOne({
            _id: req.params.id
        })

        await Register.updateOne({
            _id: userId
        }, {
            $pull: {
                deviceAndLocationIds: req.params.id
            }
        })
        res.json({
            error: false,
            message: 'Location deleted Successfully'
        });
    } catch (err) {
        next(err.message)
    }
}

const resetDeviceIdentifier = async (req, res, next) => {
    try {
        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

        await Devicelocation.updateOne({
            _id: req.params.id
        }, {
            $set: {
                isConnected: false,
                totalDevice: 0,
                deviceIdentifier: rString,
            }
        })

        const response = await Devicelocation.findOne({
            _id: req.params.id
        });

        res.status(200).json({
            error: false,
            message: "Device Identifier Updated",
            response
        })
    } catch (err) {
        next(err.message)
    }
}


const changeDeviceSetting = async (req, res, next) => {
    try {
        const {
            deviceName,
            employeeInandOut,
            visitorInandOut,
            deliveries,
            catering
        } = req.body
        const devices = await Devicelocation.findOne({
            _id: req.params.id
        })
        await Devicelocation.updateOne({
            _id: req.params.id
        }, {
            $set: {
                devices: {
                    deviceName,
                    employeeInandOut,
                    visitorInandOut,
                    deliveries,
                    catering
                }
            }
        })

        const response = await Devicelocation.findOne({
            _id: req.params.id
        });

        res.status(200).json({
            error: false,
            message: "Device Identifier Updated",
            response
        })
    } catch (err) {
        next(err.message)
    }
}


// NEED TO WORK


module.exports = {
    getAllDevices,
    getCompanyDevicesData,
    editLocation,
    removeLocation,
    getCompanyLocations,
    addNewLocation,
    resetDeviceIdentifier,
    changeDeviceSetting,
    getCompanyDevicesDataForDevice
}