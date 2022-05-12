const Employee = require("../model/employee-model");
const Timeline = require("../model/timeline-model");
const Devicelocation = require("../model/devicelocation-model");
const Register = require('../model/register-model');
const fs = require("fs");
const path = require('path');
const RegisterEmail = path.join(__dirname, '../views/email/email_admin_role.html');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


const Aws = require("aws-sdk");
const jwt = require("jsonwebtoken");
const mime = require("mime");

const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET, // secretAccessKey is also store in .env file
});

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId;
    return userId;
}

const getEmployee = async(req, res, next) => {
    try {
        const employeeData = await Employee.find({
            _id: req.params.id,
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        next(err.message);
    }
};

const getEmployeeDeliveryPerson = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isDeliveryPerson = false;
        const employeeData = await Employee.find({
            isDeliveryPerson: isDeliveryPerson,
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        next(err.message);
    }
};

const getAllEmployee = async(req, res, next) => {
    try {
        // let userId = verifiedUser.userId
        const userId = await getUserToken(req);
        // var resources = {
        //     "_id": "$_id",
        // };

        // const data = await Devicelocation.aggregate([{
        //         $match: {
        //             userId
        //         },
        //     },
        // {
        //     $group: resources,
        // },
        //     {
        //         $lookup: {
        //             from: "employees",
        //             localField: "_id",
        //             foreignField: "locationId",
        //             as: "employee"
        //         }
        //     },
        //     {
        //         $unwind: "$employee"
        //     },
        //     {
        //         $project: {
        //             __v: 0,
        //             "employee.__v": 0,
        //         }
        //     },
        // ])

        const employeeData = await Employee.find({
            userId: userId,
            isArchived: false,
        }).sort({
            employeeName: 1,
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        next(err.message);
    }
};

// const getAllDelivery = async(req, res, next) => {
//     try {
//         let startDate = req.params.startDate
//         let endDate = req.params.endDate
//         const userId = await getUserToken(req);
//         if (startDate == "All") {
//             const delivery = await Delivery.find({
//                 userId
//             }).sort({
//                 loginTime: -1
//             })
//             res.status(200).json({
//                 error: false,
//                 delivery
//             })
//         } else {
//             let delivery = []
//             const visitorData = await Delivery.find({
//                 userId
//             })
//             visitorData.forEach((ele, i) => {
//                 if (new Date(startDate) >= new Date(ele.deliveryTime) && new Date(endDate) <= new Date(ele.deliveryTime)) {
//                     delivery.push(ele)
//                 }
//             })
//             res.status(200).json({
//                 error: false,
//                 delivery
//             })
//         }
//     } catch (err) {
//         next(err.message);
//     }
// };

const getArchivedEmployee = async(req, res, next) => {
    try {
        let startDate = req.params.startDate
        let endDate = req.params.endDate
        const userId = await getUserToken(req);
        if (startDate == "All") {
            const delivery = await Employee.find({
                userId,
                isArchived: true,
            }).sort({
                employeeName: 1,
            })
            res.status(200).json({
                error: false,
                message: "Archived Data Fetched  Successfully",
                delivery
            })
        } else {
            let delivery = []
            const visitorData = await Employee.find({
                userId
            })
            visitorData.forEach((ele, i) => {
                console.log(ele);
                if (new Date(startDate) >= new Date(ele.archivedate) && new Date(endDate) <= new Date(ele.archivedate)) {
                    delivery.push(ele)
                }
            })
            res.status(200).json({
                error: false,
                message: "Archived Data Fetched  Successfully",
                delivery
            })
        }
    } catch (err) {
        next(err.message);
    }
};

const addEmployee = async(req, res, next) => {
    try {
        const {
            fullName,
            lastName,
            email,
            phone,
            location,
            assistantEmail,
            assistSms,
            isRemoteUser,
            ExtraFields,
        } = req.body;

        const userId = await getUserToken(req);

        const plans = await Register.find({
            _id: userId
        })

        let capitilizeName = fullName.charAt(0).toUpperCase() + fullName.slice(1);
        let capitilizeLastName =
            lastName.charAt(0).toUpperCase() + lastName.slice(1);
        const isEmployeeEmail = await Employee.findOne({
            email: email,
        });
        const allEmployee = await Employee.find({
            userId: userId,
        });
        const companyLocation = await Devicelocation.findOne({
            _id: location,
        });

        if ((plans[0].plan.planName === "Starter Plan" || plans[0].plan.planName === "FreeTrial") && allEmployee.length > 25) {
            res.status(404).json({
                error: true,
                message: "Employee Limit Exceeds",
            });
        } else {
            if (isEmployeeEmail == null) {
                if (req.file !== null && req.file !== undefined) {
                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `images/employee/${req.file.originalname}`,
                        Body: req.file.buffer,
                        ACL: "public-read-write",
                        ContentType: "image/jpeg",
                    };
                    await s3.upload(params, async(error, data) => {
                        if (error) {
                            res.status(404).json({
                                error: true,
                                message: "Error in Uploading Photo",
                                response,
                            });
                        } else {
                            const employeeData = await Employee.insertMany([{
                                userId,
                                fullName: capitilizeName,
                                lastName: capitilizeLastName,
                                email,
                                phone,
                                locationId: location,
                                locationName: companyLocation.locations.officeName,
                                assistantEmail,
                                assistSms,
                                isRemoteUser,
                                ExtraFields: ExtraFields,
                                role: "Employee",
                                lastActivity: {
                                    recent: null,
                                    time: null,
                                },
                            }, ]);
                            res.status(200).json({
                                error: false,
                                message: "Employee Details Added Successfully",
                                employeeData,
                            });
                        }
                    });
                    // const url = req.protocol + '://' + req.get('host');
                    // const image = url + `/images/Employee/` + req.file.originalname
                } else {
                    const employeeData = await Employee.insertMany([{
                        userId,
                        fullName: capitilizeName,
                        lastName: capitilizeLastName,
                        email,
                        phone,
                        locationId: location,
                        locationName: companyLocation.locations.officeName,
                        assistantEmail,
                        assistSms,
                        isRemoteUser,
                        ExtraFields: ExtraFields,
                        role: "Employee",
                        lastActivity: {
                            recent: null,
                            time: null,
                        },
                    }, ]);
                    res.status(200).json({
                        error: false,
                        message: "Employee Details Added  Successfully",
                        employeeData,
                    });
                }
            } else {
                res.status(404).json({
                    error: true,
                    message: "Employee Already Exist",
                });
            }
        }


    } catch (err) {
        next(err.message);
    }
};

const editEmployee = async(req, res, next) => {
    try {
        const {
            fullName,
            lastName,
            email,
            phone,
            location,
            assistantEmail,
            assistSms,
            ExtraFields,
            isRemoteUser,
        } = req.body;

        const companyLocation = await Devicelocation.findOne({
            _id: location,
        });

        let capitilizeName = fullName.charAt(0).toUpperCase() + fullName.slice(1);
        // let capitilizeDesignation =
        //     designation.charAt(0).toUpperCase() + designation.slice(1);
        if (req.file === null || req.file === undefined) {
            await Employee.updateOne({
                _id: req.params.id,
            }, {
                $set: {
                    fullName: capitilizeName,
                    lastName,
                    email,
                    phone,
                    locationId: location,
                    locationName: companyLocation.locations.officeName,
                    assistantEmail,
                    assistSms,
                    ExtraFields: ExtraFields,
                    isRemoteUser,
                },
            });
            const timelineData = await Timeline.find({
                employeeId: req.params.id
            })
            await Timeline.updateMany({
                employeeId: req.params.id
            }, {
                $set: {
                    employeeName: capitilizeName + " " + lastName,
                    locationId: location,
                    locationName: companyLocation.locations.officeName,
                    isRemote: isRemoteUser,
                    isRemoteUser
                },
            });
            const response = await Employee.findOne({
                _id: req.params.id,
            });
            res.status(200).json({
                error: false,
                message: "Details Updated Successfully",
                response,
            });
        } else if (req.file !== null || req.file !== undefined) {
            // const url = req.protocol + '://' + req.get('host');
            // const image = url + `/images/Employee/` + req.file.originalname
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/employee/${req.file.originalname}`,
                Body: req.file.buffer,
                ACL: "public-read-write",
                ContentType: "image/jpeg",
            };
            await s3.upload(params, async(error, data) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Updating Photo",
                        response,
                    });
                } else {
                    await Employee.updateOne({
                        _id: req.params.id,
                    }, {
                        $set: {
                            fullName: capitilizeName,
                            lastName,
                            email,
                            phone,
                            locationId: location,
                            locationName: companyLocation.locations.officeName,
                            assistantEmail,
                            assistSms,
                            ExtraFields: ExtraFields,
                            isRemoteUser,
                        },
                    });
                    const response = await Employee.findOne({
                        _id: req.params.id,
                    });
                    res.status(200).json({
                        error: false,
                        message: "Details Updated Successfully",
                        response,
                    });
                }
            });
        }
    } catch (err) {
        next(err.message);
    }
};

const deleteEmployee = async(req, res, next) => {
    try {
        let employee = await Employee.findOne({
            _id: req.params.id,
        });
        if (employee) {
            await Employee.deleteOne({
                _id: req.params.id,
            });
            res.status(200).json({
                error: false,
                message: "Deleted Successfully",
                _id: req.params.id,
            });
        } else {
            res.status(400).json({
                error: true,
                message: "No Employee to delete",
            });
        }
    } catch (err) {
        next(err.message);
    }
};

const anonymizedEmployee = async(req, res, next) => {
    try {
        req.body.forEach(async(ele) => {
            await Employee.deleteOne({
                _id: ele,
                // logoutTime: {
                //     $exists: true
                // }
                // }, {
                //     $set: {
                //         isAnonymized: true,
                //     },
            });
        });
        res.status(200).json({
            error: false,
            message: "Anonymized Employee Successfully",
        });
    } catch (err) {
        next(err.message);
    }
};

const archiveEmployee = async(req, res, next) => {
    try {
        let archivedate = new Date();
        req.body.forEach(async(ele) => {
            await Employee.updateMany({
                _id: ele,
            }, {
                $set: {
                    isArchived: true,
                    archivedate: archivedate,
                },
            });
        });
        res.status(200).json({
            error: false,
            message: " Archived Employee Successfully",
        });
    } catch (err) {
        next(err.message);
    }
};

const restoreArchiveEmployee = async(req, res, next) => {
    try {
        let archivedate = null;
        await Employee.updateMany({
            _id: req.params.id,
        }, {
            $set: {
                isArchived: false,
                archivedate: archivedate,
            },
        });

        res.status(200).json({
            error: false,
            message: "Restored Archived Employee Successfully",
        });
    } catch (err) {
        next(err.message);
    }
};

const uploadCSV = async(req, res, next) => {
    try {
        const {
            employeeArray,
            locationId
        } = req.body;
        let flag = true;
        let email = "";
        let newDate = new Date();
        const userId = await getUserToken(req);
        const companyLocation = await Devicelocation.findOne({
            _id: locationId
        });

        let insert = 0;
        let update = 0;
        const plans = await Register.find({
            _id: userId
        })
        const allEmployee = await Employee.find({
            userId: userId,
        });
        if ((plans[0].plan.planName === "Starter Plan" || plans[0].plan.planName === "FreeTrial") && allEmployee.length > 25) {
            res.status(404).json({
                error: true,
                message: "Employee Limit Exceeds",
            });
        } else {
            for (let i = 0; i < employeeArray.length; i++) {
                const data = employeeArray[i];
                let capitilizeFullName =
                    data.fullName.charAt(0).toUpperCase() + data.fullName.slice(1);
                let capitilizeLastName =
                    data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1);
                const isEmployeeEmail = await Employee.findOne({
                    email: data.email,
                });
                const plans = await Register.find({
                    _id: userId
                })
                const allEmployee = await Employee.find({
                    userId: userId,
                });
                if ((plans[0].plan.planName === "Starter Plan" || plans[0].plan.planName === "FreeTrial") && allEmployee.length > 25) {
                    res.status(404).json({
                        error: true,
                        message: "Employee Limit Exceeds",
                    });
                } else {
                    if (isEmployeeEmail === null) {
                        // flag = true;
                        insert += 1
                        await Employee.insertMany([{
                            userId: userId,
                            fullName: capitilizeFullName,
                            lastName: capitilizeLastName,
                            email: data.email,
                            phone: data.phone,
                            locationId: companyLocation._id,
                            locationName: companyLocation.locations.officeName,
                            assistantEmail: data.assistantEmail,
                            assistSms: data.assistSms,
                            userId: userId,
                            isRemoteUser: data.isRemoteUser,
                            role: "Employee",
                            lastActivity: {
                                recent: null,
                                time: null,
                            },
                        }, ]);
                    } else {
                        // flag = false;
                        // email = data.emailId;
                        // break;
                        update += 1;

                        await Employee.updateOne({
                            userId,
                            email: data.email,
                        }, {
                            $set: {
                                userId: userId,
                                fullName: capitilizeFullName,
                                lastName: capitilizeLastName,
                                email: data.email,
                                phone: data.phone,
                                locationId: companyLocation._id,
                                locationName: companyLocation.locations.officeName,
                                assistantEmail: data.assistantEmail,
                                assistSms: data.assistSms,
                                finalDate: newDate,
                                isRemoteUser: data.isRemoteUser,
                                role: "Employee",
                                lastActivity: {
                                    recent: null,
                                    time: null,
                                },
                            },
                        });
                    }
                }

            }
            let issue = 0;
            let Data = {
                Inserted: insert,
                Upadted: update,
                Issue: issue
            }
            const employeeData = await Employee.find({
                userId: userId,
                isArchived: false,
            }).sort({
                employeeName: 1,
            });
            res.status(200).json({
                error: false,
                message: "Employee Details Added  Successfully",
                employeeData,
                Data
            });
        }

        // if (flag) {
        //     for (let i = 0; i < employeeArray.length; i++) {
        //         const element = employeeArray[i];
        //         let capitilizeName =
        //             element.employeeName.charAt(0).toUpperCase() +
        //             element.employeeName.slice(1);
        //         let capitilizeDesignation =
        //             element.designation.charAt(0).toUpperCase() +
        //             element.designation.slice(1);
        //         if (req.file !== null && req.file !== undefined) {
        //             const params = {
        //                 Bucket: process.env.AWS_BUCKET_NAME,
        //                 Key: `images/employee/${req.file.originalname}`,
        //                 Body: req.file.buffer,
        //                 ACL: "public-read-write",
        //                 ContentType: "image/jpeg",
        //             };
        //             await s3.upload(params, async (error, data) => {
        //                 if (error) {
        //                     res.status(404).json({
        //                         error: true,
        //                         message: "Error in Uploading Photo",
        //                         response,
        //                     });
        //                     return;
        //                 } else {
        //                     await Employee.insertMany([{
        //                         // employeeName: capitilizeName,
        //                         // employeeID: element.employeeID,
        //                         // designation: capitilizeDesignation,
        //                         // emailId: element.emailId,
        //                         // imagePath: data.Location,
        //                         // isRemoteUser: element.isRemoteUser,

        //                         fullName: element.fullName,
        //                         lastName: element.lastName,
        //                         email: element.email,
        //                         phone: element.phone,
        //                         locationId: element.location,
        //                         locationName: companyLocation.locations.officeName,
        //                         assistantEmail: element.assistantEmail,
        //                         assistSms: element.assistSms,
        //                         isRemoteUser: element.isRemoteUser,
        //                     }, ]);
        //                 }
        //             });
        //         } else {
        //             await Employee.insertMany([{
        //                 employeeName: capitilizeName,
        //                 employeeID: element.employeeID,
        //                 designation: capitilizeDesignation,
        //                 emailId: element.emailId,
        //                 isRemoteUser: element.isRemoteUser,
        //                 fullName: element.fullName,
        //                 lastName: element.lastName,
        //                 email: element.email,
        //                 phone: element.phone,
        //                 locationId: element.location,
        //                 locationName: companyLocation.locations.officeName,
        //                 assistantEmail: element.assistantEmail,
        //                 assistSms: element.assistSms,
        //                 isRemoteUser: element.isRemoteUser,
        //             }, ]);
        //         }
        //     }
        //     res.status(200).json({
        //         error: false,
        //         message: "Details Added Successfully",
        //     });
        // } else {
        //     res.status(404).json({
        //         error: true,
        //         message: `An Employee with ${email} Already Exist in database`,
        //     });
        // }
    } catch (err) {
        next(err.message);
    }
};

const changeStatus = async(req, res, next) => {
    try {
        const {
            employeeId,
            type,
            time,
            signedOutMessage,
            signedInQuestion,
            isRemoteSignedIn,
            employeeImage,
        } = req.body;
        const userId = await getUserToken(req);
        const employee = await Employee.findOne({
            _id: employeeId,
        });
        const logInfo = {};
        logInfo["lastActivity"] = {
            recent: type,
            time,
        };
        if (type === "login") {
            logInfo["loginTime"] = time;
        } else {
            logInfo["logoutTime"] = time;
        }
        let params = {};
        if (employeeImage) {
            const S3type = employeeImage.split(";")[0].split("/")[1];
            var matches = employeeImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                imgResponse = {};
            if (matches.length !== 3) {
                return new Error("Invalid input string");
            }
            imgResponse.type = matches[1];
            imgResponse.data = new Buffer.from(matches[2], "base64");
            const decodedImg = imgResponse;
            const imageBuffer = decodedImg.data;
            const type = decodedImg.type;
            const extension = mime.getExtension(type);
            const S3imageName =
                "Profile" + Math.floor(Math.random() * 10000 + 1) + "." + extension;
            const employeeDetails = await Employee.findOne({
                _id: employeeId,
            });
            params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/employee/development/${S3imageName}`, // type is not required
                Body: imageBuffer,
                ACL: "public-read",
                ContentEncoding: "base64", // required
                ContentType: `image/${S3type}`, // required. Notice the back ticks
            };
        }
        if (employeeId && type && time) {
            const timeline = await Timeline.find({
                    employeeId,
                    userId,
                })
                .sort({
                    _id: -1,
                })
                .limit(1);
            let errMsg = null;
            if (timeline.length > 0 && type === "login" && timeline[0].logoutTime) {
                await Timeline.updateOne({
                    _id: timeline[0]._id,
                }, {
                    $set: {
                        ...logInfo,
                        closed: true,
                    },
                });
                if (employeeImage) {
                    await s3.upload(params, async(error, data) => {
                        if (error) {
                            res.status(404).json({
                                error: true,
                                message: "Error in Uploading Photo",
                                response,
                            });
                        } else {
                            await Timeline.insertMany([{
                                userId,
                                employeeId,
                                ...logInfo,
                                employeeName: `${employee.fullName} ${employee.lastName}`,
                                isRemote: isRemoteSignedIn,
                                isRemoteUser: employee.isRemoteUser,
                                closed: false,
                                device: "",
                                locationId: employee.locationId,
                                locationName: employee.locationName,
                                signedInQuestion,
                                employeeImage: data.Location
                            }, ]);
                        }
                    });
                } else {
                    await Timeline.insertMany([{
                        userId,
                        employeeId,
                        ...logInfo,
                        employeeName: `${employee.fullName} ${employee.lastName}`,
                        isRemote: isRemoteSignedIn,
                        isRemoteUser: employee.isRemoteUser,
                        closed: false,
                        device: "",
                        locationId: employee.locationId,
                        locationName: employee.locationName,
                        signedInQuestion
                    }, ]);
                }
            } else if (timeline.length > 0 && type === "logout") {
                if (employeeImage) {
                    await s3.upload(params, async(error, data) => {
                        if (error) {
                            res.status(404).json({
                                error: true,
                                message: "Error in Uploading Photo",
                                response,
                            });
                        } else {
                            await Timeline.updateOne({
                                _id: timeline[0]._id,
                            }, {
                                $set: {
                                    ...logInfo,
                                    signedOutMessage,
                                    employeeImage: data.Location
                                },
                            });
                        }
                    });
                } else {
                    await Timeline.updateOne({
                        _id: timeline[0]._id,
                    }, {
                        $set: {
                            ...logInfo,
                            signedOutMessage
                        },
                    });
                }
            } else if (type === "login") {
                if (!timeline.length || (timeline.length && !timeline[0].loginTime)) {
                    if (employeeImage) {
                        await s3.upload(params, async(error, data) => {
                            if (error) {
                                res.status(404).json({
                                    error: true,
                                    message: "Error in Uploading Photo",
                                    response,
                                });
                            } else {
                                await Timeline.insertMany([{
                                    userId,
                                    employeeId,
                                    ...logInfo,
                                    isRemote: isRemoteSignedIn,
                                    isRemoteUser: employee.isRemoteUser,
                                    employeeName: `${employee.fullName} ${employee.lastName}`,
                                    closed: false,
                                    device: "",
                                    locationId: employee.locationId,
                                    locationName: employee.locationName,
                                    signedInQuestion,
                                    employeeImage: data.Location
                                }, ]);
                            }
                        });
                    } else {
                        await Timeline.insertMany([{
                            userId,
                            employeeId,
                            ...logInfo,
                            isRemote: isRemoteSignedIn,
                            isRemoteUser: employee.isRemoteUser,
                            employeeName: `${employee.fullName} ${employee.lastName}`,
                            closed: false,
                            device: "",
                            locationId: employee.locationId,
                            locationName: employee.locationName,
                            signedInQuestion,
                        }, ]);
                    }
                } else {
                    errMsg = "Employee has been already loggedin";
                }
            } else {
                errMsg = "Employees are required to log in.";
            }
            if (!errMsg) {
                await Employee.updateOne({
                    _id: employeeId,
                }, {
                    $set: {
                        ...logInfo,
                        isRemote: isRemoteSignedIn
                    },
                });
                const response = await Employee.findById({
                    _id: employeeId
                })
                res.status(200).json({
                    error: false,
                    message: "Changed status Successfully",
                    employeeId,
                    response
                });
            } else {
                res.status(500).send({
                    error: errMsg,
                });
            }
        } else {
            res.status(400).send({
                error: "employeeId, time and type is required",
            });
        }
    } catch (err) {
        next(err.message);
    }
};

const makeEmployeeAsAdmin = async(req, res, next) => {
    try {
        const {
            adminRoles,
            employee
        } = req.body;
        const userId = await getUserToken(req);
        const adminRole = "Admin";
        const employeeData = await Employee.updateOne({
            userId,
            _id: req.params.id,
        }, {
            $set: {
                role: adminRoles,
                acceess: true
            },
        });
        res.status(200).json({
            error: false,
            message: " Access Granted Successfully",
            employeeData,
        });
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};

const removeAdmin = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const employee = await Employee.findOne({
            userId,
            _id: req.params.id,
        });
        if (employee) {
            if (!employee.defaultAdmin) {
                await Employee.updateOne({
                    userId,
                    _id: req.params.id,
                }, {
                    $set: {
                        role: "Employee",
                        acceess: false
                    },
                    $unset: { password: 1 }
                });
                res.status(200).json({
                    error: false,
                    message: "Employee Deleted Successfully"
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "Can Not Remove this Admin",
                });
            }
        } else {
            res.status(200).json({
                error: false,
                message: "No Employee",
            });
        }
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};

//sendinvite

const sendInvite = async(req, res, next) => {
    try {

        const userId = getUserToken(req)

        const employee = await Employee.findOne({
            userId,
            _id: req.params.id,
        });

        if (employee) {
            var template = await fs.readFileSync(RegisterEmail, {
                encoding: 'utf-8'
            });
            const FullName = employee.fullName + " " + employee.lastName;
            if (template) {
                const regz = `<a style="text-align:center; margin-bottom: 90px;"  target="_blank">Click Here</a>
             href="https://secure.breazie.com/auth/register-password?trigger=AdminCreateUser&emailId=${employee.email}&role=${employee.role}&dest=freetrial"`
                template = template.replace(new RegExp("(linkHere)", "g"), regz);
                template = template.replace(new RegExp("(Recipients Name)", "g"), FullName);
            }
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                service: "gmail",
                auth: {
                    user: process.env.Email,
                    pass: process.env.Password,
                },
            });
            var mailOptions = {
                from: process.env.Email,
                to: employee.email,
                subject: "Notified recepient",
                html: template,
            };
            await transporter.sendMail(mailOptions, async(error) => {
                if (error) {} else {
                    res.status(200).json({
                        error: false,
                        message: "Mail send successfully",
                    });
                }
            });
        } else {
            res.status(200).json({
                error: false,
                message: "No Employee Found",
            });
        }
    } catch (err) {
        next(err.message);
    }
}

