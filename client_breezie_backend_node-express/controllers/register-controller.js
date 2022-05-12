const Register = require('../model/register-model');
const Employee = require("../model/employee-model");
const Settings = require('../model/settings.model');
const Screen = require('../model/screens-model');
const Agreement = require('../model/agreement-model');
const Account = require('../model/account-model');
const Branding = require('../model/brand-settings');

const Devicelocation = require('../model/devicelocation-model');
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {
    isArray
} = require('util');

const RegisterEmail = path.join(__dirname, '../views/email/setPassword.html');

// const Aws = require('aws-sdk')

// const s3 = new Aws.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
//     secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET // secretAccessKey is also store in .env file
// })



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

const getAllRegisteredData = async (req, res, next) => {
    try {
        const registeredData = await Register.find();
        if (registeredData) {
            res.status(200).json({
                error: false,
                message: "Registered Successfully",
                registeredData
            })
        } else {
            res.status(404).json({
                error: true,
                message: "No Data Found"
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const getRegisteredData = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const registeredData = await Register.findOne({
            _id: userId
        }, {
            otp: 0,
            password: 0,
            expireTime: 0
        });
        if (registeredData) {
            res.status(200).json({
                error: false,
                registeredData
            })
        } else {
            res.status(404).json({
                error: true,
                message: "No User Found"
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const registerNewUser = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            emailId,
            phone,
            companyName,
            address,
            agreeTerms,
            country
            // isEmailVerified,
            // startDate,
            // endDate
        } = req.body;
        const coun = country.replace('\t', '');
        // country=country.replace('\t','');
        const User = await Register.findOne({
            emailId
        });
        if (!User) {
            var template = await fs.readFileSync(RegisterEmail, {
                encoding: 'utf-8'
            });
            if (template) {
                const regz = `<a style="text-align:center; margin-bottom: 90px;"  target="_blank">Click Here</a>
                 href="https://secure.breazie.com/auth/register-password?trigger=AdminCreateUser&emailId=${emailId}&companyName=${companyName}&dest=freetrial"`
                template = template.replace(new RegExp("(linkHere)", "g"), regz);
            }
            let capitilizeFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
            let capitilizeLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                service: 'gmail',
                auth: {
                    user: process.env.Email,
                    pass: process.env.Password
                }
            });
            var mailOptions = {
                from: process.env.Email,
                to: [emailId],
                subject: 'User Registered Successfull',
                html: template
                // <a style="text-align:center; margin-bottom: 90px;" href="http://localhost:4200/auth/register-thankyou " target="_blank">Click Here</a>
            };
            await transporter.sendMail(mailOptions, async (error) => {
                if (error) {
                } else {
                    const response = await Register.insertMany([{
                        firstName: capitilizeFirstName,
                        lastName: capitilizeLastName,
                        emailId,
                        phone,
                        companyName,
                        address,
                        agreeTerms,
                        country: coun
                        // isEmailVerified,
                        // freeTrial: {
                        //     startDate,
                        //     endDate
                        // },
                    }]);
                    res.status(200).json({
                        error: false,
                        message: "Registered Successfully",
                        response
                    })
                }
            });
        } else {
            res.status(402).json({
                error: true,
                message: "User Already Exist"
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const addPasswordAndDefaults = async (req, res, next) => {
    try {
        const {
            password,
            emailId
        } = req.body;
        // const userObjectId = req.params.id
        const User = await Register.findOne({
            emailId: emailId
        });
        const userObjectId = User._id
        if (User) {
            if (password) {
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                var todayDate = new Date();
                var MyDate = new Date();
                var freeTrialDays = 14;
                var enddate = MyDate.setDate(MyDate.getDate() + freeTrialDays);
                const endDate = new Date(enddate).toString();
                var MyString = MyDate.toTimeString();
                var MyOffset = MyString.slice(9, 17);
                var finalTimeZone = timezone + " (" + MyOffset + ")";

                function randomString(length, chars) {
                    var result = '';
                    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                    return result;
                }
                var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

                // Decrypt Password
                const salt = bcrypt.genSaltSync(10);
                const encryptedPassword = bcrypt.hashSync(password, salt)

                // Add Default Settings
                const setting = await Settings.insertMany({
                    userId: userObjectId
                });

                //add default screens
                let arr = [
                    "https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/default/Screen9837",
                    "https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/default/Screen1701",
                    "https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/default/Screen1194",
                    "https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/default/Screen9928",
                    "https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/default/Screen3585"
                ]
                // const Screen = await Screen.insertMany({
                //     userId: userObjectId
                // });
                for (let i = 0; i < arr.length; i++) {
                    if (i == 0) {
                        await Screen.insertMany([{
                            imagePath: arr[i],
                            userId: userObjectId,
                            selected: true,
                            hidden: false,
                        }]);
                    } else {
                        await Screen.insertMany([{
                            imagePath: arr[i],
                            userId: userObjectId,
                            selected: false,
                            hidden: false,
                        }]);
                    }
                }
                //branding
                let brandData = await Branding.insertMany([{
                    userId: userObjectId,
                    companyLogo: 'https://breezie-prod-files.s3.ap-south-1.amazonaws.com/images/employee/Mask+Group+1@2x.png',
                    idBadge: "Id Badge",
                    email: false,
                    contactless: false
                }]);

                // Add Device Default
                const devices = await Devicelocation.insertMany([{
                    userId: userObjectId,
                    locations: {
                        officeName: "Head Office",
                        address: User.address,
                        timeZone: finalTimeZone
                    },
                    deviceIdentifier: rString
                }])

                const account = await Account.insertMany([{
                    userId: userObjectId,
                    settings: {
                        accountDetails: {
                            accountName: User.companyName,
                        },
                    }
                }])

                const newAgreement = await Agreement.insertMany([{
                    userId: userObjectId,
                    isSelected: true,
                    agreementName: "Agreement",
                    agreementData: "<h2>Welcome To Our Workplace </h2><p>Visitors are welcome to visit during hours of operations. For your safety and security we have the following guidelines:</p><ul><li>All visitors agree to follow the site rules before entry is permitted into the building.</li><li>All visitors must sign in and out through the main entrance.</li><li>All visitors are required to read and acknowledge the Non-Disclosure and Waiver Agreement below.</li><li>Smoking and tobacco use is prohibited in our facility.</li><li>Firearms or other weapons are prohibited in our facility.</li></ul><h2>Visitors Non-Disclosure and Waiver Agreement</h2><p>During my visit to your facility, I may learn or have disclosed to me proprietary or confidential information (including, without limitations, information relating to technology, trade secrets, processes, materials, equipment, drawings, specifications, prototypes and products) and may receive samples of products not generally known to the public.</p><p>I agree that I will not, without your written permission or that of your authorized representative:</p><ul><li>Disclose or otherwise make available to others any confidential information disclosed to me during this and any subsequent visit that was not known to me or my organization prior to disclosure by you, or is not now or subsequently becomes a part of the public domain as aresult of publication or otherwise.</li><li>Use or assist others in using or further developing in any manner any confidential information.</li><li>Use cameras or video technology to disclose confidential information.</li></ul><p>I agree to conform to any applicable safety requirements, which are brought to my attention by any employee or by signs posted in the areas that I visit while on the premises, and to observe other reasonable safety precautions.</p>",
                }])

                await Register.updateOne({
                    _id: userObjectId
                }, {
                    $set: {
                        password: encryptedPassword,
                        isEmailVerified: true,
                        plan: {
                            planName: "FreeTrial",
                            freeTrialUsed: true,
                            startDate: todayDate,
                            endDate: endDate
                        },

                        // freeTrial: {
                        //     activate: true,
                        //     startDate: todayDate,
                        //     endDate: endDate
                        // },
                        settingId: setting[0]._id,
                        // screensId:Screen[0]._id,
                        deviceAndLocationIds: [devices[0]._id],
                        agreementId: [newAgreement[0]._id],
                        accountId: account[0]._id
                    }
                })

                // Add defaults and setting ID's
                const response = await Register.findOne({
                    _id: userObjectId
                });

                const employeeData = await Employee.insertMany([{
                    userId: userObjectId,
                    fullName: response.firstName,
                    lastName: response.lastName,
                    email: response.emailId,
                    phone: response.phone,
                    locationId: devices[0]._id,
                    locationName: devices[0].locations.officeName,
                    isRemoteUser: true,
                    password: encryptedPassword,
                    role: "Admin",
                    acceess:true,
                    defaultAdmin: true,
                    lastActivity: {
                        recent: null,
                        time: null,
                    }
                }, ]);

                res.status(200).json({
                    error: false,
                    message: "Details Updated Successfully",
                    response
                })
            } else {
                res.status(402).json({
                    error: true,
                    message: "Password Does Not Matches"
                })
            }
        } else {
            res.status(402).json({
                error: true,
                message: "User Not Found"
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const login = async (req, res, next) => {
    try {
        const {
            emailId,
            password
        } = req.body;
        const employee = await Employee.findOne({
            email: emailId
        });
        if (employee!==null) {
            const admin = await Register.findOne({
                _id: employee.userId
            });
            let companyName = admin.companyName
            if (employee.password !== undefined) {
                if (bcrypt.compareSync(password, employee.password)) {
                    const payload = {
                        emailId: employee.email,
                        userId: employee.userId
                    }
                    const token = jwt.sign(payload, process.env.jwtSecret);
                    res.status(200).json({
                        error: false,
                        message: 'Login Successfull',
                        token,
                        employee,
                        companyName
                    })
                } else {
                    res.status(400).json({
                        error: true,
                        message: 'Invalid Password or Username'
                    })
                }
            } else {
                res.status(400).json({
                    error: true,
                    message: 'Admin Not Found'
                })
            }
        }else {
            res.status(400).json({
                error: true,
                message: 'Admin Not Found'
            })
        }
    } catch (err) {
        next(err.message)
    }
}


const deviceLogin = async (req, res, next) => {
    try {
        const {
            deviceId
        } = req.body;
        const device = await Devicelocation.findOne({
            deviceIdentifier: deviceId
        });

        if (device) {
            const register = await Register.findOne({
                _id: device.userId
            })
            const a = register.plan.planName
            const totalDev = device.totalDevice
            const payload = {
                locationId: device._id,
                userId: device.userId
            }
            if ((a == "Business Plan (per location)") || (a == "Enterprise Plan (per location)")) {
                const token = jwt.sign(payload, process.env.jwtSecret);
                await Devicelocation.updateOne({
                    deviceIdentifier: deviceId
                }, {
                    $set: {
                        totalDevice: totalDev + 1,
                        isConnected: true
                    }
                })
                const deviceLocation = await Devicelocation.findOne({
                    userId: register._id
                })

                res.status(200).json({
                    error: false,
                    message: "Device connected successfully",
                    response: register,
                    token,
                    locationId: device._id,
                    userId: device.userId
                })
            } else {
                if (!device.isConnected || totalDev == 0) {
                    // const register = await Register.findOne({
                    //     _id: device.userId
                    // })
                    const payload = {
                        locationId: device._id,
                        userId: device.userId
                    }
                    const token = jwt.sign(payload, process.env.jwtSecret);
                    await Devicelocation.updateOne({
                        deviceIdentifier: deviceId
                    }, {
                        $set: {
                            totalDevice: totalDev + 1,
                            isConnected: true
                        }
                    })
                    const deviceLocation = await Devicelocation.findOne({
                        userId: register._id
                    })

                    res.status(200).json({
                        error: false,
                        message: "Device connected successfully",
                        deviceLocation,
                        response: register,
                        token,
                        locationId: device._id,
                        userId: device.userId
                    })
                } else {
                    res.status(400).json({
                        error: true,
                        message: 'Device Already Connected'
                    })
                }
            }
        } else {
            res.status(400).json({
                error: true,
                message: 'Device Not Found'
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const deviceLogOut = async (req, res, next) => {
    try {
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const device = await Devicelocation.findOne({
            _id: locationId,
            userId
        });
        if (device) {
            const totalDev = device.totalDevice
            await Devicelocation.updateOne({
                _id: locationId,
                userId
            }, {
                $set: {
                    totalDevice: totalDev - 1,
                    isConnected: false
                }
            })
            const deviceLocation = await Devicelocation.findOne({
                userId: userId
            })
            res.status(200).json({
                error: false,
                // response: register,
                deviceLocation,
                message: "Logout Successful"
            })
        } else {
            res.status(400).json({
                error: true,
                message: 'Device Not Found'
            })
        }
    } catch (err) {
        next(err.message)
    }
}


const checkDevice = async (req, res, next) => {
    try {
        const {
            deviceId
        } = req.body;
        const device = await Devicelocation.findOne({
            deviceIdentifier: deviceId
        });
        if (device) {
            res.status(200).json({
                error: false,
                message: "Device connected successfully",
            })
        } else {
            res.status(400).json({
                error: true,
                message: 'Device Not Found'
            })
        }
    } catch (err) {
        next(err.message)
    }
}

module.exports = {
    getAllRegisteredData,
    getRegisteredData,
    registerNewUser,
    addPasswordAndDefaults,
    login,
    deviceLogin,
    deviceLogOut,
    checkDevice
}