const Visitor = require('../model/visitor-model');
const Employee = require('../model/employee-model');
const Devicelocation = require('../model/devicelocation-model');
const Timeline = require('../model/timeline-model');
const Register = require('../model/register-model');
const Agreement = require('../model/agreement-model');
const Settings = require("../model/settings.model");
const RememberVisitor = require("../model/remember-model");


const PDFDocument = require('pdfkit')

const nodemailer = require('nodemailer');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
const mime = require('mime');
const jwt = require('jsonwebtoken')
const agreementEmail = path.join(__dirname, '../views/email/email-agreement.html');
const approvalVisitorEmail = path.join(__dirname, '../views/email/email_visitor_approval.html');

const EmployeeNotifyEmail = path.join(__dirname, '../views/email/email-employee.html');
// const CafeNotifyEmail = path.join(__dirname, '../views/email/email-cafe.html');
const CafeNotifyEmail = path.join(__dirname, '../views/email/email_cafe_catering.html');

const Aws = require('aws-sdk')

const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET // secretAccessKey is also store in .env file
})

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}

async function deviceToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    // let userId = verifiedUser.userId
    return verifiedUser
}


async function createDateAndTime(req) {
    const {
        finalDate,
    } = req.body;
    const time = new Date(finalDate)
    const mth = time.getMonth() + 1
    const AgreementDate = time.getDate() + "/" + mth + "/" + time.getFullYear()
    const AgreementTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
    const dateAndTime = {}
    dateAndTime["AgreementDate"] = AgreementDate
    dateAndTime["AgreementTime"] = AgreementTime
    return dateAndTime
}

const EvacuationData = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const visitorData = await Visitor.find({
            userId,
            logoutTime: {
                $exists: false
            }
            // }).sort({
            //     loginTime: -1
        });
        const employeeData = await Employee.find({
            userId,
            'lastActivity.recent': 'login'
        });
        const finalResponse = employeeData.concat(visitorData)
        res.status(200).json({
            error: false,
            message: "string",
            response: finalResponse
        })
    } catch (err) {
        next(err.message)
    }
}

const meargeTimeLine = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const visitorArray = await Visitor.find({
            userId
        }).sort({
            created_at: -1
        })
        const timeline = await Timeline.find({
            userId
        }).sort({
            created_at: -1
        })
        const finalResponse = visitorArray.concat(timeline)
        res.status(200).json({
            error: false,
            finalResponse
        })
    } catch (err) {
        next(err.message)
    }
}

const getAllVisitor = async(req, res, next) => {
    try {
        let startDate = req.params.startDate
        let endDate = req.params.endDate
        const userId = await getUserToken(req);
        if (startDate == "All") {
            const visitorArray = await Visitor.find({
                userId,
                isPending: false
            }).sort({
                created_at: -1
            })
            res.status(200).json({
                error: false,
                visitorArray
            })
        } else {
            let visitorArray = []
            const visitorData = await Visitor.find({
                userId,
                isPending: false
            }).sort({
                created_at: -1
            })
            visitorData.forEach((ele, i) => {
                if (new Date(startDate) >= new Date(ele.loginTime) && new Date(endDate) <= new Date(ele.loginTime)) {
                    visitorArray.push(ele)
                }
            })
            res.status(200).json({
                error: false,
                visitorArray
            })
        }
    } catch (err) {
        next(err.message)
    }
}


const getPendingVisitor = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        let startDate = req.params.startDate
        let endDate = req.params.endDate
        if (startDate == "All") {
            const pendingVisitor = await Visitor.find({
                userId,
                isPending: true
            }).sort({
                created_at: -1
            })
            res.status(200).json({
                error: false,
                response: pendingVisitor
            })
        } else {
            let visitorArray = []
            const visitorData = await Visitor.find({
                userId,
                isPending: true
            })
            visitorData.forEach((ele, i) => {
                if (new Date(startDate) >= new Date(ele.loginTime) && new Date(endDate) <= new Date(ele.loginTime)) {
                    visitorArray.push(ele)
                }
            })
            res.status(200).json({
                error: false,
                response: visitorArray
            })
        }
    } catch (err) {
        next(err.message)
    }
}



const getRememberedVisitor = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const pendingVisitor = await RememberVisitor.find({
            userId,
        }).sort({
            created_at: -1
        })
        res.status(200).json({
            error: false,
            response: pendingVisitor
        })
    } catch (err) {
        next(err.message)
    }
}

const getAllVisitorIonic = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const visitorArray = await Visitor.find({
            userId,
            logoutTime: {
                $exists: false
            }
        }).sort({
            loginTime: -1
        })
        res.status(200).json({
            error: false,
            visitorArray
        })

    } catch (err) {
        next(err.message)
    }
}

const getTodayVisitor = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        var query = {
            loginTime: new RegExp('^' + finalDate)
        };
        const visitorData = await Visitor.find(query).sort({
            loginTime: -1
        });
        res.status(200).json({
            error: false,
            visitorData
        })
    } catch (err) {
        next(err.message)
    }
}

const checkApproval = async(req, res, next) => {
    try {
        const {
            approval,
            finalDate
        } = req.body
        if (approval == true) {
            await Visitor.updateOne({
                _id: req.params.id
            }, {
                $set: {
                    isPending: false
                }
            });
            res.status(200).json({
                error: false
            })
        } else if (approval == false) {
            await Visitor.updateOne({
                _id: req.params.id
            }, {
                $set: {
                    isPending: false,
                    reject: true,
                    logoutTime: finalDate
                }
            });
            res.status(200).json({
                error: false
            })
        }
    } catch {
        next(err.message)
    }
}

