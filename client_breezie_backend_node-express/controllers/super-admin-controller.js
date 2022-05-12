const SuperAdmin = require('../model/super-admin-model');
const Register = require('../model/register-model');
const Account = require("../model/account-model");
// const bcrypt = require('bcrypt');
const Devicelocation = require('../model/devicelocation-model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const adminRegisterEmail = path.join(__dirname, '../views/email/email-admin-register.html');
const adminForgotOtp = path.join(__dirname, '../views/email/email-otp.html');
const {
    plansandpricing
} = require("../model/plansandpricing-model");

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}


const registerSuperAdmin = async (req, res, next) => {
    try {
        const {
            name,
            emailId,
            phone,
            password
        } = req.body;
        const User = await SuperAdmin.findOne({
            emailId
        });

        let capitilizeFullName = name.charAt(0).toUpperCase() + name.slice(1);
        if (!User) {
            const salt = bcrypt.genSaltSync(10);
            const encryptedPassword = bcrypt.hashSync(password, salt)
            const response = await SuperAdmin.insertMany([{
                name: capitilizeFullName,
                emailId,
                phone,
                password: encryptedPassword
            }]);
            res.status(200).json({
                error: false,
                message: "Registered Successful",
                response
            })
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


const forgotPassword = async (req, res, next) => {
    try {
        const {
            emailId
        } = req.body
        const admin = await Register.findOne({
            emailId: emailId
        })
        if (admin) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            var d1 = new Date();
            await Register.updateOne({
                emailId: emailId
            }, {
                $set: {
                    otp: otp,
                    expireTime: d1.getTime()
                }
            })
            var template = await fs.readFileSync(adminForgotOtp, {
                encoding: 'utf-8'
            });
            if (template) {
                template = template.replace(new RegExp("(OTP_HERE)", "g"), otp);
            }
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
                subject: 'Verification Code for Password change',
                html: template
            };
            await transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    next(error.message)
                } else {
                    res.status(200).json({
                        error: false,
                        message: "Mail sent successfully"
                    });
                }
            });
            res.status(200).json({
                error: false,
                message: 'OTP has been sent to your Email Id'
            })
        } else {
            res.status(400).json({
                error: true,
                message: 'No user found in this Email Id'
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const loginSuperAdmin = async (req, res, next) => {
    try {
        const {
            emailId,
            password
        } = req.body;
        const superAdmin = await SuperAdmin.findOne({
            emailId
        });
        if (superAdmin) {
            if (bcrypt.compareSync(password, superAdmin.password)) {
                const otp = Math.floor(100000 + Math.random() * 900000);
                var d1 = new Date();
                await SuperAdmin.updateOne({
                    emailId: emailId
                }, {
                    $set: {
                        otp: otp,
                        expireTime: d1.getTime()
                    }
                })
                var template = await fs.readFileSync(adminForgotOtp, {
                    encoding: 'utf-8'
                });
                if (template) {
                    template = template.replace(new RegExp("(OTP_HERE)", "g"), otp);
                }
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
                    subject: 'Verification Code for Password change',
                    html: template
                };
                await transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        next(error.message)
                    } else {
                        res.status(200).json({
                            error: false,
                            message: "OTP has been sent to your mail Id"
                        });
                    }
                });
                // res.status(200).json({
                //     error: false,
                //     message: 'Login Successfull',
                //     token,
                //     response: superAdmin
                // })
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
    } catch (err) {
        next(err.message)
    }
}

const superAdminLogin = async (req, res, next) => {
    try {
        const {
            emailId,
            password
        } = req.body;
        const superAdmin = await SuperAdmin.findOne({
            emailId
        });
        if (superAdmin) {
            if (password === superAdmin.password) {
                const otp = Math.floor(100000 + Math.random() * 900000);
                var d1 = new Date();
                await SuperAdmin.updateOne({
                    emailId: emailId
                }, {
                    $set: {
                        otp: otp,
                        expireTime: d1.getTime()
                    }
                })
                var template = await fs.readFileSync(adminForgotOtp, {
                    encoding: 'utf-8'
                });
                if (template) {
                    template = template.replace(new RegExp("(OTP_HERE)", "g"), otp);
                }
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
                    subject: 'Verification Code for Password change',
                    html: template
                };
                await transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        next(error.message)
                    } else {
                        res.status(200).json({
                            error: false,
                            message: "OTP has been sent to your mail Id"
                        });
                    }
                });
                // res.status(200).json({
                //     error: false,
                //     message: 'Login Successfull',
                //     token,
                //     response: superAdmin
                // })
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
    } catch (err) {
        next(err.message)
    }
}


