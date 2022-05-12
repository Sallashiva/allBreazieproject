const Razorpay = require("razorpay");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Payment = require("../model/payment-model");
const Employee = require('../model/employee-model');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const Agreement = require('../model/agreement-model');
const Account = require("../model/account-model");
const Register = require("../model/register-model");
const PDFDocument = require('pdfkit');
const {
    plansandpricing,
    addOn
} = require("../model/plansandpricing-model");
const EmployeeNotifyEmail = path.join(__dirname, '../views/email/email_subscribe.html');


function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId;
    return userId;
}

const createPayment = async(req, res, next) => {
    try {
        const {
            currency,
            receipt,
            plan,
            addOns,
            planId,
            currencySelect,
            durations,
            noOfLocation,
            location,
            cateringId,
            smsId,
            deliveryId,
            indianPrice
        } = req.body;
        const userId = await getUserToken(req);
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        let totalAmount = 0;
        let planAmount = 0;
        let deliveryAmount = 0;
        let cateringAmount = 0;
        const planre = await plansandpricing.findOne({
            _id: planId,
        });
        if (planre) {
            const priceSelected = await plansandpricing.findOne({
                _id: planId,
                price: {
                    $elemMatch: {
                        currency: currencySelect
                    }
                }
            }, {
                "price.$": 1
            });
            let planPrice = planre.price

            planAmount +=
                durations === "monthly" ?
                priceSelected.price[0].monthlyprice :
                priceSelected.price[0].annualprice * 12;
            planAmount *= location;
            totalAmount += planAmount
        }
        const delivery = await addOn.findOne({
            _id: deliveryId,
        });
        if (delivery) {
            deliveryAmount +=
                durations === "monthly" ?
                delivery.price[0].monthlyprice :
                delivery.price[0].annualprice * 12;
            deliveryAmount *= location
            totalAmount += deliveryAmount

        }
        const catering = await addOn.findOne({
            _id: cateringId,
        });
        if (catering) {
            cateringAmount +=
                durations === "monthly" ?
                catering.price[0].monthlyprice :
                catering.price[0].annualprice * 12;
            cateringAmount *= location
            totalAmount += cateringAmount

        }

        final = totalAmount * indianPrice
        var options = {
            amount: Math.round(final) * 100,
            currency: "INR",
            payment_capture: 1,
            receipt: "rcptid #11"
        };
        instance.orders.create(options, function(err, order) {
            if (err) {
                next(err);
            }
            if (order) {
                order["userId"] = userId
                res.json({
                    success: true,
                    status: "Order created Successfully",
                    response: order,
                    key: process.env.RAZORPAY_KEY_ID,
                });
            }
        });
    } catch (err) {
        next(err.message);
    }
};