const addVisitorInDevice = async(req, res, next) => {
    try {
        const {
            FullName,
            CompanyName,
            Extrafields,
            finalDate,
            visiting,
            location,
            HostName,
            Category,
            DigitalSignature,
            EmailId,
            EmployeeId,
            VisitorImage,
            imageUrl,
            rememberMe
        } = req.body;
        const rememberMeData = {};
        const verifiedUser = await deviceToken(req);
        const dateTime = await createDateAndTime(req)
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
        const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail

        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);

        //// digitalSignature
        const SignatureS3type = DigitalSignature.split(';')[0].split('/')[1];
        var Signaturematches = DigitalSignature.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            SignatureimgResponse = {};
        if (Signaturematches.length !== 3) {
            return new Error('Invalid input string');
        }
        SignatureimgResponse.type = Signaturematches[1];
        SignatureimgResponse.data = new Buffer.from(Signaturematches[2], 'base64');
        const SignaturedecodedImg = SignatureimgResponse;
        const SignatureimageBuffer = SignaturedecodedImg.data;
        const Signaturetype = SignaturedecodedImg.type;
        const Signatureextension = mime.getExtension(Signaturetype);
        const SignatureS3imageName = "Signature" + Math.floor(Math.random() * 1000000 + 1) + "." + Signatureextension;
        const Signatureurl = req.protocol + '://' + req.get('host');
        const SignatureimagePath = Signatureurl + `/images/Visitor/development/` + SignatureS3imageName
        const SignaturefinalImage = (SignatureS3imageName, SignatureimageBuffer, 'utf8')
        fs.writeFileSync('./images/Visitor/development/' + SignatureS3imageName, SignatureimageBuffer, 'utf8');

        // S3 Bucket Visitor Signature Params
        const Signatureparams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `images/visitor/development/${SignatureS3imageName}`, // type is not required
            Body: SignatureimageBuffer,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${SignatureS3type}` // required. Notice the back ticks
        }

        let company = await Devicelocation.findOne({
            _id: locationId
        });
        let locationOfficeName = company.locations.officeName

        if (imageUrl) {
            // //// Create Visitor Image 
            const VisitorS3type = imageUrl.split(';')[0].split('/')[1];
            var Visitormatches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                VisitorimgResponse = {};
            if (Visitormatches.length !== 3) {
                return new Error('Invalid input string');
            }
            VisitorimgResponse.type = Visitormatches[1];
            VisitorimgResponse.data = new Buffer.from(Visitormatches[2], 'base64');
            const VisitordecodedImg = VisitorimgResponse;
            const VisitorimageBuffer = VisitordecodedImg.data;
            const Visitortype = VisitordecodedImg.type;
            const Visitorextension = mime.getExtension(Visitortype);
            const VisitorS3imageName = "Profile" + Math.floor(Math.random() * 1000000 + 1) + "." + Visitorextension;

            // S3 Bucket Visitor Image Params
            const VisitorImageParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/visitor/development/${VisitorS3imageName}`, // type is not required
                Body: VisitorimageBuffer,
                ACL: 'public-read',
                ContentEncoding: 'base64', // required
                ContentType: `image/${VisitorS3type}` // required. Notice the back ticks
            }

            await s3.upload(VisitorImageParams, async(error, VisitorResponse) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Photo"
                    })
                } else {
                    await s3.upload(Signatureparams, async(error, SignatureResponse) => {
                        if (error) {
                            res.status(404).json({
                                error: true,
                                message: "Error in Uploading Photo",
                                response
                            })
                        } else {
                            const agreementData = await Agreement.findOne({
                                userId,
                                isSelected: true
                            });
                            const html = agreementData.agreementData
                            const html2 = `
                            <div style='float:left'>
                            Date: ${dateTime.AgreementDate} <br>
                            Time: ${dateTime.AgreementTime}
                            </div>
                            <div style='float:right'>
                            <div>Signature</div>
                                <div>
                                    <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px">
                                </div>
                            </div>`
                            let finalResult = html + html2
                            var options = {
                                format: 'A4',
                                "border": {
                                    "top": "2cm", // default is 0, units: mm, cm, in, px
                                    "right": "2cm",
                                    "bottom": "2cm",
                                    "left": "2cm"
                                },
                            };

                            pdf.create(finalResult, options).toFile('agreement.pdf', async(err, response) => {
                                if (!err) {
                                    if (visiting) {
                                        //  Find Employee
                                        const employeeDetails = await Employee.findOne({
                                            _id: visiting
                                        });
                                        if (sendVisitorNotificationByEmail) {

                                            var EmployeeTemplate = await fs.readFileSync(EmployeeNotifyEmail, {
                                                encoding: 'utf-8'
                                            });
                                            if (EmployeeTemplate) {
                                                const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                                            src="${VisitorResponse.Location}"
                                            alt="logo">`
                                                EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(employeeName)", "g"), employeeDetails.employeeName);
                                                EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(VisitorName)", "g"), FullName);
                                                EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(ImageRegs)", "g"), regz);
                                            }
                                            // mail service
                                            var EmployeeMailTransporter = nodemailer.createTransport({
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
                                            var EmployeeMailOptions = {
                                                from: process.env.Email,
                                                to: [employeeDetails.email],
                                                subject: 'Digitoonz Guest Notification',
                                                html: EmployeeTemplate
                                            };

                                            await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function(error, info) {
                                                if (error) {} else {

                                                    // Agreement Email For Visitor
                                                    if (EmailId) {
                                                        const VisitorTemplate = await fs.readFileSync(agreementEmail, {
                                                            encoding: 'utf-8'
                                                        });
                                                        var VisitorMailTransporter = nodemailer.createTransport({
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
                                                        var VisitorMailOptions = {
                                                            from: process.env.Email,
                                                            to: [EmailId],
                                                            subject: 'Digitoonz Agreement Copy',
                                                            html: VisitorTemplate,
                                                            attachments: [{
                                                                filename: `agreement.pdf`,
                                                                path: 'agreement.pdf'
                                                            }]
                                                        };
                                                        if (fs.existsSync(`agreement.pdf`)) {
                                                            await VisitorMailTransporter.sendMail(VisitorMailOptions, async function(error) {
                                                                if (error) {} else {
                                                                    const visitorData = await Visitor.insertMany([{
                                                                        FullName: capitilizeName,
                                                                        CompanyName,
                                                                        location: locationOfficeName,
                                                                        HostName: employeeDetails.fullName,
                                                                        Category,
                                                                        loginTime: finalDate,
                                                                        VisitorImage: VisitorResponse.Location,
                                                                        DigitalSignature: SignatureResponse.Location,
                                                                        role: "Visitor",
                                                                        userId: userId,
                                                                        Extrafields,
                                                                        isPending,
                                                                        rememberMe
                                                                    }]);
                                                                    if (rememberMe && rememberVisitorSetting) {
                                                                        await RememberVisitor.insertMany([{
                                                                            FullName: capitilizeName,
                                                                            CompanyName,
                                                                            location: locationOfficeName,
                                                                            HostName: employeeDetails.fullName,
                                                                            Category,
                                                                            loginTime: finalDate,
                                                                            VisitorImage: VisitorResponse.Location,
                                                                            DigitalSignature: SignatureResponse.Location,
                                                                            role: "Visitor",
                                                                            userId: userId,
                                                                            Extrafields,
                                                                            isPending,
                                                                            rememberMe,
                                                                            lastActivity: {
                                                                                recent: "login",
                                                                                time: finalDate
                                                                            },
                                                                            visitorId: visitorData[0]._id
                                                                        }]);
                                                                    }
                                                                    const RememberVisitorData = await RememberVisitor.find({
                                                                        userId: userId
                                                                    });
                                                                    res.status(200).json({
                                                                        error: false,
                                                                        message: "Guest Details Added Successfully",
                                                                        visitorData,
                                                                        RememberVisitorData
                                                                    })
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        const visitorData = await Visitor.insertMany([{
                                                            FullName: capitilizeName,
                                                            CompanyName,
                                                            location: locationOfficeName,
                                                            HostName: employeeDetails.fullName,
                                                            Category,
                                                            loginTime: finalDate,
                                                            VisitorImage: VisitorResponse.Location,
                                                            DigitalSignature: SignatureResponse.Location,
                                                            role: "Visitor",
                                                            userId: userId,
                                                            Extrafields,
                                                            isPending,
                                                            rememberMe
                                                        }]);
                                                        if (rememberMe && rememberVisitorSetting) {
                                                            await RememberVisitor.insertMany([{
                                                                FullName: capitilizeName,
                                                                CompanyName,
                                                                location: locationOfficeName,
                                                                HostName: employeeDetails.fullName,
                                                                Category,
                                                                loginTime: finalDate,
                                                                VisitorImage: VisitorResponse.Location,
                                                                DigitalSignature: SignatureResponse.Location,
                                                                role: "Visitor",
                                                                userId: userId,
                                                                Extrafields,
                                                                isPending,
                                                                lastActivity: {
                                                                    recent: "login",
                                                                    time: finalDate
                                                                },
                                                                rememberMe,
                                                                visitorId: visitorData[0]._id
                                                            }]);
                                                        }
                                                        const RememberVisitorData = await RememberVisitor.find({
                                                            userId: userId
                                                        });
                                                        res.status(200).json({
                                                            error: false,
                                                            message: "Guest Details Added Successfully",
                                                            visitorData,
                                                            RememberVisitorData
                                                        })
                                                    }
                                                }
                                            });
                                        } else {
                                            if (EmailId) {

                                                const VisitorTemplate = await fs.readFileSync(agreementEmail, {
                                                    encoding: 'utf-8'
                                                });
                                                var VisitorMailTransporter = nodemailer.createTransport({
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
                                                var VisitorMailOptions = {
                                                    from: process.env.Email,
                                                    to: [EmailId],
                                                    subject: 'Digitoonz Agreement Copy',
                                                    html: VisitorTemplate,
                                                    attachments: [{
                                                        filename: `agreement.pdf`,
                                                        path: 'agreement.pdf'
                                                    }]
                                                };
                                                if (fs.existsSync(`agreement.pdf`)) {
                                                    await VisitorMailTransporter.sendMail(VisitorMailOptions, async function(error) {
                                                        if (error) {} else {
                                                            const visitorData = await Visitor.insertMany([{
                                                                FullName: capitilizeName,
                                                                CompanyName,
                                                                location: locationOfficeName,
                                                                HostName: employeeDetails.fullName,
                                                                Category,
                                                                loginTime: finalDate,
                                                                VisitorImage: VisitorResponse.Location,
                                                                DigitalSignature: SignatureResponse.Location,
                                                                role: "Visitor",
                                                                userId: userId,
                                                                Extrafields,
                                                                isPending,
                                                                rememberMe
                                                            }]);
                                                            if (rememberMe && rememberVisitorSetting) {
                                                                await RememberVisitor.insertMany([{
                                                                    FullName: capitilizeName,
                                                                    CompanyName,
                                                                    location: locationOfficeName,
                                                                    HostName: employeeDetails.fullName,
                                                                    Category,
                                                                    loginTime: finalDate,
                                                                    VisitorImage: VisitorResponse.Location,
                                                                    DigitalSignature: SignatureResponse.Location,
                                                                    role: "Visitor",
                                                                    userId: userId,
                                                                    lastActivity: {
                                                                        recent: "login",
                                                                        time: finalDate
                                                                    },
                                                                    Extrafields,
                                                                    isPending,
                                                                    rememberMe,
                                                                    visitorId: visitorData[0]._id
                                                                }]);
                                                            }
                                                            const RememberVisitorData = await RememberVisitor.find({
                                                                userId: userId
                                                            });
                                                            res.status(200).json({
                                                                error: false,
                                                                message: "Guest Details Added Successfully",
                                                                visitorData,
                                                                RememberVisitorData
                                                            })
                                                        }
                                                    });
                                                }
                                            } else {
                                                const visitorData = await Visitor.insertMany([{
                                                    FullName: capitilizeName,
                                                    CompanyName,
                                                    location: locationOfficeName,
                                                    HostName: employeeDetails.fullName,
                                                    Category,
                                                    loginTime: finalDate,
                                                    VisitorImage: VisitorResponse.Location,
                                                    DigitalSignature: SignatureResponse.Location,
                                                    role: "Visitor",
                                                    userId: userId,
                                                    Extrafields,
                                                    isPending,
                                                    rememberMe
                                                }]);
                                                if (rememberMe && rememberVisitorSetting) {
                                                    await RememberVisitor.insertMany([{
                                                        FullName: capitilizeName,
                                                        CompanyName,
                                                        location: locationOfficeName,
                                                        HostName: employeeDetails.fullName,
                                                        Category,
                                                        loginTime: finalDate,
                                                        VisitorImage: VisitorResponse.Location,
                                                        DigitalSignature: SignatureResponse.Location,
                                                        role: "Visitor",
                                                        userId: userId,
                                                        lastActivity: {
                                                            recent: "login",
                                                            time: finalDate
                                                        },
                                                        Extrafields,
                                                        isPending,
                                                        rememberMe,
                                                        visitorId: visitorData[0]._id
                                                    }]);
                                                }
                                                const RememberVisitorData = await RememberVisitor.find({
                                                    userId: userId
                                                });
                                                res.status(200).json({
                                                    error: false,
                                                    message: "Guest Details Added Successfully",
                                                    visitorData,
                                                    RememberVisitorData
                                                })
                                            }
                                        }

                                    } else {
                                        if (EmailId) {
                                            const VisitorTemplate = await fs.readFileSync(agreementEmail, {
                                                encoding: 'utf-8'
                                            });
                                            var VisitorMailTransporter = nodemailer.createTransport({
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
                                            var VisitorMailOptions = {
                                                from: process.env.Email,
                                                to: [EmailId],
                                                subject: 'Digitoonz Agreement Copy',
                                                html: VisitorTemplate,
                                                attachments: [{
                                                    filename: `agreement.pdf`,
                                                    path: 'agreement.pdf'
                                                }]
                                            };
                                            if (fs.existsSync(`agreement.pdf`)) {
                                                await VisitorMailTransporter.sendMail(VisitorMailOptions, async function(error) {
                                                    if (error) {} else {
                                                        const visitorData = await Visitor.insertMany([{
                                                            FullName: capitilizeName,
                                                            CompanyName,
                                                            location: locationOfficeName,
                                                            // HostName: employeeDetails.fullName,
                                                            Category,
                                                            loginTime: finalDate,
                                                            VisitorImage: VisitorResponse.Location,
                                                            DigitalSignature: SignatureResponse.Location,
                                                            role: "Visitor",
                                                            userId: userId,
                                                            Extrafields,
                                                            isPending,
                                                            rememberMe
                                                        }]);
                                                        if (rememberMe && rememberVisitorSetting) {
                                                            await RememberVisitor.insertMany([{
                                                                FullName: capitilizeName,
                                                                CompanyName,
                                                                location: locationOfficeName,
                                                                // HostName: employeeDetails.fullName,
                                                                Category,
                                                                loginTime: finalDate,
                                                                lastActivity: {
                                                                    recent: "login",
                                                                    time: finalDate
                                                                },
                                                                VisitorImage: VisitorResponse.Location,
                                                                DigitalSignature: SignatureResponse.Location,
                                                                role: "Visitor",
                                                                userId: userId,
                                                                Extrafields,
                                                                isPending,
                                                                rememberMe,
                                                                visitorId: visitorData[0]._id
                                                            }]);
                                                        }
                                                        const RememberVisitorData = await RememberVisitor.find({
                                                            userId: userId
                                                        });
                                                        res.status(200).json({
                                                            error: false,
                                                            message: "Guest Details Added Successfully",
                                                            visitorData,
                                                            RememberVisitorData
                                                        })
                                                    }
                                                });

                                            }
                                        } else {
                                            const visitorData = await Visitor.insertMany([{
                                                FullName: capitilizeName,
                                                CompanyName,
                                                location: locationOfficeName,
                                                // HostName: employeeDetails.fullName,
                                                Category,
                                                loginTime: finalDate,
                                                VisitorImage: VisitorResponse.Location,
                                                DigitalSignature: SignatureResponse.Location,
                                                role: "Visitor",
                                                userId: userId,
                                                Extrafields,
                                                isPending,
                                                rememberMe
                                            }]);
                                            if (rememberMe && rememberVisitorSetting) {
                                                await RememberVisitor.insertMany([{
                                                    FullName: capitilizeName,
                                                    CompanyName,
                                                    location: locationOfficeName,
                                                    // HostName: employeeDetails.fullName,
                                                    Category,
                                                    loginTime: finalDate,
                                                    VisitorImage: VisitorResponse.Location,
                                                    DigitalSignature: SignatureResponse.Location,
                                                    role: "Visitor",
                                                    userId: userId,
                                                    lastActivity: {
                                                        recent: "login",
                                                        time: finalDate
                                                    },
                                                    Extrafields,
                                                    isPending,
                                                    rememberMe,
                                                    visitorId: visitorData[0]._id
                                                }]);
                                            }
                                            const RememberVisitorData = await RememberVisitor.find({
                                                userId: userId
                                            });
                                            res.status(200).json({
                                                error: false,
                                                message: "Guest Details Added Successfully",
                                                visitorData,
                                                RememberVisitorData
                                            })
                                        }
                                    }
                                }
                            });
                        }
                    })
                }
            })
        } else {
            // If image URL is not there  
            await s3.upload(Signatureparams, async(error, SignatureResponse) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Photo",
                        response
                    })
                } else {
                    const agreementData = await Agreement.findOne({
                        userId,
                        isSelected: true
                    });

                    const html = agreementData.agreementData
                    const html2 = `
                    <div style='float:left'>
                    Date: ${dateTime.AgreementDate} <br>
                    Time: ${dateTime.AgreementTime}
                    </div>
                    <div style='float:right'>
                    <div>Signature</div>
                        <div>
                            <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px">
                        </div>
                    </div>`
                    let finalResult = html + html2
                    var options = {
                        format: 'A4',
                        "border": {
                            "top": "2cm", // default is 0, units: mm, cm, in, px
                            "right": "2cm",
                            "bottom": "2cm",
                            "left": "2cm"
                        },
                    };
                    // fs.writeFileSync('agrem.pdf', finalResult, options)
                    pdf.create(finalResult, options).toFile('agreement.pdf', async(err, response) => {
                        if (!err) {
                            if (visiting) {
                                var EmployeeTemplate = await fs.readFileSync(EmployeeNotifyEmail, {
                                    encoding: 'utf-8'
                                });
                                const employeeDetails = await Employee.findOne({
                                    _id: visiting
                                });
                                if (EmployeeTemplate) {
                                    const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                                src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png"
                                alt="logo">`
                                    EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(employeeName)", "g"), employeeDetails.employeeName);
                                    EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(VisitorName)", "g"), FullName);
                                    EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(ImageRegs)", "g"), regz);
                                }
                                // mail service
                                var EmployeeMailTransporter = nodemailer.createTransport({
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
                                var EmployeeMailOptions = {
                                    from: process.env.Email,
                                    to: [employeeDetails.email],
                                    subject: 'Digitoonz Guest Notification',
                                    html: EmployeeTemplate
                                };

                                await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function(error, info) {
                                    if (error) {} else {
                                        // Agreement Email For Visitor
                                        if (EmailId) {
                                            const VisitorTemplate = await fs.readFileSync(agreementEmail, {
                                                encoding: 'utf-8'
                                            });
                                            var VisitorMailTransporter = nodemailer.createTransport({
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
                                            var VisitorMailOptions = {
                                                from: process.env.Email,
                                                to: [EmailId],
                                                subject: 'Digitoonz Agreement Copy',
                                                html: VisitorTemplate,
                                                attachments: [{
                                                    filename: `agreement.pdf`,
                                                    path: 'agreement.pdf'
                                                }]
                                            };
                                            if (fs.existsSync(`agreement.pdf`)) {
                                                await VisitorMailTransporter.sendMail(VisitorMailOptions, async function(error) {
                                                    if (error) {} else {
                                                        const visitorData = await Visitor.insertMany([{
                                                            FullName: capitilizeName,
                                                            CompanyName,
                                                            location: locationOfficeName,
                                                            HostName: employeeDetails.fullName,
                                                            Category,
                                                            loginTime: finalDate,
                                                            // VisitorImage: VisitorResponse.Location,
                                                            DigitalSignature: SignatureResponse.Location,
                                                            role: "Visitor",
                                                            userId: userId,
                                                            Extrafields,
                                                            isPending,
                                                            rememberMe
                                                        }]);
                                                        if (rememberMe && rememberVisitorSetting) {
                                                            await RememberVisitor.insertMany([{
                                                                FullName: capitilizeName,
                                                                CompanyName,
                                                                location: locationOfficeName,
                                                                HostName: employeeDetails.fullName,
                                                                Category,
                                                                loginTime: finalDate,
                                                                // VisitorImage: VisitorResponse.Location,
                                                                DigitalSignature: SignatureResponse.Location,
                                                                role: "Visitor",
                                                                userId: userId,
                                                                lastActivity: {
                                                                    recent: "login",
                                                                    time: finalDate
                                                                },
                                                                Extrafields,
                                                                isPending,
                                                                rememberMe,
                                                                visitorId: visitorData[0]._id
                                                            }]);
                                                        }
                                                        const RememberVisitorData = await RememberVisitor.find({
                                                            userId: userId
                                                        });
                                                        res.status(200).json({
                                                            error: false,
                                                            message: "Guest Details Added Successfully",
                                                            visitorData,
                                                            RememberVisitorData
                                                        })
                                                    }
                                                });

                                            }
                                        } else {
                                            const visitorData = await Visitor.insertMany([{
                                                FullName: capitilizeName,
                                                CompanyName,
                                                location: locationOfficeName,
                                                HostName: employeeDetails.fullName,
                                                Category,
                                                DigitalSignature: SignatureResponse.Location,
                                                loginTime: finalDate,
                                                role: "Visitor",
                                                userId: userId,
                                                Extrafields,
                                                isPending,
                                                rememberMe
                                            }]);
                                            if (rememberMe && rememberVisitorSetting) {
                                                await RememberVisitor.insertMany([{
                                                    FullName: capitilizeName,
                                                    CompanyName,
                                                    location: locationOfficeName,
                                                    HostName: employeeDetails.fullName,
                                                    Category,
                                                    DigitalSignature: SignatureResponse.Location,
                                                    loginTime: finalDate,
                                                    role: "Visitor",
                                                    userId: userId,
                                                    lastActivity: {
                                                        recent: "login",
                                                        time: finalDate
                                                    },
                                                    Extrafields,
                                                    isPending,
                                                    rememberMe,
                                                    visitorId: visitorData[0]._id
                                                }]);
                                            }
                                            const RememberVisitorData = await RememberVisitor.find({
                                                userId: userId
                                            });
                                            res.status(200).json({
                                                error: false,
                                                message: "Guest Details Added Successfully",
                                                visitorData,
                                                RememberVisitorData
                                            })
                                        }
                                    }
                                });
                            } else {
                                // Agreement Email For Visitor
                                if (EmailId) {
                                    const VisitorTemplate = await fs.readFileSync(agreementEmail, {
                                        encoding: 'utf-8'
                                    });
                                    var VisitorMailTransporter = nodemailer.createTransport({
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
                                    var VisitorMailOptions = {
                                        from: process.env.Email,
                                        to: [EmailId],
                                        subject: 'Digitoonz Agreement Copy',
                                        html: VisitorTemplate,
                                        attachments: [{
                                            filename: `agreement.pdf`,
                                            path: 'agreement.pdf'
                                        }]
                                    };
                                    if (fs.existsSync(`agreement.pdf`)) {
                                        await VisitorMailTransporter.sendMail(VisitorMailOptions, async function(error) {
                                            if (error) {
                                                console.log("unable to send mail");
                                            } else {
                                                const visitorData = await Visitor.insertMany([{
                                                    FullName: capitilizeName,
                                                    CompanyName,
                                                    location: locationOfficeName,
                                                    // HostName: employeeDetails.fullName,
                                                    Category,
                                                    loginTime: finalDate,
                                                    // VisitorImage: VisitorResponse.Location,
                                                    DigitalSignature: SignatureResponse.Location,
                                                    role: "Visitor",
                                                    userId: userId,
                                                    Extrafields,
                                                    isPending,
                                                    rememberMe
                                                }]);
                                                if (rememberMe && rememberVisitorSetting) {
                                                    await RememberVisitor.insertMany([{
                                                        FullName: capitilizeName,
                                                        CompanyName,
                                                        location: locationOfficeName,
                                                        // HostName: employeeDetails.fullName,
                                                        Category,
                                                        loginTime: finalDate,
                                                        // VisitorImage: VisitorResponse.Location,
                                                        DigitalSignature: SignatureResponse.Location,
                                                        role: "Visitor",
                                                        userId: userId,
                                                        lastActivity: {
                                                            recent: "login",
                                                            time: finalDate
                                                        },
                                                        Extrafields,
                                                        isPending,
                                                        rememberMe,
                                                        visitorId: visitorData[0]._id
                                                    }]);
                                                }
                                                const RememberVisitorData = await RememberVisitor.find({
                                                    userId: userId
                                                });
                                                res.status(200).json({
                                                    error: false,
                                                    message: "Guest Details Added Successfully",
                                                    visitorData,
                                                    RememberVisitorData
                                                })
                                            }
                                        });
                                    }
                                } else {
                                    const visitorData = await Visitor.insertMany([{
                                        FullName: capitilizeName,
                                        CompanyName,
                                        location: locationOfficeName,
                                        // HostName: employeeDetails.fullName,
                                        Category,
                                        DigitalSignature: SignatureResponse.Location,
                                        loginTime: finalDate,
                                        role: "Visitor",
                                        userId: userId,
                                        Extrafields,
                                        isPending,
                                        rememberMe
                                    }]);
                                    if (rememberMe && rememberVisitorSetting) {
                                        await RememberVisitor.insertMany([{
                                            FullName: capitilizeName,
                                            CompanyName,
                                            location: locationOfficeName,
                                            // HostName: employeeDetails.fullName,
                                            Category,
                                            DigitalSignature: SignatureResponse.Location,
                                            loginTime: finalDate,
                                            role: "Visitor",
                                            userId: userId,
                                            lastActivity: {
                                                recent: "login",
                                                time: finalDate
                                            },
                                            Extrafields,
                                            isPending,
                                            rememberMe,
                                            visitorId: visitorData[0]._id
                                        }]);
                                    }
                                    const RememberVisitorData = await RememberVisitor.find({
                                        userId: userId
                                    });
                                    res.status(200).json({
                                        error: false,
                                        message: "Guest Details Added Successfully",
                                        visitorData,
                                        RememberVisitorData
                                    })
                                }

                            }
                        }
                    });
                }
            })
        }

        const settings = await Settings.findOne({
            userId: userId
        });
        const SendNotification = settings.visitorSetting.visitorNotifications.isNotification
        const totalEmail = settings.visitorSetting.visitorNotifications.approvalemail
        if (SendNotification && totalEmail.length > 0) {
            const emails = []
            for (let i = 0; i < totalEmail.length; i++) {
                emails.push(totalEmail[i].email)
            }
            const employeeName = ""
            if (visiting) {
                const employeeDetails = await Employee.findOne({
                    _id: visiting
                });
                employeeName = employeeDetails.fullName + " " + employeeDetails.lastName;
            }
            let dateFormat = new Date(finalDate)
            const visitorTime = dateFormat.getDate() + "-" + dateFormat.getMonth() + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
            var VisitorsTemplate = await fs.readFileSync(approvalVisitorEmail, {
                encoding: 'utf-8'
            });
            VisitorsTemplate = VisitorsTemplate.replace(new RegExp("(Visitor)", "g"), FullName);
            VisitorsTemplate = VisitorsTemplate.replace(new RegExp("(deliveredTime)", "g"), visitorTime);
            VisitorsTemplate = VisitorsTemplate.replace(new RegExp("(EmployeeName)", "g"), employeeName);

            var VisitorMailTransporter = nodemailer.createTransport({
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
            var VisitorMailOptions = {
                from: process.env.Email,
                to: emails,
                subject: 'Digitoonz Guest Notification',
                html: VisitorsTemplate,
            };

            await VisitorMailTransporter.sendMail(VisitorMailOptions, async function(error) {
                if (error) {} else {}
            });
        }
        setTimeout(() => {
            fs.unlinkSync(`./images/Visitor/development/${SignatureS3imageName}`);
        }, 8000)
    } catch (err) {
        next(err.message)
    }
}

const addVisitor = async(req, res, next) => {
    try {
        const {
            FullName,
            CompanyName,
            finalDate
        } = req.body;
        const userId = await deviceToken(req);

        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
        const visitorData = await Visitor.insertMany([{
            FullName: capitilizeName,
            CompanyName,
            loginTime: finalDate,
            role: "Visitor",
        }]);
        res.status(200).json({
            error: false,
            message: "Guest Details Added Successfully",
            visitorData
        })
    } catch (err) {
        next(err.message)
    }
}

const addTerms = async(req, res, next) => {
    try {
        const {
            DigitalSignature,
            EmailId,
        } = req.body;
        //AMAZON S3 Start 
        const S3type = DigitalSignature.split(';')[0].split('/')[1];
        var matches = DigitalSignature.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            imgResponse = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        imgResponse.type = matches[1];
        imgResponse.data = new Buffer.from(matches[2], 'base64');
        const decodedImg = imgResponse;
        const imageBuffer = decodedImg.data;
        const type = decodedImg.type;
        const extension = mime.getExtension(type);
        const S3imageName = "Signature" + Math.floor(Math.random() * 10000 + 1) + "." + extension;
        const url = req.protocol + '://' + req.get('host');
        const imagePath = url + `/images/Visitor/development/` + S3imageName
        const finalImage = (S3imageName, imageBuffer, 'utf8')
        fs.writeFileSync('./images/Visitor/development/' + S3imageName, imageBuffer, 'utf8');
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `images/visitor/development/${S3imageName}`, // type is not required
            Body: imageBuffer,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${S3type}` // required. Notice the back ticks
        }
        await s3.upload(params, async(error, data) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Signature",
                        response
                    })
                } else {
                    let dateTime
                    const visitorDateAndTime = await Visitor.findOne({
                        _id: req.params.id
                    });
                    dateTime = visitorDateAndTime.loginTime
                    let visitorTime = dateTime.split(", ", 2);
                    const doc = new PDFDocument();
                    doc.pipe(fs.createWriteStream('agreement.pdf'));
                    doc.fontSize(13).text('Non Disclosure Agreement', 220, 30)
                    doc.fontSize(18).text('Digitoonz Media & Entertainment Pvt. Ltd.', 120, 60).underline(120, 58, 335, 27, {
                        color: '#111'
                    })
                    doc.fontSize(12).text('Visitors are welcome to visit during hours of operations. For your safety & security we have the following guidelines: (a) All visitors must sign in through the main reception area located on 2nd floor. (b) All visitors are required to read and acknowledge the Non-Disclosure and Waiver Agreement on their first visit. (c) Smoking/tobacco use is prohibited in our facility. Please use designated outside areas. (d) Videography/Photography is prohibited in our entire facility. (e) In the event of an emergency. Follow signage to the nearest emergency exit.', 60, 100)

                    doc.fontSize(18).text('', 400, 610)
                    image = `./images/Visitor/development/${S3imageName}`
                    doc.image(image, {
                        fit: [180, 180],
                        align: 'left',
                        valign: 'top'
                    });
                    doc.end();

                    if (EmailId !== null) {
                        await Visitor.updateOne({
                            _id: req.params.id
                        }, {
                            $set: {
                                DigitalSignature: data.Location,
                                EmailId
                            }
                        });
                        const template = await fs.readFileSync(agreementEmail, {
                            encoding: 'utf-8'
                        });
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
                            to: [EmailId],
                            subject: 'Digitoonz Agreement Copy',
                            html: template,
                            attachments: [{
                                filename: `agreement.pdf`,
                                path: 'agreement.pdf'
                            }]
                        };
                        if (fs.existsSync(`agreement.pdf`)) {
                            await transporter.sendMail(mailOptions, function(error) {
                                if (error) {} else {}
                            });
                        }
                        res.status(200).json({
                            error: false,
                            message: "Guest Details Added Successfully"
                        })
                    } else {
                        await Visitor.updateOne({
                            _id: req.params.id
                        }, {
                            $set: {
                                DigitalSignature: data.Location
                            }
                        });
                        res.status(200).json({
                            error: false,
                            message: "Guest Details Added Successfully"
                        })
                    }
                }
            })
            //AMAZON S3 Ends 
            // var matches = DigitalSignature.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            //     imgResponse = {};
            // if (matches.length !== 3) {
            //     return new Error('Invalid input string');
            // }
            // imgResponse.type = matches[1];
            // imgResponse.data = new Buffer.from(matches[2], 'base64');
            // const decodedImg = imgResponse;
            // const imageBuffer = decodedImg.data;
            // const type = decodedImg.type;
            // const extension = mime.getExtension(type);
            // const imageName = "Signature" + Math.floor(Math.random() * 100 + 1) + "." + extension;
            // const url = req.protocol + '://' + req.get('host');
            // const imagePath = url + `/images/Visitor/Signature/` + imageName
            // const finalImage = (imageName, imageBuffer, 'utf8')
            // fs.writeFileSync('./images/Visitor/Signature/' + imageName, imageBuffer, 'utf8');
        setTimeout(() => {
            fs.unlinkSync(`./images/Visitor/development/${S3imageName}`);
        }, 5000)
    } catch (err) {
        next(err.message)
    }
}

const notifyEmployee = async(req, res, next) => {
    // using employee email fetch employee details and id
    try {
        const {
            EmployeeId,
            VisitorImage
        } = req.body;
        const S3type = VisitorImage.split(';')[0].split('/')[1];
        var matches = VisitorImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            imgResponse = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        imgResponse.type = matches[1];
        imgResponse.data = new Buffer.from(matches[2], 'base64');
        const decodedImg = imgResponse;
        const imageBuffer = decodedImg.data;
        const type = decodedImg.type;
        const extension = mime.getExtension(type);
        const S3imageName = "Profile" + Math.floor(Math.random() * 10000 + 1) + "." + extension;
        // const url = req.protocol + '://' + req.get('host');
        // const imagePath = url + `/images/Visitor/Profile/` + imageName
        // const finalImage = (imageName, imageBuffer, 'utf8')
        // fs.writeFileSync('./images/Visitor/Profile/' + imageName, imageBuffer, 'utf8');/
        const employeeDetails = await Employee.findOne({
            _id: EmployeeId
        });
        const visitorDetails = await Visitor.findOne({
            _id: req.params.id
        });
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `images/visitor/development/${S3imageName}`, // type is not required
            Body: imageBuffer,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${S3type}` // required. Notice the back ticks
        }

        await s3.upload(params, async(error, data) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    response
                })
            } else {
                await Visitor.updateOne({
                    _id: req.params.id
                }, {
                    $set: {
                        Visited: EmployeeId,
                        HostName: employeeDetails.employeeName,
                        VisitorImage: data.Location
                    }
                });
                var template = await fs.readFileSync(EmployeeNotifyEmail, {
                    encoding: 'utf-8'
                });
                if (template) {
                    const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                    src="${data.Location}"
                    alt="logo">`
                    template = template.replace(new RegExp("(employeeName)", "g"), employeeDetails.employeeName);
                    template = template.replace(new RegExp("(VisitorName)", "g"), visitorDetails.FullName);
                    template = template.replace(new RegExp("(ImageRegs)", "g"), regz);
                }
                // mail service
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
                    to: employeeDetails.email,
                    subject: 'Digitoonz Guest Notification',
                    html: template
                        // attachments: [{
                        //     filename: `${imageName}`,
                        //     path: data.Location
                        // }]
                };
                await transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {} else {}
                });
                res.status(200).json({
                    error: false,
                    message: "Guest Details Added Successfully"
                })
            }
        })
    } catch (err) {
        next(err.message)
    }
}

const notifyCafe = async(req, res, next) => {
    try {
        const {
            refreshmentData
        } = req.body;
        const visitorDetails = await Visitor.findOne({
            _id: req.params.id
        });
        await Visitor.updateOne({
            _id: req.params.id
        }, {
            $set: {
                refreshmentData
            }
        });
        var template = await fs.readFileSync(CafeNotifyEmail, {
            encoding: 'utf-8'
        });
        if (template) {
            if (refreshmentData.cateringFood === null && refreshmentData.cateringBeverages !== null) {
                // let beverage = []
                // refreshmentData.cateringFood.forEach(ele => {
                //     beverage.push(`<p style="text-align: center; margin-bottom: 0px;margin: 0px">${ele.name} <br> Note: ${ele.notes}</p>`);
                // })
                // var Food = beverage.join(" ")
                let data = `
                <p style="text-align: center; margin-bottom: 0px;margin-top: 2px"><strong>Beverages</strong>:${ refreshmentData.cateringBeverages}</p>
                <p style="text-align: center;margin: 0px; margin: 4px"><b>Duration</b>:${refreshmentData.duration}</p>`

                template = template.replace(new RegExp("(BeverageNames)", "g"), data);
            } else if (refreshmentData.cateringBeverages === null && refreshmentData.cateringFood !== null) {
                let beverage = []
                refreshmentData.cateringFood.forEach(ele => {
                    beverage.push(`<p style="text-align: center; margin-bottom: 0px;margin: 0px">${ele.name} <br> Note: ${ele.notes}</p>`);
                })
                var Food = beverage.join(" ")
                let data = `<p style="text-align: center;margin: 0px; padding-top: 5px;"><b>Food</b> </p>
                <p style="text-align: center;margin: 0px; padding: 2px;">${Food}</p>
                <p style="text-align: center;margin: 0px; margin: 4px"><b>Duration</b>:${refreshmentData.duration}</p>`
                template = template.replace(new RegExp("(BeverageNames)", "g"), data);
            } else {
                let beverage = []
                refreshmentData.cateringFood.forEach(ele => {
                    beverage.push(`<p style="text-align: center; margin-bottom: 0px;margin: 0px">${ele.name} <br> Note: ${ele.notes}</p>`);
                })
                var Food = beverage.join(" ")
                let data = `
                <p style="text-align: center; margin-bottom: 0px;margin-top: 2px"> <strong>Beverages</strong>:${ refreshmentData.cateringBeverages}</p>
                <p style="text-align: center;margin: 0px; padding-top: 5px;"><b>Food</b> </p>
                <p style="text-align: center;margin: 0px; padding: 2px;">${Food}</p>
                <p style="text-align: center;margin: 0px; margin: 4px"><b>Duration</b>:${refreshmentData.duration}</p>`
                template = template.replace(new RegExp("(BeverageNames)", "g"), data);
            }

            if (visitorDetails.HostName !== undefined) {
                let dateFormat = new Date(visitorDetails.loginTime)
                let visitorTime = dateFormat.getDate() + "-" + dateFormat.getMonth() + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
                let visitorData = ` <p class="mb-0" style="text-align: center; margin-bottom: 0px">Visitor: <b>${ visitorDetails.FullName}</b> </p>
                <p class="mb-0" style="text-align: center;margin: 0px; ">Arrived at time:<b>${visitorTime}</b></p>
                <p style="text-align: center; margin:0px;margin: 4px">Visiting host : <b>${visitorDetails.HostName}</b> </p>`
                template = template.replace(new RegExp("(visitorData)", "g"), visitorData);
            } else {
                let dateFormat = new Date(visitorDetails.loginTime)
                let visitorTime = dateFormat.getDate() + "-" + dateFormat.getMonth() + "-" + dateFormat.getFullYear() + " " + dateFormat.getHours() + ":" + dateFormat.getMinutes()
                let visitorData = ` <p class="mb-0" style="text-align: center; margin-bottom: 0px">Visitor: <b>${ visitorDetails.FullName}</b> </p>
                <p class="mb-0" style="text-align: center;margin: 0px; ">Arrived at time:<b>${visitorTime}</b></p>`
                template = template.replace(new RegExp("(visitorData)", "g"), visitorData);
            }
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
            to: [process.env.CafeEmailId],
            subject: 'Digitoonz Guest Notification',
            html: template
        };
        await transporter.sendMail(mailOptions, function(error, info) {
            if (error) {} else {}
        });
        res.status(200).json({
            error: false,
            message: "Notified The cafe"
        })
    } catch (err) {
        next(err.message)
    }
}

const addLogout = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        await Visitor.updateOne({
            _id: req.params.id
        }, {
            $set: {
                logoutTime: finalDate
            }
        });
        const isRemember = await RememberVisitor.findOne({
            visitorId: req.params.id
        })
        if (isRemember) {
            await RememberVisitor.updateOne({
                visitorId: req.params.id
            }, {
                $set: {
                    logoutTime: finalDate,
                    lastActivity: {
                        recent: "logout",
                        time: finalDate
                    }
                }
            });
        }

        res.status(200).json({
            error: false,
            message: "Guest Signed Out Successfully",
        })
    } catch (err) {
        next(err.message)
    }
}


const signInVisitor = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        const visitorData = await RememberVisitor.findOne({
            _id: req.params.id
        }, {
            _id: 0,
            visitorId: 0,
            created_at: 0,
            __v: 0,
            logoutTime: 0,
            isPending: 0,
            loginTime: 0,
            refreshmentData: 0,
            reject: 0,
            rememberMe: 0
        });
        const visitorData1 = await Visitor.insertMany([{
            userId: visitorData.userId,
            FullName: visitorData.FullName,
            CompanyName: visitorData.CompanyName,
            location: visitorData.location,
            Category: visitorData.Category,
            Extrafields: visitorData.Extrafields,
            loginTime: finalDate,
            role: visitorData.role,
            Extrafields: visitorData.Extrafields
        }]);
        await RememberVisitor.updateOne({
            _id: req.params.id
        }, {
            $set: {
                loginTime: finalDate,
                lastActivity: {
                    recent: "login",
                    time: finalDate
                },
                visitorId: visitorData1[0]._id
            }
        });

        // .sort({
        //     _id: -1,
        // })
        // .limit(1);
        // await RememberVisitor.updateOne({
        //     visitorId: req.params.id
        // }, {
        //     $set: {
        //         logoutTime: finalDate
        //     }
        // });
        res.status(200).json({
            error: false,
            message: "Guest Signed In Successfully",
            visitorData1
        })
    } catch (err) {
        next(err.message)
    }
}

const multipleLogout = async(req, res, next) => {
    try {
        let finalDate = new Date
        req.body.forEach(async(ele) => {
            await Visitor.updateMany({
                _id: ele,
            }, {
                $set: {
                    logoutTime: finalDate
                }
            });
        });
        res.status(200).json({
            error: false,
            message: "Visitors Signed Out Successfully",
        })
    } catch (err) {
        next(err.message)
    }
}

const addLogoutAllVisitor = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        const userId = await getUserToken(req);
        await Visitor.updateMany({
            userId,
            logoutTime: {
                $exists: false
            }
        }, {
            $set: {
                logoutTime: finalDate
            }
        });
        res.status(200).json({
            error: false
        })
    } catch (err) {
        next(err.message)
    }
}

const remainingLogout = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const data = await Visitor.find({
            userId: userId,
            logoutTime: {
                $exists: false
            }
        });
        res.status(200).json({
            error: false,
            data
        })
    } catch (err) {
        next(err.message)
    }
}

const remainingLogoutByDate = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        var query1 = {
            logoutTime: {
                $exists: false
            }
        }
        var query2 = {
            loginTime: new RegExp('^' + finalDate)
        };
        const visitorData = await Visitor.find({
            $and: [query1, query2],
        });
        res.status(200).json({
            error: false,
            visitorData
        })
    } catch (err) {
        next(err.message)
    }
}

const deleteVisitors = async(req, res, next) => {
    try {
        await Visitor.deleteMany({});
        res.status(200).json({
            error: false,
            message: 'Deleted Successfully'
        })
    } catch (err) {
        next(err.message)
    }
}


const getVisitorForDevice = async(req, res, next) => {
    try {
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const response = await Visitor.findOne({
            _id: req.params.id,
            userId
        });
        res.status(200).json({
            error: false,
            message: 'Deleted Successfully',
            response
        })
    } catch (err) {
        next(err.message)
    }
}

const addVisitorByAdmin = async(req, res, next) => {
    try {
        const {
            FullName,
            CompanyName,
            location,
            visiting,
            HostName,
            Category,
            finalDate,
            Extrafields
            // logoutTime
        } = req.body;
        const userId = await getUserToken(req);

        let freeTrial = await Register.findOne({
            _id: userId
        });
        // let myDate ="Tue Mar 08 2022 16:14:42 GMT+0530 (India Standard Time)"
        const myDate = new Date().toString();

        if (myDate === freeTrial.freeTrial.endDate) {
            res.status(401).json({
                error: true,
                message: "Free trial is completed",
            })

        } else {
            let company = await Devicelocation.findOne({
                _id: location
            });
            let Location = company.locations.officeName

            let employee = await Employee.findOne({
                _id: visiting
            });
            // visiting
            const companySettings = await Settings.findOne({
                userId
            });
            // const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
            const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail

            if (sendVisitorNotificationByEmail) {
                console.log("this");
                var EmployeeTemplate = await fs.readFileSync(EmployeeNotifyEmail, {
                    encoding: 'utf-8'
                });
                if (EmployeeTemplate) {
                    const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png"
                alt="logo">`
                    EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(employeeName)", "g"), employee.employeeName);
                    EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(VisitorName)", "g"), FullName);
                    EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(ImageRegs)", "g"), regz);
                }
                // mail service
                var EmployeeMailTransporter = nodemailer.createTransport({
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
                var EmployeeMailOptions = {
                    from: process.env.Email,
                    to: [employee.email],
                    subject: 'Digitoonz Guest Notification',
                    html: EmployeeTemplate
                };

                await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function(error, info) {
                    if (error) {} else {

                        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
                        const visitorData = await Visitor.insertMany([{
                            FullName: capitilizeName,
                            CompanyName,
                            locationId: location,
                            location: Location,
                            HostName: employee.fullName,
                            Category,
                            loginTime: finalDate,
                            role: "Visitor",
                            userId: userId,
                            Extrafields
                        }]);
                        res.status(200).json({
                            error: false,
                            message: "Guest Details Added Successfully",
                            visitorData
                        })
                    }
                });
            } else {
                let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
                const visitorData = await Visitor.insertMany([{
                    FullName: capitilizeName,
                    CompanyName,
                    locationId: location,
                    location: Location,
                    HostName: employee.fullName,
                    Category,
                    loginTime: finalDate,
                    role: "Visitor",
                    userId: userId,
                    Extrafields
                }]);
                res.status(200).json({
                    error: false,
                    message: "Guest Details Added Successfully",
                    visitorData
                })
            }


        }

    } catch (err) {
        next(err.message)
    }
}


const editVisitorByAdmin = async(req, res, next) => {
    try {
        const visitorId = req.params.id
        const {
            FullName,
            CompanyName,
            location,
            HostName,
            Category,
            finalDate,
            Extrafields
        } = req.body;
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
        let company = await Devicelocation.findOne({
            _id: location
        });
        let Location = company.locations.officeName
        const visitorUpdatedData = await Visitor.findByIdAndUpdate({
            _id: visitorId
        }, {
            FullName: capitilizeName,
            CompanyName,
            locationId: location,
            location: Location,
            HostName,
            Category,
            loginTime: finalDate,
            Extrafields
        }, {
            new: true
        });
        res.status(200).json({
            error: false,
            message: "Guest Details Edited Successfully",
            visitorUpdatedData
        })
    } catch (err) {
        next(err.message)
    }
}


const anonymizeVisitorsByAdmin = async(req, res, next) => {
    try {
        req.body.forEach(async(ele) => {
            await Visitor.updateMany({
                _id: ele,
                logoutTime: {
                    $exists: true
                }
            }, {
                $set: {
                    isAnonymized: true
                }
            });
        });
        res.status(200).json({
            error: false,
            message: "Anonymized Guest Successfully",
        })
    } catch (err) {
        next(err.message)
    }
}

const Evacuation = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        const userId = await getUserToken(req);
        await Visitor.updateMany({
            userId,
            logoutTime: {
                $exists: false
            }
        }, {
            $set: {
                logoutTime: finalDate
            }
        });
        await Employee.updateMany({
            userId,
            logoutTime: {
                $exists: false
            }
        }, {
            $set: {
                logoutTime: finalDate
            }
        });

        res.status(200).json({
            error: false,
            message: 'Evacuated Successfully'
        })

    } catch (err) {
        next(err.message)
    }
}


module.exports = {
    getAllVisitor,
    getAllVisitorIonic,
    addVisitor,
    addTerms,
    notifyEmployee,
    notifyCafe,
    addLogout,
    multipleLogout,
    addLogoutAllVisitor,
    deleteVisitors,
    remainingLogout,
    getTodayVisitor,
    remainingLogoutByDate,
    // addNewVisitor,
    EvacuationData,
    addVisitorByAdmin,
    editVisitorByAdmin,
    anonymizeVisitorsByAdmin,
    Evacuation,
    meargeTimeLine,
    addVisitorInDevice,
    getVisitorForDevice,
    getPendingVisitor,
    checkApproval,
    getRememberedVisitor,
    signInVisitor
}