const Agreement = require('../model/agreement-model')
const Register = require('../model/register-model');

const jwt = require('jsonwebtoken')
const fs = require('fs');

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}

const getAllAgreement = async (req, res, next) => {
    try {
        const agreement = await Agreement.find()
        res.status(200).json({
            error: false,
            agreement
        })
    } catch (err) {
        next(err.message)
    }
}

const getCompanyAgreement = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const agreement = await Agreement.find({
            userId,
            // isSelected: true
        });
        res.status(200).json({
            error: false,
            response: agreement
        })
    } catch (err) {
        next(err.message)
    }
}

const addNewAgreement = async (req, res, next) => {
    try {
        const {
            agreementData,
            agreementName
        } = req.body

        const userId = await getUserToken(req);
        await Agreement.updateMany({
            userId
        }, {
            $set: {
                isSelected: false
            }
        });
        let newAgreement = await Agreement.insertMany([{
            userId,
            agreementData,
            agreementName,
            isSelected: true
        }])
        await Register.updateOne({
            _id: userId
        }, {
            $push: {
                agreementId: newAgreement[0]._id
            }
        })
        res.status(200).json({
            error: false,
            message: "new agreement added",
            response: newAgreement
        })
    } catch (err) {
        next(err.message)
    }
}

const editAgreement = async (req, res, next) => {
    try {
        const {
            agreementData,
            agreementName
        } = req.body
        const userId = await getUserToken(req);
        await Agreement.updateMany({
            userId
        }, {
            $set: {
                isSelected: false
            }
        });
        await Agreement.updateOne({
            _id: req.params.id,
            userId
        }, {
            $set: {
                agreementData,
                agreementName,
                isSelected: true
            }
        })

        let newAgreement = await Agreement.find({
            _id: req.params.id
        })

        res.status(200).json({
            error: false,
            message: "new agreement added",
            response: newAgreement
        })
    } catch (err) {
        next(err.message)
    }
}

const editaAgreement = async (req, res, next) => {
    try {
        if (req.file !== null) {
            const url = req.protocol + '://' + req.get('host');
            const pdfPath = url + `/pdf/agreement` + req.file.originalname

            let company = await Register.findOne({
                _id: req.params.id
            });
            let agreementId = company.agreementId

            await Agreement.updateOne({
                id: agreementId
            }, {
                $set: {
                    pdf: pdfPath
                }
            })

            const response = await Agreement.findOne({
                id: agreementId
            });
            res.status(200).json({
                error: false,
                message: "pdf updated",
                response
            })
        }
    } catch (err) {
        next(err.message)
    }
}

module.exports = {
    getAllAgreement,
    getCompanyAgreement,
    addNewAgreement,
    editAgreement
}