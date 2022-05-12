const {
    Delivery,
    genaralDelivery
} = require("../model/delivery.model");
const Register = require('../model/register-model');
const Employee = require("../model/employee-model");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken')

const agreementEmail = path.join(__dirname,"../views/email/email-agreement.html");

const deliveryEmail = path.join(__dirname,"../views/email/email_delivery.html");

const generalDeliveryEmail = path.join( __dirname,"../views/email/email_delivery_general.html");


function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}
const getAllDelivery = async(req, res, next) => {
    try {
        let startDate = req.params.startDate
        let endDate = req.params.endDate
        const userId = await getUserToken(req);
        if (startDate == "All") {
            const delivery = await Delivery.find({
                userId
            }).sort({
                loginTime: -1
            })
            res.status(200).json({
                error: false,
                delivery
            })
        } else {
            let delivery = []
            const visitorData = await Delivery.find({
                userId
            })
            visitorData.forEach((ele, i) => {
                if (new Date(startDate) >= new Date(ele.deliveryTime) && new Date(endDate) <= new Date(ele.deliveryTime)) {
                    delivery.push(ele)
                }
            })
            res.status(200).json({
                error: false,
                delivery
            })
        }
    } catch (err) {
        next(err.message);
    }
};

const getCompanyDelivery = async(req, res, next) => {
    try {
        const userId = await getUserToken(req)
        const delivery = await Delivery.find({
            userId
        });
        res.status(200).json({
            error: false,
            delivery,
        });
    } catch (err) {
        next(err.message);
    }
};

const freeTrial = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        const userId = await getUserToken(req)
        var MyDate = new Date();
        var freeTrialDays = 14;
        var enddate = MyDate.setDate(MyDate.getDate() + freeTrialDays);
        let startDate = new Date(finalDate).toString();
        const endDate = new Date(enddate).toString();
        const userData = await Register.findOne({
            _id: userId
        });
        if (!userData.deliveryAddOn.deliveryFreeTrialUsed) {
            await Register.updateOne({
                _id: userId
            }, {
                $set: {
                    deliveryAddOn: {
                        planName: "FreeTrial",
                        deliveryFreeTrialUsed: true,
                        startDate: startDate,
                        endDate: endDate
                    },
                }
            })
            res.status(200).json({
                error: false,
                message: "Free Trial Activiated"
            });
        } else {
            res.status(401).json({
                error: true,
                message: "You have already used Free Trial"
            });
        }


    } catch (err) {
        next(err.message);
    }
};


const addDelivery = async(req, res, next) => {
    try {
        const {
            empId,
            emailNote,
            deliveryTime,
            signatureRequired
        } = req.body;
        let markAsCollected = false;
        const userId = getUserToken(req)

        const employee = await Employee.findOne({
            _id: empId,
        });
        const FullName = employee.fullName + " " + employee.lastName;
        var template = await fs.readFileSync(deliveryEmail, {
            encoding: "utf-8",
        });
        let dateFormat = new Date(deliveryTime)
        let mth = dateFormat.getMonth() + 1
        let deliveredTime =dateFormat.getDate() +"-" + mth + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
        template = template.replace(new RegExp("(Recipients Name)", "g"),  FullName);
        template = template.replace(new RegExp("(Delivered Time)", "g"),  deliveredTime);
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            service: "gmail",
            auth: {
                user: process.env.Email,
                pass: process.env.Password,
            },
        });
        var mailOptions = {
            from: process.env.Email,
            to: [employee.email],
            subject: "Notified recepient",
            html: template,
        };
        await transporter.sendMail(mailOptions, async(error) => {
            if (error) {
                res.status(404).json({
                    error: false,
                    message: "Can not Send Email"
                });
            } else {
                const addDelivery = await Delivery.insertMany([{
                    empId,
                    recepient: FullName,
                    deliveryTime,
                    signatureRequired,
                    markAsCollected: markAsCollected,
                    Note:emailNote,
                    isGeneral: true,
                    userId
                }, ]);
                const empResp = await Employee.updateOne({
                    _id: empId,
                }, {
                    $push: {
                        deliveryIds: addDelivery[0]._id,
                    },
                }, {
                    upsert: true,
                });
                res.status(200).json({
                    error: false,
                    message: "New delivery added",
                    addDelivery,
                });
            }
        });
    } catch (err) {
        next(err.message);
    }
};



const editDelivery = async(req, res, next) => {
    try {
        const {
            empId,
            emailNote,
            deliveryTime,
            signatureRequired
        } = req.body;
        let markAsCollected = false;
        const userId = getUserToken(req)

        const employee = await Employee.findOne({
            _id: empId,
        });
        const FullName = employee.fullName + " " + employee.lastName;
         var template = await fs.readFileSync(deliveryEmail, {
            encoding: "utf-8",
        });
        
        let dateFormat = new Date(deliveryTime)
        let mth = dateFormat.getMonth() + 1
       let deliveredTime =dateFormat.getDate() +"-" + mth + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
        template = template.replace(new RegExp("(Recipients Name)", "g"),  FullName);
        template = template.replace(new RegExp("(deliveredTime)", "g"),  deliveredTime);
        template = template.replace(new RegExp("(note)", "g"),  emailNote);
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            service: "gmail",
            auth: {
                user: process.env.Email,
                pass: process.env.Password,
            },
        });
        var mailOptions = {
            from: process.env.Email,
            to: [employee.email],
            subject: "Notified recepient",
            html: template,
        };
        await transporter.sendMail(mailOptions, async(error) => {
            if (error) {
            } else {
                await Delivery.updateOne({
                    _id: req.params.id
                }, {
                    empId,
                    recepient: FullName,
                    signatureRequired,
                    markAsCollected: markAsCollected,
                    deliveryTime,
                    Note:emailNote,
                    // collectedTime,
                    isGeneral: true,
                    userId
                });
                const addDelivery = await Delivery.find({
                    _id: req.params.id
                })
                const empResp = await Employee.updateOne({
                    _id: empId,
                }, {
                    $push: {
                        deliveryIds: addDelivery[0]._id,
                    },
                }, {
                    upsert: true,
                });
                res.status(200).json({
                    error: false,
                    message: "Delivery Updated Successfully",
                    addDelivery,
                });
            }
        });
    } catch (err) {
        next(err.message);
    }
};

