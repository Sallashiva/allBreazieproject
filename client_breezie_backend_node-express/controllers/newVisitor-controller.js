const newVisitor = require('../model/newVisitor-model')
const fs = require('fs');

const getAllNewVisitor = async (req, res, next) => {
    try {
        const visitors = await newVisitor.find();
        res.status(200).json({
            error: false,
            message: "all new visitors list",
            visitors
        })
    } catch (err) {
        next(err.message)
    }
}


const addNewVisitor= async (req, res, next) => {
    try {
        const {
            fullName,
            companyName,
           location,
           visiting
        } = req.body;
        const addvisitor = await newVisitor.insertMany({
            fullName,
            companyName,
           location,
           visiting
        })
        res.status(200).json({
            error: false,
            message: "added visitor",
            addvisitor
        })
    } catch (err) {
        next(err.message)
    }
}

module.exports = {
    getAllNewVisitor,
    addNewVisitor
}