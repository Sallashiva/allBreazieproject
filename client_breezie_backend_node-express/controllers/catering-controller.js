const {Catering,cateringBeverage,cateringFood,GeneralCatering} = require("../model/catering-model");
const Register = require("../model/register-model");
const Employee = require("../model/employee-model");
const jwt = require('jsonwebtoken')

const fs = require("fs");

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

const getAllOrderContacts = async (req, res, next) => {
    try {
        const catering = await Catering.find();
        res.status(200).json({
            error: false,
            catering,
        });
    } catch (err) {
        next(err.message);
    }
};

const getCompanyOrderContacts = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        const registerId = verifiedUser.userId;
        const register = await Register.findOne({
            _id: registerId,
        });
        const catering = await Catering.findById(register.cateringId);
        res.status(200).json({
            error: false,
            catering,
        });
    } catch (err) {
        next(err.message);
    }
};

const addOrderContacts = async (req, res, next) => {
    try {
        const {
            employeeId,
            location,
            emailId,
            phone,
            isGeneralContact,
        } = req.body;
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        const registerId = verifiedUser.userId;
        const result = await Catering.find();
        let payload = null;
        let employee = null;

        if (employeeId) {
            employee = await Employee.findOne({
                _id: employeeId,
            });
            const {
                fullName,
                lastName,
                email,
                phone,
                location,
                _id
            } = employee;

            payload = {
                name: fullName + " " + lastName,
                emailId: email,
                phone,
                location,
                employeeId: _id,
            };
        } else {
            payload = {
                name: "General Catering",
                location,
                emailId,
                phone,
                isGeneralContact,
            };
        }
        if (
            (result.length === 1 && result[0].orderContacts.length === 0) ||
            result.length < 1
        ) {
            const catering1 = await Catering.insertMany([{
                orderContacts: payload,
            }, ]);
            await Register.updateOne({
                _id: registerId,
            }, {
                $set: {
                    cateringId: catering1[0]._id,
                },
            });
            res.status(200).json({
                error: false,
                catering1,
            });
        } else if (result.length > 0) {
            const register = await Register.findOne({
                _id: registerId,
            });
            const catering = await Catering.updateOne({
                _id: register.cateringId,
            }, {
                $push: {
                    orderContacts: payload,
                },
            }, {
                upsert: true,
            });
            res.status(200).json({
                error: false,
                catering,
            });
        }
    } catch (err) {
        next(err.message);
    }
};

const deleteOrderContacts = async (req, res, next) => {
    const {
        orderContactId
    } = req.body;
    try {
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        const userId = verifiedUser.userId;
        let register = await Register.findById({
            _id: userId,
        });
        const catering = await Catering.updateOne({
            _id: register.cateringId,
        }, {
            $pull: {
                orderContacts: {
                    _id: orderContactId,
                },
            },
        });
        res.status(200).json({
            error: false,
            catering,
        });
    } catch (err) {
        next(err.message);
    }
};

const getCateringBeverages = async (req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const catering = await cateringBeverage.find({
            userId
        });
        res.status(200).json({
            error: false,
            catering,
        });
    } catch (err) {
        next(err.message);
    }
}

