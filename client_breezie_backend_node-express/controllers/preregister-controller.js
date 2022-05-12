const Preregister = require('../model/preregister-model')
const Devicelocation = require('../model/devicelocation-model');
const jwt = require('jsonwebtoken')
const fs = require('fs');

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}

const getPreregisterVisitor = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const visitors = await Preregister.find({
            userId
        });
        res.status(200).json({
            error: false,
            message: "all visitors list",
            visitors
        })
    } catch (err) {
        next(err.message)
    }
}

const getPreregisterVisitorById = async (req, res, next) => {
    try {
        const visitors = await Preregister.find({
            userId: req.params.id
        });
        res.status(200).json({
            error: false,
            message: "all visitors list",
            visitors
        })
    } catch (err) {
        next(err.message)
    }
}

const addNewVisitor = async (req, res, next) => {
    try {
        const {
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            location,
            visitingHost,
            phoneNumber
        } = req.body

        const userId = await getUserToken(req);

        let company = await Devicelocation.findOne({
            _id: location
        });
        let Location =company.locations.officeName

        const addvisitors = await Preregister.insertMany([{
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            locationId: location,
            location: Location,
            visitingHost,
            phoneNumber,
            userId:userId
        }])
        res.status(200).json({
            error: false,
            message: "New visitors added",
            addvisitors
        })
    } catch (err) {
        next(err.message)
    }
}

const editPreregisterData = async (req, res, next) => {
    try {
        const {
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            location,
            visitingHost,
            phoneNumber
        } = req.body
        const userId = await getUserToken(req);
        let company = await Devicelocation.findOne({
            _id: location
        });
        let Location =company.locations.officeName

        await Preregister.updateOne({
            _id: req.params.id
        }, {
            $set: {
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            locationId: location,
            location: Location,
            visitingHost,
            phoneNumber,
            // userId:userId
            }
        })
        const response = await Preregister.findOne({
            _id: req.params.id
        })
        res.status(200).json({
            error: false,
            message: "Visitor Updated Successfully",
            
        })
    } catch (err) {
        next(err.message)
    }
}

const remainingPreregisterLogout = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const data = await Preregister.find({
            userId,
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


const deletePreregister = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        await Preregister.deleteOne({
            _id: req.params.id,
            userId
         });
        res.status(200).json({
            error: false,
            message: "Deleted"
        });
    } catch (err) {
        next(err.message)
    }
}

module.exports = {
    addNewVisitor,
    getPreregisterVisitor,
    getPreregisterVisitorById,
    remainingPreregisterLogout,
    editPreregisterData,
    deletePreregister
}