const checkOtp = async (req, res, next) => {
    try {
        const {
            emailId,
            otp
        } = req.body
        const admin = await SuperAdmin.findOne({
            emailId: emailId
        })
        const convertOtp = parseInt(otp)
        var d1 = new Date();
        var d2 = d1.getTime()
        if (d2 < (admin.expireTime + 600000)) {
            if (admin.otp === convertOtp) {
                await SuperAdmin.updateOne({
                    emailId: emailId
                }, {
                    $unset: {
                        otp: null,
                        expireTime: null
                    }
                })
                res.status(200).json({
                    error: false,
                    message: 'Login Successfull'
                })
            } else {
                res.status(400).json({
                    error: true,
                    message: 'Incorrect OTP'
                })
            }
        } else {
            res.status(400).json({
                error: true,
                message: 'Otp has been Expiried'
            })
        }
    } catch (err) {
        next(err.message)
    }
}


const resendOtp = async (req, res, next) => {
    try {
        const {
            emailId
        } = req.body;
        const superAdmin = await SuperAdmin.findOne({
            emailId
        });
        if (superAdmin) {

            const otp = Math.floor(100000 + Math.random() * 900000);
            var d1 = new Date();
            await SuperAdmin.updateOne({
                emailId: emailId
            }, {
                $set: {
                    otp: otp,
                    expireTime: d1.getTime()
                }
            })
            var template = await fs.readFileSync(adminForgotOtp, {
                encoding: 'utf-8'
            });
            if (template) {
                template = template.replace(new RegExp("(OTP_HERE)", "g"), otp);
            }
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
                subject: 'Verification Code for Password change',
                html: template
            };
            await transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    next(error.message)
                } else {
                    res.status(200).json({
                        error: false,
                        message: "OTP has been sent to your mail Id"
                    });
                }
            });
            // res.status(200).json({
            //     error: false,
            //     message: 'Login Successfull',
            //     token,
            //     response: superAdmin
            // })

        } else {
            res.status(400).json({
                error: true,
                message: 'Admin Not Found'
            })
        }
    } catch (err) {
        next(err.message)
    }
}

const dashboardData = async (req, res, next) => {
    try {
        const result = await Register.find();
        const result1 = await Register.find({
            password: {
                $exists: true
            }
        });
        var d1 = new Date();
        d1.setMonth(d1.getMonth() - 1);
        const d2 = new Date();
        d2.setFullYear(d2.getFullYear() - 1)
        const lastMonth = await Register.find({
            created_at: {
                $gte: d1
            }
        })
        const lastMonthSubsciptionPercentage = (lastMonth.length * 100) / result.length;
        const totalAccountResp = await Account.find({
            "history._id": {
                $exists: true
            }
        })
        const accountRespPerMonth = await Account.find({
            created_at: {
                $gte: d1
            },
            "history._id": {
                $exists: true
            }
        });
        const totalRevenueOfLastYear = await Account.find({
            created_at: {
                $gte: d2
            },
            "history._id": {
                $exists: true
            }
        })

        let totrev = [];

        const calcRevenue = (history, type) => {
            let totalRevenue = 0;
            history.forEach(i => {
                if (i.history && i.history.length > 0) {
                    i.history.forEach((a) => {
                        if (type === 'year') {
                            const currentYear = new Date().getFullYear();
                            const createdYear = new Date(a.created_at).getFullYear();
                            const month = new Date(a.created_at).getMonth();
                            if (totrev[month]) {
                                totrev[month] += parseInt(a.amount, 10)
                            } else {
                                totrev[month] = parseInt(a.amount, 10)
                            }
                            if (currentYear === createdYear) {
                                totalRevenue += parseInt(a.amount, 10)
                            }
                        } else if (type === 'month') {
                            const currentMonth = new Date().getMonth();
                            const createdMonth = new Date(a.created_at).getMonth();
                            if (currentMonth === createdMonth) {
                                totalRevenue += parseInt(a.amount, 10)
                            }
                        }
                    })
                }
            })
            return totalRevenue;
        }

        const lastMonthRevenuePercentage = (accountRespPerMonth.length * 100) / totalAccountResp.length;
        const lastYearRevenuePercentage = (totalRevenueOfLastYear.length * 100) / totalAccountResp.length;
        const totalRevenuePerMonth = calcRevenue(totalAccountResp, 'month');
        const totalRevenuePerYear = calcRevenue(totalAccountResp, 'year');
        const planCount = totalAccountResp.map(i => i.history).flat();

        const calcPlanPrice = (type) => {
            const planList = planCount.filter(i => {
                if (i.plans.planName !== undefined) {
                    return i.plans.planName.toLowerCase().includes(type)
                }
            })
            let totalPrice = null;
            if (planList.length > 0)
                totalPrice = planList.map(item => item.plans.price)
                .reduce((prev, next) => parseInt(prev, 10) + parseInt(next, 10))
            return {
                totalPrice,
                number: planList.length
            }
        }
        const starterPlan = Number(calcPlanPrice('start').totalPrice);
        const businessPlan = Number(calcPlanPrice('business').totalPrice);
        const enterprisePlan = Number(calcPlanPrice('enterprise').totalPrice);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        totrev = monthNames.map((value, ind) => {
            if (totrev[ind]) {
                return {
                    month: value,
                    value: totrev[ind]
                }
            }
            return null;
        })

        res.send({
            totalSubsciption: result1.length,
            newUsers: result.length,
            totalRevenuePerMonth: totalRevenuePerMonth,
            totalRevenuePerYear: totalRevenuePerYear,
            lastMonthRevenuePercentage,
            lastMonthUsersPercentage: lastMonthSubsciptionPercentage,
            lastYearRevenuePercentage: lastYearRevenuePercentage,
            lastMonthSubsciptionPercentage,
            totalRevenue: totrev,
            planCount: planCount.length,
            starterPlan: starterPlan,
            starterPlanCount: calcPlanPrice('start').number,
            businessPlan: businessPlan,
            businessPlanCount: calcPlanPrice('business').number,
            enterprisePlan: enterprisePlan,
            enterprisePlanCount: calcPlanPrice('enterprise').number,
            totalPlanPrice: starterPlan + businessPlan + enterprisePlan
        })
    } catch (err) {
        next(err.message)
    }
}