const cateringBeverages = async (req, res, next) => {
    try {
       const { 
           bevergesName,
           price,
          }= req.body
          const userId = await getUserToken(req);
            if (req.file !== undefined) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/cateringBeverages/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };
                await s3.upload(params, async (error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await cateringBeverage.insertMany([{
                            imagePath: data.Location,
                            userId:userId,
                            bevergesName:bevergesName,
                            price:price
                        }]);
                        res.status(200).json({
                            error: false,
                            message: "Beverages and Image added successfully"
                        })
                    }
                })
            } else if(req.file === undefined){
                screensImages = await cateringBeverage.insertMany([{
                    userId:userId,
                    bevergesName:bevergesName,
                    price:price
                }]);
                res.status(200).json({
                    error: false,
                    message: "Beverages added successfully"
                })
            }else{
                res.status(400).json({
                    error: true,
                    message: 'Somthing Went Wrong'
                })
            }
      
    } catch (err) {
        next(err.message);
    }
  }

 

  const updateCateringBeverages = async (req, res, next) => {
    try {
        const { 
            bevergesName,
            price,
           }= req.body

         let screen = await cateringBeverage.findOne({
            _id: req.params.id
        });
        const userId = await getUserToken(req);
         if (screen.imagePath) {
            var image = screen.imagePath
            var split = image.split("/");
            var originalname = split[split.length-1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/cateringBeverages/${originalname}`,
            };
            await s3.deleteObject(params, async (err, data) => {
                if (err) {
                 }
                else {
                }
            });
            if (req.file !== undefined) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/cateringBeverages/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };
                await s3.upload(params, async (error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await cateringBeverage.updateMany({
                            _id:req.params.id ,
                        },{
                            imagePath: data.Location,
                            userId:userId,
                            bevergesName:bevergesName,
                            price:price
                        });
                        res.status(200).json({
                            error: false,
                            message: "Beverages and Image added successfully"
                        })
                    }
                })
            }else{
                screensImages = await cateringBeverage.updateMany({
                    _id:req.params.id ,
                },{
                    userId:userId,
                    bevergesName:bevergesName,
                    price:price
                });
                res.status(200).json({
                    error: false,
                    message: "Beverages and Image added successfully"
                })
            }
        }else  if (!screen.imagePath) {
            if (req.file !== undefined) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/cateringBeverages/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };
                await s3.upload(params, async (error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await cateringBeverage.updateMany({
                            _id:req.params.id ,
                        },{
                            imagePath: data.Location,
                            userId:userId,
                            bevergesName:bevergesName,
                            price:price
                        });
                        res.status(200).json({
                            error: false,
                            message: "Beverages and Image added successfully"
                        })
                    }
                })
            }else{
                screensImages = await cateringBeverage.updateMany({
                    _id:req.params.id ,
                },{
                    userId:userId,
                    bevergesName:bevergesName,
                    price:price
                });
                res.status(200).json({
                    error: false,
                    message: "Beverages and Image added successfully"
                })
            }
        }else {
            res.status(400).json({
                error: true,
                message: 'No Data to delete'
            })
        }
       } catch (err) {
           next(err.message);
       }

    }

  const deleteCateringBeverages = async (req, res, next) => {
    try {
         let screen = await cateringBeverage.findOne({
            _id: req.params.id
        });
         if (screen.imagePath) {
            var image = screen.imagePath
            var split = image.split("/");
            var originalname = split[split.length-1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/cateringBeverages/${originalname}`,
            };
            await s3.deleteObject(params, async (err, data) => {
                if (err) {
                 }
                else {
                    await cateringBeverage.deleteOne({
                        _id: req.params.id
                    });
                    res.status(200).json({
                        error: false,
                        message: 'Deleted Successfully',
                        _id: req.params.id
                    })
                }
            });
        } else if(!screen.imagePath){
            await cateringBeverage.deleteOne({
                _id: req.params.id
            });
            res.status(200).json({
                error: false,
                message: 'Deleted Data Successfully',
                _id: req.params.id
            })
        }
         else {
            res.status(400).json({
                error: true,
                message: 'No Data to delete'
            })
        }
       } catch (err) {
           next(err.message);
       }

    }


    //food items

    const getCateringFoods = async (req, res, next) => {
        try {
            const userId = await getUserToken(req);
            const catering = await cateringFood.find({
                userId
            });
            res.status(200).json({
                error: false,
                catering,
            });
        } catch (err) {
            next(err.message);
        }
    }
    
  const cateringFoods = async (req, res, next) => {
    try {
       const { 
           foodName,
           notes,
           price,
          }= req.body
          const userId = await getUserToken(req);
            if (req.file !== undefined) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/cateringFoods/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };
                await s3.upload(params, async (error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await cateringFood.insertMany([{
                            imagePath: data.Location,
                            userId:userId,
                            foodName:foodName,
                            notes:notes,
                            price:price
                        }]);
                        res.status(200).json({
                            error: false,
                            message: "Food and Image added successfully"
                        })
                    }
                })
            } else if(req.file === undefined){
                screensImages = await cateringFood.insertMany([{
                 userId:userId,
                 foodName:foodName,
                 notes:notes,
                 price:price
                }]);
                res.status(200).json({
                    error: false,
                    message: "Food added successfully"
                })
            }else{
                res.status(400).json({
                    error: true,
                    message: 'Somthing Went Wrong'
                })
            }
      
    } catch (err) {
        next(err.message);
    }
  }

  const updateCateringFood = async (req, res, next) => {
    try {
        const { 
            foodName,
            notes,
            price,
           }= req.body

         let screen = await cateringFood.findOne({
            _id: req.params.id
        });
        const userId = await getUserToken(req);
         if (screen.imagePath) {
            var image = screen.imagePath
            var split = image.split("/");
            var originalname = split[split.length-1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/cateringFoods/${originalname}`,
            };
            await s3.deleteObject(params, async (err, data) => {
                if (err) {
                 }
                else {
                }
            });
            if (req.file !== undefined) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/cateringFoods/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };
                await s3.upload(params, async (error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await cateringFood.updateMany({
                            _id:req.params.id ,
                        },{
                            imagePath: data.Location,
                            userId:userId,
                            foodName:foodName,
                            notes:notes,
                            price:price
                        });
                        res.status(200).json({
                            error: false,
                            message: "Beverages and Image added successfully"
                        })
                    }
                })
            }else{
                screensImages = await cateringFood.updateMany({
                    _id:req.params.id ,
                },{
                    userId:userId,
                    foodName:foodName,
                    notes:notes,
                    price:price
                });
                res.status(200).json({
                    error: false,
                    message: "Beverages and Image added successfully"
                })
            }
        }else  if (!screen.imagePath) {
            if (req.file !== undefined) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/cateringBeverages/${name}`,
                    Body: req.file.buffer,
                    ACL: "public-read-write",
                    ContentType: "image/jpeg"
                };
                await s3.upload(params, async (error, data) => {
                    if (error) {
                        res.status(404).json({
                            error: true,
                            message: "Error in Uploading Photo",
                        })
                    } else {
                        screensImages = await cateringFood.updateMany({
                            _id:req.params.id ,
                        },{
                            imagePath: data.Location,
                            userId:userId,
                            foodName:foodName,
                            notes:notes,
                            price:price
                        });
                        res.status(200).json({
                            error: false,
                            message: "Food Updated successfully"
                        })
                    }
                })
            }else{
                screensImages = await cateringFood.updateMany({
                    _id:req.params.id ,
                },{
                    userId:userId,
                    foodName:foodName,
                    notes:notes,
                    price:price
                });
                res.status(200).json({
                    error: false,
                    message: "Food Updated successfully"
                })
            }
        }else {
            res.status(400).json({
                error: true,
                message: 'No Data to delete'
            })
        }
       } catch (err) {
           next(err.message);
       }

    }

  const deleteCateringFood = async (req, res, next) => {
    try {
         let screen = await cateringFood.findOne({
            _id: req.params.id
        });
         if (screen.imagePath) {
            var image = screen.imagePath
            var split = image.split("/");
            var originalname = split[split.length-1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/cateringFoods/${originalname}`,
            };
            await s3.deleteObject(params, async (err, data) => {
                if (err) {
                 }
                else {
                    await cateringFood.deleteOne({
                        _id: req.params.id
                    });
                    res.status(200).json({
                        error: false,
                        message: 'Deleted Successfully',
                        _id: req.params.id
                    })
                }
            });
        }
        else if(!screen.imagePath){
            await cateringFood.deleteOne({
                _id: req.params.id
            });
            res.status(200).json({
                error: false,
                message: 'Deleted Data Successfully',
                _id: req.params.id
            })
        } else {
            res.status(400).json({
                error: true,
                message: 'No Data to delete'
            })
        }
       } catch (err) {
           next(err.message);
       }

    }


    const getGeneralData = async(req, res, next) => {
        try {
            const userId = getUserToken(req)
            const generalData = await GeneralCatering.find({
                userId
            })
            res.status(200).json({
                error: false,
                message: "General Catering fetched",
                generalData
            })
        } catch (err) {
            next(err.message);
        }
    }
    
    const generalCateringData = async(req, res, next) => {
        try {
            const {
                fullName,
                email,
                phoneNumber
            } = req.body;
            const userId = getUserToken(req)
            const genaral = await GeneralCatering.insertMany({
                fullName,
                email,
                phoneNumber,
                userId: userId,
            })
            res.status(200).json({
                error: false,
                message: "General Data added",
                genaral
            })
    
        } catch (err) {
            next(err.message);
        }
    }
    
    const deleteCateringData = async(req, res, next) => {
        try {
            await GeneralCatering.deleteOne({
                _id: req.params.id
            });
            res.status(200).json({
                error: false,
                message: "General  Data deleted"
            })
        } catch (err) {
            next(err.message);
        }
    }

     const getAllCateringData = async(req, res, next) =>{
        try {
            const userId = getUserToken(req)
            const generalData = await GeneralCatering.find({
                userId
            })
            const employeeData = await Employee.find({
                userId: userId,
                isCatering: true,
            });
            const finalResponse = generalData.concat(employeeData)
            res.status(200).json({
                error: false,
                finalResponse,
            });
        } catch (err) {
            next(err.message);
        }
    }

module.exports = {
    getAllOrderContacts,
    getCompanyOrderContacts,
    addOrderContacts,
    deleteOrderContacts,
    cateringBeverages,
    getCateringBeverages,
    deleteCateringBeverages,
    updateCateringBeverages,
    getCateringFoods,
    cateringFoods,
    updateCateringFood,
    deleteCateringFood,
    getGeneralData,
    generalCateringData,
    deleteCateringData,
    getAllCateringData
};