const verification = async(req, res, next) => {
    try {
        const {
            payment,
            name,
            email,
            country,
            address,
            state,
            zip,
            city,
            phone,
            currency,
            receipt,
            plans,
            addOns,
            cateringId,
            currencySelect,
            deliveryId,
            durations,
            indianPrice,
            location,
            recipient_name,
            smsId,
            planId,
            user_name,
            amount,
            recipient_email,
            user_email
        } = req.body;
        const userId = await getUserToken(req);
        // console.log(userId);

        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${payment.razorpay_order_id}|${payment.razorpay_payment_id}`);
        const digest = shasum.digest("hex");

        if (digest !== payment.razorpay_signature)
            return res.status(400).json({
                msg: "Transaction not legit!",
            });

        let totalAmount = 0;
        let planAmount = 0;
        let deliveryAmount = 0;
        let cateringAmount = 0;
        const planre = await plansandpricing.findOne({
            _id: planId,
        });
        if (planre) {
            const priceSelected = await plansandpricing.findOne({
                _id: planId,
                price: {
                    $elemMatch: {
                        currency: currencySelect
                    }
                }
            }, {
                "price.$": 1
            });
            // const planprice = planresp[0].price.find(
            //     (i) => i._id.toString() === plan.currencyId
            // );
            planAmount +=
                durations === "monthly" ?
                priceSelected.price[0].monthlyprice :
                priceSelected.price[0].annualprice * 12;
            planAmount *= location;
            totalAmount += planAmount
        }
        const delivery = await addOn.findOne({
            _id: deliveryId,
        });
        const catering = await addOn.findOne({
            _id: cateringId,
        });
        if (delivery) {
            deliveryAmount +=
                durations === "monthly" ?
                delivery.price[0].monthlyprice :
                delivery.price[0].annualprice * 12;
            deliveryAmount *= location
            totalAmount += deliveryAmount
        }
        if (catering) {
            cateringAmount +=
                durations === "monthly" ?
                catering.price[0].monthlyprice :
                catering.price[0].annualprice * 12;
            cateringAmount *= location
            totalAmount += cateringAmount
        }
        // let addOnPrice = null;

        // if (addOns && addOns.length > 0) {
        //     const addrs = await addOn.find({})
        //     addOnPrice = addrs.filter((o1) =>
        //         addOns.some((o2) => o1.addOnId === o2.addOnId)
        //     )
        // }

        // const selectedPlan = planresp[0].price.find(o => o.currency === currency)

        // const modifiedAddons = addOnPrice.map(i => {
        //     const selectedAddOn = i.price.find(o => o.currency === currency)
        //     return {
        //         addOnId: i.addOnId,
        //         price: plans.planType === 'monthly' ? selectedAddOn.monthlyprice : selectedAddOn.annualprice
        //     }
        // })
        // const newPayment = {}
        // newPayment["userId"] = userId

        const newPayment = {
            userId,
            orderId: payment.razorpay_order_id,
            paymentId: payment.razorpay_payment_id,
            signatureId: payment.razorpay_signature,
            name: user_name,
            email: recipient_email,
            country,
            locations: location,
            // street:address.street,
            // state:address.state,
            // zip:address.zip,
            // city:address.city,
            phone,
            amount: totalAmount,
            currency: currencySelect,
            receipt,

            // addOns: modifiedAddons,
            status: "Success",
        };
        newPayment["address"] = {
            street: address.street,
            state: address.state,
            zip: address.zip,
            city: address.city,
        }
        const d = new Date()
        if (durations === 'monthly')
            d.setMonth(d.getMonth() + 1)
        else
            d.setFullYear(d.getFullYear() + 1)

        if (planre) {
            newPayment["plans"] = {
                planId,
                locations: location,
                planName: planre.name,
                price: planAmount,
                duration: durations,
                startDate: new Date(),
                endDate: new Date(d),
            }
        }
        if (delivery) {
            newPayment["deliveryAddOn"] = {
                planId: deliveryId,
                planName: delivery.name,
                price: deliveryAmount,
                duration: durations,
                startDate: new Date(),
                endDate: new Date(d),
            }
        }
        if (catering) {
            newPayment["CateringAddOn"] = {
                planId,
                planName: catering.name,
                price: cateringAmount,
                duration: durations,
                startDate: new Date(),
                endDate: new Date(d),
            }
        }

        await Account.updateOne({
            userId,
        }, {
            $push: {
                history: newPayment,
            },
        });
        // console.log(newPayment);

        if (planre) {
            await Register.updateOne({
                _id: userId
            }, {
                $set: {
                    plan: {
                        planName: planre.name,
                        startDate: new Date(),
                        endDate: new Date(d),
                        price: planAmount,
                        currency: currencySelect,
                        planId: planId,
                        duration: durations,
                        location: location
                    }
                }
            })
        }
        if (delivery) {
            await Register.updateOne({
                _id: userId
            }, {
                $set: {
                    deliveryAddOn: {
                        planName: delivery.name,
                        startDate: new Date(),
                        endDate: new Date(d),
                    }
                }
            })
        }
        if (catering) {
            await Register.updateOne({
                _id: userId
            }, {
                $set: {
                    CateringAddOn: {
                        planName: catering.name,
                        startDate: new Date(),
                        endDate: new Date(d),
                    }
                }
            })
        }
        // console.log(catering);

        const payResponse = await Payment.updateMany({
            userId,
        }, {
            $set: newPayment,
        }, {
            upsert: true,
        });


        const employeeDetails = await Employee.findOne({
            userId: userId
        });
        //pdfkit
        let pdfDoc = new PDFDocument();
        let receiptId = newPayment.orderId
        pdfDoc.fontSize(10).text(`${receiptId}`, 50, 250);

        if (newPayment.CateringAddOn !== undefined && newPayment.deliveryAddOn === undefined) {
            let endData = newPayment.CateringAddOn.endDate
            let receiptEndDate = endData.toDateString();
            let unitPrice = newPayment.CateringAddOn.price
            let startData = newPayment.CateringAddOn.startDate
            let receiptDate = startData.toDateString();
            let quantity = newPayment.locations
            let bothPrice = quantity * unitPrice
            pdfDoc.fontSize(10).text('Breazie Catering ', 50, 460)
            pdfDoc.fontSize(10).text(`${bothPrice}`, 430, 460, { align: 'right' });
            pdfDoc.fontSize(10).text(`${receiptDate}`, 430, 250, { align: 'right' });
            pdfDoc.fontSize(10).text(`${receiptDate} – ${receiptEndDate}`, 50, 475)
            pdfDoc.fontSize(10).text(`${quantity}`, 300, 460)
            pdfDoc.fontSize(10).text(`${unitPrice}`, 340, 460)

            let EmpName = employeeDetails.fullName
            let Amount = newPayment.amount

            pdfDoc.pipe(fs.createWriteStream('Receipt.pdf'));
            pdfDoc.image('images/Visitor/development/Mask Group 1@2x.png', 50, 15, {
                fit: [120, 30],
                align: 'left',
            });
            console.log("lastDate");
            pdfDoc.fontSize(16).text('RECEIPT', 250, 30);
            pdfDoc.fontSize(16).text('RECEIPT', 250, 30)
            pdfDoc.fontSize(10).text('Breazie', 400, 20, { align: 'right' })
            pdfDoc.fontSize(10).text('C29, Sector 6, Noida 201301,', 400, 35, { align: 'right' })
            pdfDoc.fontSize(10).text('India', 400, 50, { align: 'right' });

            pdfDoc.underline(20, 58, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('RECEIPT TO', 50, 100)
            pdfDoc.fontSize(10).text('TOTAL AMOUNT USD', 430, 100, { align: 'right' });

            pdfDoc.fontSize(16).text(`${EmpName}`, 50, 120)
                .fontSize(10).text('Bangalore', 50, 140)
                .fontSize(10).text('karnataka 560085', 50, 155)
                .fontSize(10).text('India', 50, 170)

            pdfDoc.underline(20, 180, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('RECEIPT NO', 50, 230)
            pdfDoc.fontSize(10).text('RECEIPT DATE', 430, 230, { align: 'right' })
                .fontSize(10).text('GST NUMBER', 50, 270)
                .fontSize(10).text('09AAECD1112D1ZC', 50, 285);

            pdfDoc.underline(20, 300, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('DESCRIPTION', 50, 340)
                .fontSize(10).text('QTY UNIT PRICE ', 300, 340)
            pdfDoc.fontSize(10).text('AMOUNT USD', 430, 340, { align: 'right' })
            pdfDoc.fontSize(10).font('Helvetica-Bold').text('Breazie AddOns', 50, 440);
            pdfDoc.fontSize(10).font('Helvetica-Bold').fontSize(10).text('Subscription Fees', 50, 360);
            pdfDoc.underline(20, 560, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(12).text('SUBTOTAL', 400, 600)
            pdfDoc.text(`$${Amount}`, 470, 600, { align: 'right' })
            pdfDoc.underline(400, 590, 180, 27, {
                color: '#111'
            })
            pdfDoc.text('TOTAL PAID', 400, 630)
            pdfDoc.fontSize(25).text(`$${Amount}`, 470, 620, { align: 'right' });

            pdfDoc.underline(20, 650, 575, 27, {
                color: '#111'
            });
            pdfDoc.fontSize(35).fillColor('blue').text(`$${Amount}`, 430, 150, { align: 'right' });

            pdfDoc.end();

            var EmployeeTemplate = await fs.readFileSync(EmployeeNotifyEmail, {
                encoding: 'utf-8'
            });
            if (EmployeeTemplate) {
                const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                    src=""
                    alt="logo">`
                EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(employeeName)", "g"), employeeDetails.fullName);
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
                to: 'dudekulaabbas16@gmail.com',
                subject: 'Digitoonz Payment',
                html: EmployeeTemplate,
                attachments: [{
                    filename: `Receipt.pdf`,
                    path: 'Receipt.pdf'
                }]
            };

            // if (fs.existsSync(`Receipt.pdf`)) {
            await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function(error, info) {
                    if (!error) {
                        res.json({
                            message: "Payment Successfull",
                            error: false,
                            payResponse,
                        });
                        fs.unlinkSync(`Receipt.pdf`);
                    }
                })
                // }
        } else if (newPayment.deliveryAddOn !== undefined && newPayment.CateringAddOn === undefined) {
            let endDeliveryDate = newPayment.deliveryAddOn.endDate
            let receiptyEndDate = endDeliveryDate.toDateString();
            let unitPrice = newPayment.deliveryAddOn.price
            let startingData = newPayment.deliveryAddOn.startDate
            let receiptingDate = startingData.toDateString();
            let quantity = newPayment.locations
            let bothPrice = quantity * unitPrice

            pdfDoc.fontSize(10).text(`${bothPrice}`, 430, 460, { align: 'right' });
            pdfDoc.fontSize(10).text('Breazie Delivery ', 50, 460);
            pdfDoc.fontSize(10).text(`${receiptingDate}`, 430, 250, { align: 'right' });
            pdfDoc.fontSize(10).text(`${receiptingDate} – ${receiptyEndDate}`, 50, 475);
            pdfDoc.fontSize(10).text(`${quantity}`, 300, 460);
            pdfDoc.fontSize(10).text(`${unitPrice}`, 340, 460);

            let EmpName = employeeDetails.fullName
            let Amount = newPayment.amount

            pdfDoc.pipe(fs.createWriteStream('Receipt.pdf'));
            pdfDoc.image('images/Visitor/development/Mask Group 1@2x.png', 50, 15, {
                fit: [120, 30],
                align: 'left',
            });
            console.log("lastDate");
            pdfDoc.fontSize(16).text('RECEIPT', 250, 30);
            pdfDoc.fontSize(16).text('RECEIPT', 250, 30)
            pdfDoc.fontSize(10).text('Breazie', 400, 20, { align: 'right' })
            pdfDoc.fontSize(10).text('C29, Sector 6, Noida 201301,', 400, 35, { align: 'right' })
            pdfDoc.fontSize(10).text('India', 400, 50, { align: 'right' });

            pdfDoc.underline(20, 58, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('RECEIPT TO', 50, 100)
            pdfDoc.fontSize(10).text('TOTAL AMOUNT USD', 430, 100, { align: 'right' });

            pdfDoc.fontSize(16).text(`${EmpName}`, 50, 120)
                .fontSize(10).text('Bangalore', 50, 140)
                .fontSize(10).text('karnataka 560085', 50, 155)
                .fontSize(10).text('India', 50, 170)

            pdfDoc.underline(20, 180, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('RECEIPT NO', 50, 230)
            pdfDoc.fontSize(10).text('RECEIPT DATE', 430, 230, { align: 'right' })
                .fontSize(10).text('GST NUMBER', 50, 270)
                .fontSize(10).text('09AAECD1112D1ZC', 50, 285);

            pdfDoc.underline(20, 300, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('DESCRIPTION', 50, 340)
                .fontSize(10).text('QTY UNIT PRICE ', 300, 340)
            pdfDoc.fontSize(10).text('AMOUNT USD', 430, 340, { align: 'right' })
            pdfDoc.fontSize(10).font('Helvetica-Bold').text('Breazie AddOns', 50, 440);
            pdfDoc.fontSize(10).font('Helvetica-Bold').fontSize(10).text('Subscription Fees', 50, 360);
            pdfDoc.underline(20, 560, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(12).text('SUBTOTAL', 400, 600)
            pdfDoc.text(`$${Amount}`, 470, 600, { align: 'right' })
            pdfDoc.underline(400, 590, 180, 27, {
                color: '#111'
            })
            pdfDoc.text('TOTAL PAID', 400, 630)
            pdfDoc.fontSize(25).text(`$${Amount}`, 470, 620, { align: 'right' });

            pdfDoc.underline(20, 650, 575, 27, {
                color: '#111'
            });
            pdfDoc.fontSize(35).fillColor('blue').text(`$${Amount}`, 430, 150, { align: 'right' });

            pdfDoc.end();

            var EmployeeTemplate = await fs.readFileSync(EmployeeNotifyEmail, {
                encoding: 'utf-8'
            });
            if (EmployeeTemplate) {
                const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                    src=""
                    alt="logo">`
                EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(employeeName)", "g"), employeeDetails.fullName);
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
                to: 'dudekulaabbas16@gmail.com',
                subject: 'Digitoonz Payment',
                html: EmployeeTemplate,
                attachments: [{
                    filename: `Receipt.pdf`,
                    path: 'Receipt.pdf'
                }]
            };

            // if (fs.existsSync(`Receipt.pdf`)) {
            await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function(error, info) {
                    if (!error) {
                        res.json({
                            message: "Payment Successfull",
                            error: false,
                            payResponse,
                        });
                        fs.unlinkSync(`Receipt.pdf`);
                    }
                })
                // }

        } else {
            let endData = newPayment.CateringAddOn.endDate
            let receiptEndDate = endData.toDateString();
            // console.log(receiptEndDate);
            let unitPriceValue = newPayment.CateringAddOn.price
            let startData = newPayment.CateringAddOn.startDate
            let receiptDate = startData.toDateString();
            let quantityValue = newPayment.locations
            let bothPriceValue = quantityValue * unitPriceValue
            pdfDoc.fontSize(10).text('Breazie Catering ', 50, 500)
            pdfDoc.fontSize(10).text(`${bothPriceValue}`, 430, 500, { align: 'right' });
            pdfDoc.fontSize(10).text(`${receiptDate}`, 430, 250, { align: 'right' });
            pdfDoc.fontSize(10).text(`${receiptDate} – ${receiptEndDate}`, 50, 475)
            pdfDoc.fontSize(10).text(`${quantityValue}`, 300, 500)
            pdfDoc.fontSize(10).text(`${unitPriceValue}`, 340, 500)

            // delivery
            let endDeliveryDate = newPayment.deliveryAddOn.endDate
            let receiptyEndDate = endDeliveryDate.toDateString();
            let unitPrice = newPayment.deliveryAddOn.price
            let startingData = newPayment.deliveryAddOn.startDate
            let receiptingDate = startingData.toDateString();
            let quantity = newPayment.locations
            let bothPriceData = quantity * unitPrice

            pdfDoc.fontSize(10).text(`${bothPriceData}`, 430, 460, { align: 'right' });
            pdfDoc.fontSize(10).text('Breazie Delivery ', 50, 460);
            pdfDoc.fontSize(10).text(`${receiptingDate}`, 430, 250, { align: 'right' });
            pdfDoc.fontSize(10).text(`${receiptingDate} – ${receiptyEndDate}`, 50, 475);
            pdfDoc.fontSize(10).text(`${quantity}`, 300, 460);
            pdfDoc.fontSize(10).text(`${unitPrice}`, 340, 460);

            let EmpName = employeeDetails.fullName
            let Amount = bothPriceData + bothPriceValue
            console.log(Amount);

            pdfDoc.pipe(fs.createWriteStream('Receipt.pdf'));
            pdfDoc.image('images/Visitor/development/Mask Group 1@2x.png', 50, 15, {
                fit: [120, 30],
                align: 'left',
            });
            pdfDoc.fontSize(16).text('RECEIPT', 250, 30);
            pdfDoc.fontSize(16).text('RECEIPT', 250, 30)
            pdfDoc.fontSize(10).text('Breazie', 400, 20, { align: 'right' })
            pdfDoc.fontSize(10).text('C29, Sector 6, Noida 201301,', 400, 35, { align: 'right' })
            pdfDoc.fontSize(10).text('India', 400, 50, { align: 'right' });

            pdfDoc.underline(20, 58, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('RECEIPT TO', 50, 100)
            pdfDoc.fontSize(10).text('TOTAL AMOUNT USD', 430, 100, { align: 'right' });

            pdfDoc.fontSize(16).text(`${EmpName}`, 50, 120)
                .fontSize(10).text('Bangalore', 50, 140)
                .fontSize(10).text('karnataka 560085', 50, 155)
                .fontSize(10).text('India', 50, 170)

            pdfDoc.underline(20, 180, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('RECEIPT NO', 50, 230)
            pdfDoc.fontSize(10).text('RECEIPT DATE', 430, 230, { align: 'right' })
                .fontSize(10).text('GST NUMBER', 50, 270)
                .fontSize(10).text('09AAECD1112D1ZC', 50, 285);

            pdfDoc.underline(20, 300, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(10).text('DESCRIPTION', 50, 340)
                .fontSize(10).text('QTY UNIT PRICE ', 300, 340)
            pdfDoc.fontSize(10).text('AMOUNT USD', 430, 340, { align: 'right' })
            pdfDoc.fontSize(10).font('Helvetica-Bold').text('Breazie AddOns', 50, 440);
            pdfDoc.fontSize(10).font('Helvetica-Bold').fontSize(10).text('Subscription Fees', 50, 360);
            pdfDoc.underline(20, 560, 575, 27, {
                color: '#111'
            });

            pdfDoc.fontSize(12).text('SUBTOTAL', 400, 600)
            pdfDoc.text(`$${Amount}`, 470, 600, { align: 'right' })
            pdfDoc.underline(400, 590, 180, 27, {
                color: '#111'
            })
            pdfDoc.text('TOTAL PAID', 400, 630)
            pdfDoc.fontSize(25).text(`$${Amount}`, 470, 620, { align: 'right' });

            pdfDoc.underline(20, 650, 575, 27, {
                color: '#111'
            });
            pdfDoc.fontSize(35).fillColor('blue').text(`$${Amount}`, 430, 150, { align: 'right' });

            pdfDoc.end();

            var EmployeeTemplate = await fs.readFileSync(EmployeeNotifyEmail, {
                encoding: 'utf-8'
            });
            // console.log(EmployeeTemplate);
            if (EmployeeTemplate) {
                const regz = `<img style="border-radius: 99%; width: 200px; height: 200px;"
                    src=""
                    alt="logo">`
                EmployeeTemplate = EmployeeTemplate.replace(new RegExp("(employeeName)", "g"), employeeDetails.fullName);
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
                to: 'dudekulaabbas16@gmail.com',
                subject: 'Digitoonz Payment',
                html: EmployeeTemplate,
                attachments: [{
                    filename: `Receipt.pdf`,
                    path: 'Receipt.pdf'
                }]
            };

            // if (fs.existsSync(`Receipt.pdf`)) {
            await EmployeeMailTransporter.sendMail(EmployeeMailOptions, async function(error, info) {
                    if (!error) {
                        res.json({
                            message: "Payment Successfull",
                            error: false,
                            payResponse,
                        });
                        fs.unlinkSync(`Receipt.pdf`);
                    }
                })
                // }
        }

    } catch (err) {
        next(err.message);
    }
};

module.exports = {
    createPayment,
    verification,
};