const customerData = async (req, res, next) => {
    try {
        const {
            country,
            packageId
        } = req.body;
        let reg = null;
        if (country) {
            reg = await Register.find({
                country
            });
        } else if (packageId && packageId.includes('free')) {
            reg = await Register.find({
                "plan.freeTrialUsed": {
                    $exists: true
                }
            });
        } else if (packageId && !packageId.includes('all')) {
            reg = await Register.find({
                'plan.planId': packageId
            });
        } else if (packageId && country) {
            reg = await Register.find({
                'plan.planId': packageId,
                country
            });
        } else {
            reg = await Register.find();
        }

        const arrOfIds = reg.map(i => i._id);

        const accp = await Account.find({
            userId: {
                $in: arrOfIds
            }
        })

        const getCustomerType = (user) => {
            if (new Date() > new Date(user.plan.endDate)) {
                return 'nonactive'
            } else if (new Date(user.plan.endDate) > new Date()) {
                return 'active'
            } else if (!user.hasOwnProperty('password')) {
                return 'unregistered'
            }
        }

        const modifiedData = reg.map((item) => {
            const accDetails = accp.find(i => i.userId === item._id.toString())
            return {
                userId: item._id,
                customerName: item.firstName + " " + item.lastName,
                purchaseDate: item.plan ? item.plan.startDate : null,
                packageType: item.plan ? item.plan.planName : null,
                duration: item.plan ? item.plan.duration : null,
                packExpiryDate: item.plan ? item.plan.endDate : null,
                totalEarnings: (accDetails && accDetails.history.length > 0) ?
                    accDetails.history.map(j => j.plans.price)
                    .reduce((prev, next) => parseInt(prev, 10) + parseInt(next, 10)) : 0,
                customerType: getCustomerType(item)
            }
        })

        const result = {
            active: [],
            nonactive: [],
            unregistered: []
        };

        modifiedData.forEach(i => {
            result[i.customerType].push(i);
        })

        res.send(result)
    } catch (err) {
        next(err.message)
    }
}

const revenueData = async (req, res, next) => {
    const {
        day,
        month,
        year
    } = req.body
    try {
        let filterDate = null;
        if (day === 'today') {
            filterDate = new Date();
        } else if (day === 'yesterday') {
            filterDate = new Date();
            filterDate.setDate(filterDate.getDate() - 1);
        } else if (day === 'last15') {
            filterDate = new Date();
            filterDate.setDate(filterDate.getDate() - 15);
        }
        let firstDate = null;
        let lastDate = null;
        let reg = null;
        if (month) {
            const date = new Date();
            firstDate = new Date(year || date.getFullYear(), month - 1, 2);
            lastDate = new Date(year || date.getFullYear(), month, 1);
            reg = await Register.find({
                'plan.startDate': {
                    $gte: firstDate,
                    $lte: lastDate
                },
                "plan.freeTrialUsed": {
                    $exists: false
                }
            });
        } else {
            reg = await Register.find(filterDate ? {
                'plan.startDate': {
                    $gte: filterDate
                },
                "plan.freeTrialUsed": {
                    $exists: false
                }
            } : {
                "plan.freeTrialUsed": {
                    $exists: false
                }
            });
        }

        const arrOfIds = reg.map(i => i._id);

        const accp = await Account.find({
            userId: {
                $in: arrOfIds
            }
        })

        const modifiedData = reg.map((item) => {
            const accDetails = accp.find(i => i.userId === item._id.toString())
            return {
                userId: item._id,
                customerName: item.firstName + " " + item.lastName,
                purchaseDate: item.plan ? item.plan.startDate : null,
                packageType: item.plan ? item.plan.planName : null,
                duration: item.plan ? item.plan.duration : null,
                packExpiryDate: item.plan ? item.plan.endDate : null,
                totalEarnings: (accDetails && accDetails.history.length > 0) ?
                    accDetails.history.map(j => j.amount)
                    .reduce((prev, next) => parseInt(prev, 10) + parseInt(next, 10)) : 0
            }
        })

        res.send({
            modifiedData,
            totalRevenue: modifiedData.length > 0? modifiedData.map(i => i.totalEarnings).
            reduce((prev, next) => parseInt(prev, 10) + parseInt(next, 10)): 0
        })
    } catch (err) {
        next(err.message)
    }
}

