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

function deviceToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    return verifiedUser
}

async function createSignature(req) {
    const {
        DigitalSignature,
    } = req.body;

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
    const data = {}
    data['Signaturetype'] = Signaturetype
    data['SignatureS3imageName'] = SignatureS3imageName
    data['SignatureimageBuffer'] = SignatureimageBuffer
    data['SignatureS3type'] = SignatureS3type
    return data
}

async function createDateAndTime(req) {
    const {
        finalDate,
    } = req.body;
    const time = new Date(finalDate)
    const mth = time.getMonth() + 1
    const AgreementDate = time.getDate() + "/" + mth + "/" + time.getFullYear()
    const AgreementTime = time.getHours() + ":" + time.getMinutes()+ ":" + time.getSeconds()
    const dateAndTime = {}
    dateAndTime["AgreementDate"] = AgreementDate
    dateAndTime["AgreementTime"] = AgreementTime
    return dateAndTime
}


// 2
const addVisitorWithoutImage = async (req, res, next) => {
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
        const verifiedUser = await deviceToken(req);

        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, SignatureResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    response
                })
            } else {
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
                    subject: 'Digitoonz Visitor Notification',
                    html: EmployeeTemplate
                };

                await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function (error, info) {
                    if (error) {} else {

                        // Agreement Email For Visitor
                        if (EmailId) {
                            const agreementData = await Agreement.findOne({
                                userId,
                                isSelected: true
                            });
                            const html = agreementData.agreementData
                            const html2 = `<div style='float:right'>
                                                <div>
                                                    <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px"> </div>
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

                            pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                if (err) return
                            });

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
                                await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                            message: "Visitor Details Added Successfully",
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
                                message: "Visitor Details Added Successfully",
                                visitorData,
                                RememberVisitorData
                            })
                        }
                    }
                });
            }
        })
    } catch (err) {
        next(err.message)
    }
}

const addVisitorWithImage = async (req, res, next) => {
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId
    
        const companySettings = await Settings.findOne({
            userId
        });
        let company = await Devicelocation.findOne({
            _id: locationId
        });
        let locationOfficeName = company.locations.officeName
        const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
        const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
        
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            } else {
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

                await s3.upload(VisitorImageParams, async (error, VisitorResponse) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo"
                        })
                    } else {
                        await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                            if (error) {
                                res.status(404).json({
                                    error: true,
                                    message: "Error in Uploading Photo",
                                    response
                                })
                            } else {
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
                                            subject: 'Digitoonz Visitor Notification',
                                            html: EmployeeTemplate
                                        };

                                        await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function (error, info) {
                                            if (error) {} else {

                                                // Agreement Email For Visitor
                                                if (EmailId) {
                                                    const agreementData = await Agreement.findOne({
                                                        userId,
                                                        isSelected: true
                                                    });
                                                    const html = agreementData.agreementData
                                                    const html2 = `<div style='float:right'>
                                                                    <div>
                                                                        <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px"> </div>
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

                                                    pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                                        if (err) return
                                                    });

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
                                                        await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                                    message: "Visitor Details Added Successfully",
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
                                                        message: "Visitor Details Added Successfully",
                                                        visitorData,
                                                        RememberVisitorData
                                                    })
                                                }
                                            }
                                        });
                                    } else {
                                        if (EmailId) {
                                            const agreementData = await Agreement.findOne({
                                                userId,
                                                isSelected: true
                                            });
                                            const html = agreementData.agreementData
                                            const html2 = `<div style='float:right'>
                                                                <div>
                                                                    <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px"> </div>
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

                                            pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                                if (err) return
                                            });

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
                                                await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                            message: "Visitor Details Added Successfully",
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
                                                message: "Visitor Details Added Successfully",
                                                visitorData,
                                                RememberVisitorData
                                            })
                                        }
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
                                        message: "Visitor Details Added Successfully",
                                        visitorData,
                                        RememberVisitorData
                                    })
                                    // }
                                }
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        next(err.message)
    }
}


const withVisitingWithoutImage = async  (req, res, next) => {
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
    } catch (err) {
        next(err.message)
    }
}
const addVisitingWithEmail = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId
    const companySettings = await Settings.findOne({
        userId
    });

    let company = await Devicelocation.findOne({
        _id: locationId
    });

    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const dateTime = await createDateAndTime(req)
        const data = await createSignature(req)

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);

        // S3 Bucket Visitor Signature Params
        const Signatureparams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `images/visitor/development/${data.SignatureS3imageName}`, // type is not required
            Body: data.SignatureimageBuffer,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${data.SignatureS3type}` // required. Notice the back ticks
        }

        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            }
            await s3.upload(Signatureparams, async (error, SignatureResponse) => {
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

                    pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                        if (err) return
                    });

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
                                subject: 'Digitoonz Visitor Notification',
                                html: EmployeeTemplate
                            };

                            await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function (error, info) {
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
                                            await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                        message: "Visitor Details Added Successfully",
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
                                            message: "Visitor Details Added Successfully",
                                            visitorData,
                                            RememberVisitorData
                                        })
                                    }
                                }
                            });
                        } else {
                            if (EmailId) {
                                const agreementData = await Agreement.findOne({
                                    userId,
                                    isSelected: true
                                });
                                const html = agreementData.agreementData
                                const html2 = `<div style='float:right'>
                                                                <div>
                                                                    <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px"> </div>
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

                                pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                    if (err) return
                                });

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
                                    await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                message: "Visitor Details Added Successfully",
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
                                    message: "Visitor Details Added Successfully",
                                    visitorData,
                                    RememberVisitorData
                                })
                            }
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
                            message: "Visitor Details Added Successfully",
                            visitorData,
                            RememberVisitorData
                        })
                        // }
                    }
                }
            })
            // }
            // })
            // }
        })
    } catch (err) {
        next(err.message)
    }

}

const addPhotoWithEmail = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId

    const companySettings = await Settings.findOne({
        userId
    });
    let company = await Devicelocation.findOne({
        _id: locationId
    });
    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            } else {
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

                await s3.upload(VisitorImageParams, async (error, VisitorResponse) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo"
                        })
                    } else {
                        await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                            if (error) {
                                res.status(404).json({
                                    error: true,
                                    message: "Error in Uploading Photo",
                                    response
                                })
                            } else {
                                if (EmailId) {
                                    const agreementData = await Agreement.findOne({
                                        userId,
                                        isSelected: true
                                    });
                                    const html = agreementData.agreementData
                                    const html2 = `<div style='float:left'>
                                                        <div>
                                                            <img src="${SignatureResponse.Location}" alt="" height="150px" width="300px"> </div>
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

                                    pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                        if (err) return
                                    });

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
                                        await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                    message: "Visitor Details Added Successfully",
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
                                        message: "Visitor Details Added Successfully",
                                        visitorData,
                                        RememberVisitorData
                                    })
                                }
                                // }
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        next(err.message)
    }

}

