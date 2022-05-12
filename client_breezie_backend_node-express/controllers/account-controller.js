const Account = require('../model/account-model')
const Register = require('../model/register-model');
const fs = require('fs');
const jwt = require('jsonwebtoken')



function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}



const getAccountDetails = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const accountdetails = await Account.find({
            userId
        });
        res.status(200).json({
            error: false,
            message: "All Account Data",
            accountdetails
        })
    } catch (err) {
        next(err.message)
    }
}

// const addplans = async (req, res, next) => {
//     try {
//         const {
//             starterPlan,
//             businessPlan,
//             enterprisePlan
//         } = req.body;
//         const plans = await Account.insertMany([{
//             plans: {
//                 starterPlan,
//                 businessPlan,
//                 enterprisePlan
//             }
//         }])
//         res.status(200).json({
//             error: false,
//             message: "all data",
//             plans
//         })
//     } catch (err) {
//         next(err.message)
//     }
// }



const getHistory = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const {
            date,
            description,
            transactionStaus,
            total,
            receipttDownload
        } = req.body;

        const planshistory = await Account.insertMany({
            history: {
                date,
                description,
                transactionStaus,
                total
            }
        })
        res.status(200).json({
            error: false,
            message: "Get All History",
            planshistory
        })
        // }
    } catch (err) {
        next(err.message)
    }
}


const getPaymentHistory = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);

        const planshistory = await Account.find({
            userId
        })
        res.status(200).json({
            error: false,
            message: "Get All History",
            response: planshistory
        })
        // }
    } catch (err) {
        next(err.message)
    }
}


const addPaymentMethod = async (req, res, next) => {
    try {
        const {
            cardHoldersName,
            cardDetails,
            savedCard
        } = req.body;
        let plans = await Account.insertMany([{
            userId: req.params.id,
            paymentMethods: {
                cardHoldersName,
                cardDetails,
                savedCard
            }
        }])
        await Register.updateOne({
            _id: req.params.id
        }, {
            $set: {
                accountId: plans[0]._id
            }
        })
        res.status(200).json({
            error: false,
            message: "All data",
            plans
        })
    } catch (err) {
        next(err.message)
    }
}

const editPaymentMethod = async (req, res, next) => {
    try {
        const {
            cardHoldersName,
            cardDetails,
            savedCard
        } = req.body;
        let company = await Register.findOne({
            _id: req.params.id
        });
        let accountId = company.accountId
        await Account.updateOne({
            _id: accountId
        }, {
            $set: {
                paymentMethods: {
                    cardHoldersName,
                    cardDetails,
                    savedCard
                }
            }
        })
        const response = await Account.findOne({
            id: accountId
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

const addAccountDetails = async (req, res, next) => {
    try {
        const {
            accountName,
            billingContactName,
            billingContactEmail,
        } = req.body;
        const userId = await getUserToken(req);
        let company = await Register.findOne({
            _id: userId
        });
        let accountId = company.accountId
        // const setting = await Account.updateMany([{
        //     userId: userId,
        //     settings: {
        //         accountDetails: {
        //             accountName,
        //             billingContactName,
        //             billingContactEmail
        //         },
        //     }
        // }])
        await Account.findByIdAndUpdate({
            _id: accountId
        }, {
            $set: {
                // settings: {
                    accountDetails: {
                        accountName,
                        billingContactName,
                        billingContactEmail
                    },
                    userId:userId

                // }
            }
        })
        // await Register.updateOne({
        //     _id: userId
        // }, {
        //     $set: {
        //         accountId: setting[0]._id
        //     }
        // })
        const response = await Account.findOne({
            _id: accountId
        });
        res.status(200).json({
            error: false,
            message: "details added",
            response
        })
    } catch (err) {
        next(err.message)
    }
}


const addInvoiceAddress = async (req, res, next) => {
    try {
        const {
            hostingRegion,
            address,
            state,
            pincode,
            city,
            phone
        } = req.body;
        const coun = hostingRegion.replace('\t','');

        const userId = await getUserToken(req);
        // const setting = await Account.insertMany([{
        //     userId:userId,
        //     settings: {
        //         invoiceAddress: {
        //             hostingRegion,
        //             address,
        //             state,
        //             pincode,
        //             city,
        //             phone
        //         }
        //     }
        // }])
        // await Register.updateOne({
        //     _id: userId
        // }, {
        //     $set: {
        //         accountId: setting[0]._id
        //     }
        // })

        let company = await Register.findOne({
            _id: userId
        });
        let accountId = company.accountId

        await Account.findByIdAndUpdate({
            _id: accountId
        }, {
            $set: {
                // settings: {
                    invoiceAddress: {
                        hostingRegion:coun,
                        address,
                        state,
                        pincode,
                        city,
                        phone
                    },
                    userId:userId
                // }
            }
        })
        const response = await Account.findOne({
            _id: accountId
        });
        res.status(200).json({
            error: false,
            message: "details added",
            response
        })
    } catch (err) {
        next(err.message)
    }
}


module.exports = {
    getAccountDetails,
    // addplans,
    getHistory,
    addPaymentMethod,
    editPaymentMethod,
    addAccountDetails,
    addInvoiceAddress,
    // editSettingsAccount,
    getPaymentHistory
}