const reminderData = async (req, res, next) => {
    try {
        const {
            country,
            packageId
        } = req.body;
        let reg = null;
        if (country) {
            reg = await Register.find({
                country
            });
        } else if (packageId && packageId.includes('free')) {
            reg = await Register.find({
                "plan.freeTrialUsed": {
                    $exists: true
                }
            });
        } else if (packageId && !packageId.includes('all')) {
            reg = await Register.find({
                'plan.planId': packageId
            });
        } else if (packageId && country) {
            reg = await Register.find({
                'plan.planId': packageId,
                country
            });
        } else {
            reg = await Register.find();
        }

        const arrOfIds = reg.map(i => i._id);

        const accp = await Account.find({
            userId: {
                $in: arrOfIds
            }
        })

        const reminder = {
            1: [],
            15: [],
            30: []
        }

        reg.forEach((item) => {
            const accDetails = accp.find(i => i.userId === item._id.toString());
            const ob = {
                userId: item._id,
                customerName: item.firstName + " " + item.lastName,
                purchaseDate: item.plan ? item.plan.startDate : null,
                packageType: item.plan ? item.plan.planName : null,
                duration: item.plan ? item.plan.duration : null,
                packExpiryDate: item.plan ? item.plan.endDate : null,
                totalEarnings: (accDetails && accDetails.history.length > 0) ?
                    accDetails.history.map(j => j.plans.price)
                    .reduce((prev, next) => parseInt(prev, 10) + parseInt(next, 10)) : 0
            }
            const diffTime = Math.abs(item.plan.endDate - new Date());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                reminder['1'].push(ob);
            } else if (diffDays >= 2 && diffDays <= 15) {
                reminder['15'].push(ob);
            } else if (diffDays >= 16 && diffDays <= 30) {
                reminder['30'].push(ob);
            }
        })

        res.send({
            reminder
        })
    } catch (err) {
        next(err.message);
    }
}

const sendReminder = async (req, res, next) => {
    try {
        const {
            userIds,
            template
        } = req.body;
        const result = await Register.find({
            _id: {
                $in: userIds
            },
            "plan.freeTrialUsed": {
                $exists: false
            }
        })
        const emails = [];
        result.forEach(i => {
            emails.push(i.emailId);
        })
        if (template) {
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
                to: emails,
                subject: 'Reminder for subscription',
                html: template
            };
            await transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    next(error.message)
                } else {
                    res.status(200).json({
                        error: false,
                        message: "Reminder has been sent"
                    });
                }
            });
        }
    } catch (err) {
        next(err.message)
    }
}

const getCountryData = async (req, res, next) => {
    try {
        const reg = await Register.find({}, {
            country: 1,
            _id: 0
        });
        const modifiedData = reg.map(i => i.country);
        const data = modifiedData.filter(function (element) {
            return element !== undefined;
        });
        var result = data.map(function (item) {
            return typeof item === "string" ? item.toString().toLowerCase() : item
        })
        result = [...new Set(result)];
        const formattedText = result.map(i => {
            return {
                displayName: (i.charAt(0).toUpperCase() + i.slice(1)),
                id: i
            }
        });
        res.send(formattedText);
    } catch (err) {
        next(err.message)
    }
}

const getPackageType = async (req, res, next) => {
    try {
        const plans = await plansandpricing.find({}, {
            name: 1
        })
        const plansRes = plans.map(i => {
            const modifiedName = i.name.split('(');
            return {
                _id: i._id,
                name: modifiedName[0].trim()
            }
        })
        res.send(plansRes);
    } catch (err) {
        next(err.message);
    }
}

module.exports = {
    registerSuperAdmin,
    loginSuperAdmin,
    checkOtp,
    resendOtp,
    dashboardData,
    customerData,
    reminderData,
    sendReminder,
    revenueData,
    getCountryData,
    superAdminLogin,
    getPackageType
}