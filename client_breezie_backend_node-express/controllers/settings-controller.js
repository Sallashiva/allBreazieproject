const Settings = require("../model/settings.model");
const Register = require("../model/register-model");
const Screen = require('../model/screens-model');
const Branding = require('../model/brand-settings');
const jwt = require('jsonwebtoken')
const fs = require("fs");

const Aws = require('aws-sdk');
const { response } = require("express");

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
    // let userId = verifiedUser.userId
    return verifiedUser
}

const getAllSettings = async(req, res, next) => {
    try {
        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId
        const settings = await Settings.find({
            userId: userId
        });
        res.status(200).json({
            error: false,
            settings,
        });
    } catch (err) {
        next(err.message);
    }
};


const freeTrial = async(req, res, next) => {
    try {
        const {
            finalDate
        } = req.body
        const userId = await getUserToken(req)
        var MyDate = new Date();
        var freeTrialDays = 14;
        var enddate = MyDate.setDate(MyDate.getDate() + freeTrialDays);
        const endDate = new Date(enddate).toString();
        let startDate = new Date(finalDate).toString();
        const userData = await Register.findOne({
            _id: userId
        });
        if (!userData.CateringAddOn.cateringFreeTrialUsed) {
            await Register.updateOne({
                _id: userId
            }, {
                $set: {
                    CateringAddOn: {
                        planName: "FreeTrial",
                        cateringFreeTrialUsed: true,
                        startDate: startDate,
                        endDate: endDate
                    },
                }
            })
            res.status(200).json({
                error: false,
                message: "Free Trial Activiated"
            });
        } else {
            res.status(401).json({
                error: true,
                message: "You have already used Free Trial"
            });
        }
    } catch (err) {
        next(err.message);
    }
};


const getCompanySettings = async(req, res, next) => {
    try {

        const verifiedUser = await deviceToken(req);
        const userId = verifiedUser.userId
        const locationId = verifiedUser.locationId

        // let company = await Register.findOne({
        //     userId,
        // });

        // let settingId = company.settingId;
        const companySettings = await Settings.findOne({
            userId
        });
        res.status(200).json({
            error: false,
            message: "id matched",
            companySettings,
        });
    } catch (err) {
        next(err.message);
    }
};

const editBrandLogo = async(req, res, next) => {
    try {
        const {
            companyLogo
        } = req.body;
        if (req.file !== null) {
            fs.writeFileSync(
                "./images/brand/" + req.file.originalname,
                req.file.buffer,
                "utf8"
            );
            const url = req.protocol + "://" + req.get("host");
            const imagePath = url + `/images/brand/` + req.file.originalname;

            let company = await Register.findOne({
                _id: req.params.id,
            });
            let settingId = company.settingId;
            await Settings.updateOne({
                id: settingId,
            }, {
                $set: {
                    branding: {
                        companyLogo: imagePath,
                    },
                },
            });
            const response = await Settings.find({
                id: req.params.id,
            });
            res.status(200).json({
                error: false,
                message: "Image added successfully",
                response,
            });
        } else {
            res.status(404).json({
                error: true,
                message: "Upload Logo",
            });
        }
    } catch (err) {
        next(err.message);
    }
};



