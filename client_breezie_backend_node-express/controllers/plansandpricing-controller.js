const {
    plansandpricing,
    addOn
} = require("../model/plansandpricing-model");

const getAllPlans = async(req, res, next) => {
    try {
        const plandetails = await plansandpricing.find();
        res.status(200).json({
            error: false,
            message: "all data",
            plandetails,
        });
    } catch (err) {
        next(err.message);
    }
};

const getAllAddOns = async(req, res, next) => {
    try {
        const plandetails = await addOn.find();
        res.status(200).json({
            error: false,
            message: "all data",
            plandetails,
        });
    } catch (err) {
        next(err.message);
    }
};

const addPlanPricing = async(req, res, next) => {
    try {
        const {
            name,
            location,
            ipad,
            qrcode,
            employees,
            contactlessSignIn,
            vaccinationProofUpload,
            employeeScreening,
            remoteWorking,
            multipleVisitoflows,
            integrations,
            monthlyprice,
            price,
            annualprice,
            planId,
            DisplayName
        } = req.body;
        const pricing = await plansandpricing.insertMany({
            name,
            location,
            ipad,
            qrcode,
            employees,
            contactlessSignIn,
            vaccinationProofUpload,
            employeeScreening,
            remoteWorking,
            multipleVisitoflows,
            integrations,
            price,
            planId,
            DisplayName
        });
        res.status(200).json({
            error: false,
            message: "added plans",
            pricing,
        });
    } catch (err) {
        next(err.message);
    }
};

const editPlans = async(req, res, next) => {
    try {
        const {
            name,
            location,
            ipad,
            qrcode,
            employees,
            contactlessSignIn,
            vaccinationProofUpload,
            employeeScreening,
            remoteWorking,
            multipleVisitoflows,
            integrations,
            monthlyprice,
            annualprice,
            planId,
        } = req.body;
        const editplansdata = await plansandpricing.updateOne({
            id: req.params.id,
        }, {
            $set: {
                name,
                location,
                ipad,
                qrcode,
                employees,
                contactlessSignIn,
                vaccinationProofUpload,
                employeeScreening,
                remoteWorking,
                multipleVisitoflows,
                integrations,
                monthlyprice,
                annualprice,
                planId,
            },
        });
        res.status(200).json({
            error: false,
            message: "updated plans",
            editplansdata,
        });
    } catch (err) {
        next(err.message);
    }
};

const addAddons = async(req, res, next) => {
    try {
        const {
            name,
            annualprice,
            monthlyprice,
            addOnId,
            price
        } = req.body;
        const response = await addOn.insertMany({
            name,
            annualprice,
            monthlyprice,
            addOnId,
            price
        });
        res.send({
            error: false,
            message: "Added AddOns",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const editAddons = async(req, res, next) => {
    try {
        const {
            name,
            annualprice,
            monthlyprice,
            _id,
            addOnId,
            price
        } = req.body;
        await addOn.updateOne({
            _id,
        }, {
            $set: {
                name,
                annualprice,
                monthlyprice,
                addOnId,
                price
            },
        });
        const response = await addOn.find({
            _id: addOnId,
        });
        res.send({
            error: false,
            message: "Updated AddOns",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

module.exports = {
    getAllPlans,
    addPlanPricing,
    editPlans,
    getAllAddOns,
    addAddons,
    editAddons,
};