const setEmployeePassword = async(req, res, next) => {
    try {
        const {
            password,
            emailId
        } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(password, salt)
        await Employee.updateOne({
            email: emailId
        }, {
            password: encryptedPassword
        });

        const employee = await Employee.findOne({
            email: emailId
        });

        res.status(200).json({
            error: false,
            message: "Password Updated successfully",
            employee
        });
    } catch (err) {
        next(err.message);
    }
}

const getAllAdminInEmployee = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const adminRole = "Employee";
        const employeeData = await Employee.find({
            userId,
            role: { $ne: adminRole }
        }).sort({
            employeeName: 1,
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};

const makeDeliveredEmployee = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isDeliveryPerson = true;

        const employeeData = await Employee.updateOne({
            userId,
            _id: req.params.id,
        }, {
            $set: {
                isDeliveryPerson: isDeliveryPerson,
            },
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};

const removeDeliveredEmployee = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isDeliveryPerson = false;

        const employeeData = await Employee.updateOne({
            userId,
            _id: req.params.id,
        }, {
            $set: {
                isDeliveryPerson: isDeliveryPerson,
            },
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};


//catering setup 
const makeCateringEmployee = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isCatering = true;
        await Employee.updateOne({
            userId,
            _id: req.params.id,
        }, {
            $set: {
                isCatering: isCatering,
            },
        });

        const employeeData = await Employee.find({
            _id: req.params.id
        })
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};

const removeCateringEmployee = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isCatering = false;

        const employeeData = await Employee.updateOne({
            userId,
            _id: req.params.id,
        }, {
            $set: {
                isCatering: isCatering,
            },
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy",
        });
    }
};

const getEmployeeCateringPerson = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isCatering = false;
        const employeeData = await Employee.find({
            userId: userId,
            isCatering: false,
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        next(err.message);
    }
};

const getCateringAdded = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const isCatering = false;
        const employeeData = await Employee.find({
            userId: userId,
            isCatering: true,
        });
        res.status(200).json({
            error: false,
            employeeData,
        });
    } catch (err) {
        next(err.message);
    }
};

module.exports = {
    getEmployee,
    getAllEmployee,
    getArchivedEmployee,
    restoreArchiveEmployee,
    getEmployeeDeliveryPerson,
    addEmployee,
    editEmployee,
    deleteEmployee,
    uploadCSV,
    changeStatus,
    getAllAdminInEmployee,
    anonymizedEmployee,
    archiveEmployee,
    makeEmployeeAsAdmin,
    removeAdmin,
    makeDeliveredEmployee,
    removeDeliveredEmployee,
    sendInvite,
    setEmployeePassword,
    makeCateringEmployee,
    removeCateringEmployee,
    getEmployeeCateringPerson,
    getCateringAdded
};