const markCollected = async(req, res, next) => {
    try {
        const {
            collectedTime
        } = req.body;
        const response = await Delivery.findOne({
            _id: req.params.id,
        });
        let markAsCollected = true;
        await Delivery.updateOne({
            _id: response._id,
        }, {
            $set: {
                collectedTime,
                markAsCollected: markAsCollected
            },
        });
        res.status(200).json({
            error: false,
            message: "Delivery collected time updated successfully",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const notifyRecepient = async(req, res, next) => {
    try {
        const {
            data
        } = req.body;
        const employee = await Employee.findOne({
            _id: req.params.id,
        });
        const deliverytime = await Delivery.findOne({
           _id: data,
        });
      var template = await fs.readFileSync(deliveryEmail, {
            encoding: "utf-8",
        });

        let dateFormat = new Date(deliverytime.deliveryTime)
        let mth = dateFormat.getMonth() + 1
       let deliveryTime =dateFormat.getDate() +"-" + mth + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
        const FullName = employee.fullName + " " + employee.lastName;
        template = template.replace(new RegExp("(Recipients Name)", "g"),  FullName);
        template = template.replace(new RegExp("(deliveredTime)", "g"),  deliveryTime);
        template = template.replace(new RegExp("(note)", "g"),  deliverytime.Note);
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            service: "gmail",
            auth: {
                user: process.env.Email,
                pass: process.env.Password,
            },
        });
        var mailOptions = {
            from: process.env.Email,
            to: [employee.email],
            subject: "Notified recepient",
            html: template,
        };
        await transporter.sendMail(mailOptions, function(error) {
            if (error) {
            } else {
            }
        });
        res.status(200).json({
            error: false,
            message: "Notified",
        });
    } catch (err) {
        next(err.message);
    }
};

const getGeneralData = async(req, res, next) => {
    try {
        const userId = getUserToken(req)
        const generalDeliveryData = await genaralDelivery.find({
            userId
        })
        res.status(200).json({
            error: false,
            message: "General delivery fetched",
            generalDeliveryData
        })
    } catch (err) {
        next(err.message);
    }
}

const generalDeliveryData = async(req, res, next) => {
    try {
        const {
            fullName,
            email,
            phoneNumber
        } = req.body;
        const userId = getUserToken(req)
        const genaral = await genaralDelivery.insertMany({
            fullName,
            email,
            phoneNumber,
            userId: userId,
        })
        res.status(200).json({
            error: false,
            message: "General delivery added",
            genaral
        })

    } catch (err) {
        next(err.message);
    }
}

const deleteDeliveryData = async(req, res, next) => {
    try {
        await genaralDelivery.deleteOne({
            _id: req.params.id
        });
        res.status(200).json({
            error: false,
            message: "General delivery Data deleted"
        })
    } catch (err) {
        next(err.message);
    }
}

const addGeneralDelivery = async(req, res, next) => {
    try {
        const {
            noOfPackages,
            deliveryTime,
            signatureRequired
        } = req.body;
        const userId = getUserToken(req)

        const generalData = await genaralDelivery.find({
            userId: userId
        })
        var generalArray = [];
        generalData.forEach((ele, index) => {
            let sendUser = ele.email
            generalArray.push(sendUser);
        })
        var template = await fs.readFileSync(generalDeliveryEmail, {
            encoding: "utf-8",
        });
        let dateFormat = new Date(deliveryTime)
        let deliveredTime =dateFormat.getDate() +"-" + dateFormat.getMonth() + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
        if (template){
            template = template.replace(new RegExp("(number)", "g"),  noOfPackages);
            template = template.replace(new RegExp("(Delivered Time)", "g"),  deliveredTime);
        }
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            service: "gmail",
            auth: {
                user: process.env.Email,
                pass: process.env.Password,
            },
        });
        var mailOptions = {
            from: process.env.Email,
            to: generalArray,
            subject: "General Delivery",
            html: template,
        };
        await transporter.sendMail(mailOptions, async(error) => {
            if (error) {
            } else {
                const addDelivery = await Delivery.insertMany([{
                    recepient: "General Delivery",
                    deliveryTime,
                    signatureRequired: signatureRequired,
                    noOfPackages: noOfPackages,
                    isGeneral: false,
                    userId
                }, ]);

                res.status(200).json({
                    error: false,
                    message: "New delivery added",
                    addDelivery,
                });
            }
        });
    } catch (err) {
        next(err.message);
    }

};

const getAllDeliveryData = async(req, res, next) =>{
    try {
        const userId = getUserToken(req)
        const generalDeliveryData = await genaralDelivery.find({
            userId
        })
        const employeeData = await Employee.find({
            userId: userId,
            isDeliveryPerson:true,
        });
        const finalResponse = generalDeliveryData.concat(employeeData)
        res.status(200).json({
            error: false,
            finalResponse,
        });
    } catch (err) {
        next(err.message);
    }
}

module.exports = {
    editDelivery,
    getAllDelivery,
    freeTrial,
    addDelivery,
    markCollected,
    notifyRecepient,
    getCompanyDelivery,
    addGeneralDelivery,
    generalDeliveryData,
    getGeneralData,
    deleteDeliveryData,
    getAllDeliveryData
};