const editBrandColor = async(req, res, next) => {
    try {
        const {
            // companyLogo,
            color
        } = req.body;
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId
        let company = await Register.findOne({
            _id: userId
        });
        let settingId = company.settingId;
        await Settings.findByIdAndUpdate({
            _id: settingId,
        }, {
            $set: {
                branding: {
                    // companyLogo,
                    brandColor: color,
                },
            },
        });
        const response = await Settings.findOne({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "color updated jvkjkj",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const editVisitorSetting = async(req, res, next) => {
    try {
        const {
            rememberVisitor,
            visitorNameMatch,
            selectHost,
            displayEmployeeList,
            sendVisitorNotificationByEmail,
            takePhotoOfVisitor,
            automaticallySignOut,
            visitorCentralRecipients,
            approvalCentralRecipients,
            visitorNotifications,
            approvalCentralRecipient,
            mobilePhone,
        } = req.body;

        const userId = await getUserToken(req);

        // Find the User
        let company = await Register.findOne({
            _id: userId
        });

        // Update setting data
        let settingId = company.settingId;
        await Settings.findByIdAndUpdate({
            _id: settingId,
        }, {
            $set: {
                visitorSetting: {
                    rememberVisitor,
                    visitorNameMatch,
                    selectHost,
                    displayEmployeeList,
                    sendVisitorNotificationByEmail,
                    takePhotoOfVisitor,
                    automaticallySignOut,
                    visitorCentralRecipients,
                    approvalCentralRecipients,
                    visitorNotifications,
                    mobilePhone,
                    approvalCentralRecipient,
                },
            },
        });

        const response = await Settings.findOne({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const editIdBadge = async(req, res, next) => {
    try {
        const {
            scanBadgeToSignOut,
            badgeType
        } = req.body;

        const userId = await getUserToken(req);
        let company = await Register.findOne({
            _id: userId,
        });
        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
        }, {
            $set: {
                idBadge: {
                    scanBadgeToSignOut,
                    badgeType,
                },
            },
        });
        const response = await Settings.findOne({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const editContactLess = async(req, res, next) => {
    try {
        const {
            generateDynamicQR,
            employeeInOut,
            requiredLocation,
            rememberEmployee
        } = req.body;
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId
        let company = await Register.findOne({
            _id: userId,
        });
        let settingId = company.settingId;
        await Settings.findByIdAndUpdate({
            _id: settingId,
        }, {
            $set: {
                contactLess: {
                    generateDynamicQR: generateDynamicQR,
                    employeeInOut: employeeInOut,
                    requiredLocation: requiredLocation,
                    rememberEmployee: rememberEmployee
                },
            },
        });
        const response = await Settings.findOne({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const editEmployeeSetting = async(req, res, next) => {
    try {
        const {
            allowEmployee,
            showField,
            automaticallySignOut,
            selected,
            requestSignout,
            employeeFields,
            employeeQuestionsText,
            employeeQuestionsRadio,
            signOutMessages,
        } = req.body;

        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId
        let company = await Register.findById({
            _id: userId,
        });
        let settingId = company.settingId;
        await Settings.findByIdAndUpdate({
            _id: settingId,
        }, {
            $set: {
                EmployeeSetting: {
                    allowEmployee,
                    showField,
                    automaticallySignOut,
                    selected,
                    requestSignout,
                    employeeFields,
                    employeeQuestionsText,
                    employeeQuestionsRadio,
                    signOutMessages
                },
            },
        });
        const response = await Settings.findById({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            response,
        });
    } catch (err) {
        next(err.message);
    }
};

const addEmployeeSignoutQuestions = async(req, res, next) => {
    try {
        const {
            message,
            companyId
        } = req.body;
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        const userId = verifiedUser.userId;
        let company = await Register.findById({
            _id: userId,
        });
        let settingId = company.settingId;

        await Settings.updateOne({
            _id: settingId,
        }, {
            $push: {
                signOutMessages: {
                    message,
                    hidden: false,
                },
            },
        });
        const resp = await Settings.findById({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            resp: resp.signOutMessages,
        });
    } catch (err) {
        next(err.message);
    }
};

const editEmployeeSignoutQuestions = async(req, res, next) => {
    try {
        const {
            messageId,
            hidden,
            message,
            companyId
        } = req.body;
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        const userId = verifiedUser.userId;
        let company = await Register.findById({
            _id: userId,
        });
        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
            "signOutMessages._id": messageId,
        }, {
            $set: {
                "signOutMessages.$.message": message,
                "signOutMessages.$.hidden": hidden,
            },
        });
        const resp = await Settings.findById({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            resp: resp.signOutMessages,
        });
    } catch (err) {
        next(err.message);
    }
};

const deleteEmployeeSignoutQuestions = async(req, res, next) => {
    try {
        const {
            messageId,
            hidden,
            message,
            companyId
        } = req.body;
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        const userId = verifiedUser.userId;
        let company = await Register.findById({
            _id: userId,
        });
        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
        }, {
            $pull: {
                signOutMessages: {
                    _id: messageId
                }
            },
        });
        const resp = await Settings.findById({
            _id: settingId,
        });
        res.status(200).json({
            error: false,
            message: "Updated",
            resp: resp.signOutMessages,
        });
    } catch (err) {
        next(err.message);
    }
};

const editWelcomeScreen = async(req, res, next) => {
    try {
        const {
            visitorIn,
            visitorInTextColor,
            visitorInBackgroundColor,
            visitorInBorder,
        } = req.body
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId

        let company = await Register.findOne({
            _id: userId,
        });

        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
        }, {
            $set: {
                welcomeScreen: {
                    visitorIn,
                    visitorInTextColor,
                    visitorInBackgroundColor,
                    visitorInBorder,
                }
            }
        });

        const response = await Settings.findOne({
            _id: company.settingId,
        });

        res.status(200).json({
            error: false,
            message: "Image Updated Succesfuly ",
            response
        });

    } catch (err) {
        next(err.message);
    }
}


const addImages = async(req, res, next) => {
    try {
        const {
            imagesPath
        } = req.body
        const userId = await getUserToken(req);
        const screen = await Screen.find({
            userId: userId,
        });
        if (screen.length < 5) {
            if (req.file !== null) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1)
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/welcomScreen/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };

                await s3.upload(params, async(error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await Screen.insertMany([{
                            imagePath: data.Location,
                            userId: userId,
                            selected: false,
                            hidden: false,
                        }]);
                        res.status(200).json({
                            error: false,
                            message: "Image added"
                        })
                    }
                })
            } else {
                res.status(404).json({
                    error: true,
                    message: "Please upload employee photo"
                })
            }
        } else {
            res.status(404).json({
                error: true,
                message: "Screens have exceed the limit please delete some"
            })
        }
    } catch (err) {
        next(err.message)
    }
}


const getImage = async(req, res, next) => {
    try {

        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId

        const images = await Screen.find({
            userId
        })
        res.status(200).json({
            error: false,
            message: "IImage Fetched",
            response: images
        });


    } catch (err) {
        next(err.message)
    }
}


const selected = async(req, res, next) => {
    try {
        const {
            hidden
        } = req.body
        await Screen.updateMany({}, {
            $set: {
                selected: false
            }
        });
        await Screen.updateOne({
            _id: req.params.id
        }, {
            $set: {
                selected: true
            }
        });
        res.status(200).json({
            error: false,
            message: "Image selected ",
        });
    } catch (err) {
        next(err.message)
    }
}

const upadteImage = async(req, res, next) => {
    try {
        const {
            hidden
        } = req.body
        await Screen.updateOne({
            _id: req.params.id,
        }, {
            $set: {
                hidden: hidden,
            }
        });

        res.status(200).json({
            error: false,
            message: "Image Updated Successfully",
            response
        });


    } catch (err) {
        next(err.message);
    }
}

const deleteImage = async(req, res, next) => {
    try {
        let screen = await Screen.findOne({
            _id: req.params.id
        });
        if (screen) {
            var image = screen.imagePath
            var split = image.split("/");
            var originalname = split[split.length - 1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/welcomScreen/${originalname}`,
            };
            await s3.deleteObject(params, async(err, data) => {
                if (err) {
                } else {
                    await Screen.deleteOne({
                        _id: req.params.id
                    });
                    res.status(200).json({
                        error: false,
                        message: 'Deleted Successfully',
                        _id: req.params.id
                    })
                }
            });
        } else {
            res.status(400).json({
                error: true,
                message: 'No Images to delete'
            })
        }
    } catch (err) {
        next(err.message);
    }

}



const editVisitorFields = async(req, res, next) => {
    try {
        const {
            category,
            addCategory,
            agreement,
            hideInactiveFields,
            addFields
        } = req.body
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId

        let company = await Register.findOne({
            _id: userId,
        });

        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
        }, {
            $set: {
                visitorFieldSetting: {
                    category,
                    addCategory,
                    agreement,
                    hideInactiveFields,
                    addFields
                }
            }
        })
        const response = await Settings.findOne({
            _id: company.settingId,
        });
        res.status(200).json({
            error: false,
            message: "Visitor Fields updated successfully",
            response
        });
    } catch (err) {
        next(err.message);
    }
}


const deliverySetup = async(req, res, next) => {

    try {
        const {
            scanLabel,
            generalsDeliveries,
            deliveriesContacts,
        } = req.body

        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId

        let company = await Register.findOne({
            _id: userId,
        });

        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
        }, {
            $set: {
                deliverySetup: {
                    scanLabel,
                    generalsDeliveries,
                    deliveriesContacts,
                }
            }
        })
        const response = await Settings.findOne({
            _id: company.settingId,
        });

        res.status(200).json({
            error: false,
            message: "delivery Settings updated successfully",
            response
        });

    } catch (err) {
        next(err.message);
    }
}


const deliveryInstructions = async(req, res, next) => {

    try {
        const {
            Recipient
        } = req.body;

        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId

        let company = await Register.findOne({
            _id: userId,
        });

        let settingId = company.settingId;
        await Settings.updateOne({
            _id: settingId,
        }, {
            $set: {
                deliveryInstructions: {
                    Recipient
                }
            }
        })
        const response = await Settings.findOne({
            _id: company.settingId,
        });
        res.status(200).json({
            error: false,
            message: "deliveryInstructions updated successfully",
            response
        });

    } catch (err) {
        next(err.message);
    }
}


// const cateringMenu = async(req, res, next) => {
//     try {
//         const {
//             cofee,
//             tea,
//             other,
//             food
//         } = req.body


//         //    fs.writeFileSync(
//         //     "./images/catering" + req.file.originalname,
//         //     req.file.buffer,
//         //     "utf8"
//         // );

//         // const url = req.protocol + "://" + req.get("host");
//         // const imagePath = url + `/images/catering` + req.file.originalname;
//         // var image= "https://secure.breazie.com/images/cateringdownload.jpg"

//         food.addItem.forEach((ele, i) => {
//             ele.itemImage = imagePath
//         })



//         let token = req.headers.authorization;
//         token = token.split(' ')[1]
//         let verifiedUser = jwt.verify(token, process.env.jwtSecret);
//         let userId = verifiedUser.userId

//         let company = await Register.findOne({
//             _id: userId,
//         });
//         let settingId = company.settingId;
//         await Settings.updateOne({
//             _id: settingId,
//         }, {
//             $set: {
//                 cateringMenu: {
//                     cofee,
//                     tea,
//                     other,
//                     food: food
//                 }
//             }

//             //  $push: {
//             //     addItem: {
//             //         itemImage
//             //          },
//             //    },


//             // $addToSet: { "cateringMenu.foodaddItem.itemImage": imagePath1} 

//             // $set:{'cateringMenu.0.food.0.addItem.$.itemImage':imagePath}

//         })

//         const response = await Settings.findOne({
//             _id: company.settingId,
//         });
//         res.status(200).json({
//             error: false,
//             message: "cateringMenu updated successfully",
//             response
//         });
//     } catch (err) {
//         next(err.message);
//     }
// }


//Branding


const getCompanyLogo = async(req, res, next) => {
    try {
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId

        const response = await Branding.find({
            userId: userId
        })
        res.status(200).json({
            error: false,
            message: "IImage Fetched",
            response: response
        });
    } catch (err) {
        next(err.message);
    }
}

const addCompanyLogo = async(req, res, next) => {
    try {
        const {
            companyLogo,
            idBadge,
            email,
            contactless
        } = req.body;

        const userId = await getUserToken(req);

        if (req.file !== null) {
            var name = "Screen" + Math.floor(Math.random() * 10000 + 1)
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `/images/brand/${name}`,
                Body: req.file.buffer,
                ACL: "public-read-write",
                ContentType: "image/jpeg"
            };

            await s3.upload(params, async(error, data) => {
                if (error) {
                    res.status(404).json({
                        error: true,
                        message: "Error in Uploading Photo",
                    })
                } else {
                    let response = await Branding.insertMany([{
                        userId: userId,
                        companyLogo: data.Location,
                        idBadge: idBadge,
                        email: email,
                        contactless: contactless
                    }]);
                    res.status(200).json({
                        error: false,
                        message: "CompanyLogo added successfully",
                        response,
                    });
                }
            })
        } else {
            res.status(404).json({
                error: true,
                message: "Please upload Logo"
            })
        }
    } catch (err) {
        next(err.message);
    }
};


const brandSelected = async(req, res, next) => {
    try {
        // const{
        //     hidden
        // }= req.body
        const userId = await getUserToken(req);
        await Branding.updateMany({
            userId: userId
        }, {
            $set: {
                idBadge: ""
            }
        });
        await Branding.updateOne({
            _id: req.params.id
        }, {
            $set: {
                idBadge: "Id Badge"
            }
        });
        res.status(200).json({
            error: false,
            message: "Image selected ",
        });
    } catch (err) {
        next(err.message)
    }
}


const deleteCompanyLogo = async(req, res, next) => {
    try {
        let screen = await Branding.findOne({
            _id: req.params.id
        });
        if (screen) {
            var image = screen.companyLogo
            var split = image.split("/");
            var originalname = split[split.length - 1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/brand/${originalname}`,
            };
            await s3.deleteObject(params, async(err, data) => {
                if (err) {
                } else {
                    await Branding.deleteOne({
                        _id: req.params.id
                    });
                    res.status(200).json({
                        error: false,
                        message: 'Deleted Successfully',
                        _id: req.params.id
                    })
                }
            });
        } else {
            res.status(400).json({
                error: true,
                message: 'No Images to delete'
            })
        }
    } catch (err) {
        next(err.message);
    }

}




module.exports = {
    getAllSettings,
    editBrandLogo,
    freeTrial,
    editBrandColor,
    getCompanySettings,
    editVisitorSetting,
    editIdBadge,
    editContactLess,
    editEmployeeSetting,
    addEmployeeSignoutQuestions,
    editEmployeeSignoutQuestions,
    deleteEmployeeSignoutQuestions,
    editWelcomeScreen,
    deleteImage,
    editVisitorFields,
    deliverySetup,
    deliveryInstructions,
    // cateringMenu,
    addImages,
    getImage,
    upadteImage,
    selected,
    addCompanyLogo,
    getCompanyLogo,
    deleteCompanyLogo,
    brandSelected
    // addDefaultSetting
};