const addVisitingWithPhoto = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId

    const companySettings = await Settings.findOne({
        userId
    });
    let company = await Devicelocation.findOne({
        _id: locationId
    });
    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            } else {
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

                await s3.upload(VisitorImageParams, async (error, VisitorResponse) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo"
                        })
                    } else {
                        await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                            if (error) {
                                res.status(404).json({
                                    error: true,
                                    message: "Error in Uploading Photo",
                                    response
                                })
                            } else {
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
                                            subject: 'Digitoonz Visitor Notification',
                                            html: EmployeeTemplate
                                        };

                                        await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function (error, info) {
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
                                                    message: "Visitor Details Added Successfully",
                                                    visitorData,
                                                    RememberVisitorData
                                                })
                                            }
                                            // }
                                        });
                                    } else {
                                        if (EmailId) {
                                            const agreementData = await Agreement.findOne({
                                                userId,
                                                isSelected: true
                                            });
                                            const html = agreementData.agreementData
                                            const html2 = `<div style='float:right'>
                                                                <div>
                                                                    <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px"> </div>
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

                                            pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                                if (err) return
                                            });

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
                                                await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                            message: "Visitor Details Added Successfully",
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
                                                message: "Visitor Details Added Successfully",
                                                visitorData,
                                                RememberVisitorData
                                            })
                                        }
                                    }

                                } else {

                                    if (EmailId) {
                                        const agreementData = await Agreement.findOne({
                                            userId,
                                            isSelected: true
                                        });
                                        const html = agreementData.agreementData
                                        const html2 = `<div style='float:left'>
                                                        <div>
                                                            <img src="${SignatureResponse.Location}" alt="" height="150px" width="300px"> </div>
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

                                        pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                            if (err) return
                                        });

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
                                            await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                        message: "Visitor Details Added Successfully",
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
                                            message: "Visitor Details Added Successfully",
                                            visitorData,
                                            RememberVisitorData
                                        })
                                    }
                                }
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        next(err.message)
    }


}

