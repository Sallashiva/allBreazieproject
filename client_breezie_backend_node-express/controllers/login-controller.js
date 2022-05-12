const Admin = require('../model/login-model');
const Register = require('../model/register-model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const adminRegisterEmail = path.join(__dirname, '../views/email/email-admin-register.html');
const adminForgotOtp = path.join(__dirname, '../views/email/email-otp.html');

// {},{name:0}

const getAllUsers = async (req, res, next) => {
    try {
        const adminData = await Admin.find({}, {
            otp: 0
        }).sort({
            name: 1
        });
        res.status(200).json({
            error: false,
            adminData
        })
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy"
        })
    }
}

const checkUsers = async (req, res, next) => {
    try {
        const adminData = await Admin.find({
            _id:req.params.id
        }, {
            otp: 0
        }).sort({
            name: 1
        });;
        if (adminData) {
            res.status(200).json({
                error: false,
                adminData
            })
        } else {
            res.status(404).json({
                error: true,
                message:"No admin found"
            })
        }
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy"
        })
    }
}


const register = async (req, res, next) => {
    try {
        const {
            name,
            emailId,
            designation,
            password,
        } = req.body;
        let capitilizeName = name.charAt(0).toUpperCase() + name.slice(1);
        let capitilizeDesignation = designation.charAt(0).toUpperCase() + designation.slice(1);
        const totalAdmin = await Admin.find();
        const admin = await Admin.findOne({
            emailId
        });
        if (totalAdmin.length < 5) {
            if (!admin) {
                const salt = bcrypt.genSaltSync(10);
                const encryptedPassword = bcrypt.hashSync(password, salt)
                const response = await Admin.insertMany([{
                    name: capitilizeName,
                    emailId,
                    designation: capitilizeDesignation,
                    password: encryptedPassword,
                }]);
                var template = await fs.readFileSync(adminRegisterEmail, {
                    encoding: 'utf-8'
                });
                if (template) {
                    template = template.replace(new RegExp("(adminName)", "g"), capitilizeName);
                    template = template.replace(new RegExp("(adminEmailId)", "g"), emailId);
                    template = template.replace(new RegExp("(adminPassword)", "g"), password);
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
                    subject: 'User Registered Successfull',
                    html: template
                };
                await transporter.sendMail(mailOptions, function (error) {
                    if (error) {

                    } else {
                    }
                });
                res.status(200).json({
                    error: false,
                    message: "Registered Successfully",
                    response
                })
            } else {
                res.status(401).json({
                    error: true,
                    message: "Admin already exists! Please login"
                })
            }
        } else {
            res.status(401).json({
                error: true,
                message: "Adding user limit has been exceeded please delete old user to add new user"
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
        const admin = await Admin.findOne({
            emailId
        });
        if (admin) {
            if (bcrypt.compareSync(password, admin.password)) {
                const payload = {
                    emailId: admin.emailId
                }
                const token = jwt.sign(payload, process.env.jwtSecret);
                res.status(200).json({
                    error: false,
                    message: 'Login Successfull',
                    token,
                    admin
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
    } catch (err) {
        res.status(404).json({
            error: true,
            message: 'Something Went Wrong'
        })
    }
}

const editUser = async (req, res, next) => {
    try {
        const {
            name,
            emailId,
            designation
        } = req.body;
        let capitilizeName = name.charAt(0).toUpperCase() + name.slice(1);
        let capitilizeDesignation = designation.charAt(0).toUpperCase() + designation.slice(1);
        await Admin.updateOne({
            _id: req.params.id
        }, {
            $set: {
                name: capitilizeName,
                emailId,
                designation: capitilizeDesignation
            }
        })
        const response = await Admin.findOne({
            _id: req.params.id
        });
        res.status(200).json({
            error: false,
            message: "Details Updated Successfully",
            _id: req.params.id,
            response
        })
    } catch (err) {
        next(err.message)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await Admin.deleteOne({
            _id: req.params.id
        });
        res.status(200).json({
            error: false,
            message: 'User Deleted Successfully',
            _id: req.params.id
        })
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

const checkOtp = async (req, res, next) => {
    try {
        const {
            emailId,
            otp
        } = req.body
        const admin = await Register.findOne({
            emailId: emailId
        })
        const convertOtp = parseInt(otp)
        var d1 = new Date();
        var d2 = d1.getTime()
        if (d2 < (admin.expireTime + 600000)) {
            if (admin.otp === convertOtp) {
                await Register.updateOne({
                    emailId: emailId
                }, {
                    $unset: {
                        otp: null,
                        expireTime: null
                    }
                })
                res.status(200).json({
                    error: false,
                    message: 'OTP verified'
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

const updatePassword = async (req, res, next) => {
    try {
        const {
            emailId,
            password
        } = req.body;
        const admin = await Register.findOne({
            emailId
        });
        if (admin) {
            if (bcrypt.compareSync(password, admin.password)) {
                res.status(402).json({
                    error: true,
                    message: "Do not use Old Password"
                })
            } else {
                const salt = bcrypt.genSaltSync(10);
                const encryptedPassword = bcrypt.hashSync(password, salt)
                await Register.updateOne({
                    emailId: emailId
                }, {
                    $set: {
                        password: encryptedPassword
                    }
                });
                const response = await Register.findOne({
                    _id: req.params.id
                });
                res.status(200).json({
                    error: false,
                    message: "Details Updated Successfully"
                });
            }
        }
    } catch (err) {
        next(err.message);
    }
}

module.exports = {
    checkUsers,
    register,
    login,
    forgotPassword,
    checkOtp,
    getAllUsers,
    editUser,
    updatePassword,
    deleteUser
}