const addVisitingOnly = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId

    const companySettings = await Settings.findOne({
        userId
    });
    let company = await Devicelocation.findOne({
        _id: locationId
    });
    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            }

            await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Photo",
                        response
                    })
                } else {
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
                                subject: 'Digitoonz Visitor Notification',
                                html: EmployeeTemplate
                            };

                            await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function (error, info) {
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
                                        message: "Visitor Details Added Successfully",
                                        visitorData,
                                        RememberVisitorData
                                    })
                                }
                                // }
                            });
                        } else {
                            if (EmailId) {
                                const agreementData = await Agreement.findOne({
                                    userId,
                                    isSelected: true
                                });
                                const html = agreementData.agreementData
                                const html2 = `<div style='float:right'>
                                                                <div>
                                                                    <img src="${SignatureResponse.Location}" alt="" height="300px" width="300px"> </div>
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

                                pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                                    if (err) return
                                });

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
                                    await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                                message: "Visitor Details Added Successfully",
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
                                    message: "Visitor Details Added Successfully",
                                    visitorData,
                                    RememberVisitorData
                                })
                            }
                        }

                    }

                }
            })
        })
    } catch (err) {
        next(err.message)
    }
}

const addEmailOnly = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId

    const companySettings = await Settings.findOne({
        userId
    });
    let company = await Devicelocation.findOne({
        _id: locationId
    });
    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            }
            await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Photo",
                        response
                    })
                } else {
                    if (EmailId) {
                        const agreementData = await Agreement.findOne({
                            userId,
                            isSelected: true
                        });
                        const html = agreementData.agreementData
                        const html2 = `<div style='float:left'>
                                                        <div>
                                                            <img src="${SignatureResponse.Location}" alt="" height="150px" width="300px"> </div>
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

                        pdf.create(finalResult, options).toFile('agreement.pdf', function (err, res) {
                            if (err) return
                        });

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
                            await VisitorMailTransporter.sendMail(VisitorMailOptions, async function (error) {
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
                                        message: "Visitor Details Added Successfully",
                                        visitorData,
                                        RememberVisitorData
                                    })
                                }
                            });

                        }
                    }
                }
            })
        })
    } catch (err) {
        next(err.message)
    }

}

const addPhotoOnly = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId

    const companySettings = await Settings.findOne({
        userId
    });
    let company = await Devicelocation.findOne({
        _id: locationId
    });
    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            } else {
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

                await s3.upload(VisitorImageParams, async (error, VisitorResponse) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo"
                        })
                    } else {
                        await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                            if (error) {
                                res.status(404).json({
                                    error: true,
                                    message: "Error in Uploading Photo",
                                    response
                                })
                            } else {

                                {
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
                                        message: "Visitor Details Added Successfully",
                                        visitorData,
                                        RememberVisitorData
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        next(err.message)
    }


}

const addVisitorDataOnly = async (req, res, next) => {
    const verifiedUser = await deviceToken(req);
    const userId = verifiedUser.userId
    const locationId = verifiedUser.locationId

    const companySettings = await Settings.findOne({
        userId
    });
    let company = await Devicelocation.findOne({
        _id: locationId
    });
    let locationOfficeName = company.locations.officeName
    const rememberVisitorSetting = companySettings.visitorSetting.rememberVisitor
    const sendVisitorNotificationByEmail = companySettings.visitorSetting.sendVisitorNotificationByEmail
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
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        const companySettings = await Settings.findOne({
            userId
        });
        const isPending = companySettings.visitorSetting.approvalCentralRecipient.isAprroved
        let capitilizeName = FullName.charAt(0).toUpperCase() + FullName.slice(1);
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
        await s3.upload(Signatureparams, async (error, VisitorResponse) => {
            if (error) {
                res.status(404).json({
                    error: true,
                    message: "Error in Uploading Photo",
                    VisitorResponse
                })
            }
            await s3.upload(Signatureparams, async (error, SignatureResponse) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Photo",
                        response
                    })
                } else {

                    // {
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
                        message: "Visitor Details Added Successfully",
                        visitorData,
                        RememberVisitorData
                    })
                }
            })
        })
    } catch (err) {
        next(err.message)
    }


}




module.exports = {
    addVisitorWithoutImage,
    addVisitorWithImage,
    addVisitingWithEmail,
    addPhotoWithEmail,
    addVisitingWithPhoto,
    addVisitingOnly,
    addEmailOnly,
    addPhotoOnly,
    addVisitorDataOnly

}