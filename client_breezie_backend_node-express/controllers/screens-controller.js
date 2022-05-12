const Screen = require('../model/screens-model');
const Aws = require('aws-sdk')

const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET // secretAccessKey is also store in .env file
})

const getAllimages = async (req, res, next) => {
    try {
        const screenData = await Screen.find();
        res.status(200).json({
            error: false,
            screenData
        })
    } catch (err) {
        res.status(404).json({
            error: true,
            message: "Try Again Later Server is Busy"
        })
    }
}

const addImages = async (req, res, next) => {
    try {
        const {
            imagePath
        } = req.body;
        const screen = await Screen.find();
        if (screen.length < 10) {
            if (req.file !== null) {
                var name = "Screen" + Math.floor(Math.random() * 10000 + 1) 
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `images/screens/${name}`,
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
                        screensImages = await Screen.insertMany([{
                            imagePath: data.Location,
                            selected: false
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

const selectScreen = async (req, res, next) => {
    try {
        await Screen.updateMany({
        }, {
            $set: {
                selected: false
            }
        });
        screensImages = await Screen.updateOne({
            _id: req.params.id
        }, {
            $set: {
                selected: true
            }
        });
        res.status(200).json({
            error: false,
            message: "Image Selected",
            screensImages
        })
    } catch (err) {
        next(err.message)
    }
}

const deleteScreens = async (req, res, next) => {
    try {
        let screen = await Screen.findOne({
            _id: req.params.id
        });
        if (screen) {
            var image = screen.imagePath
            var split = image.split("/");
            var originalname = split[split.length-1];
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `images/screens/${originalname}`,
            };
            await s3.deleteObject(params, async (err, data) => {
                if (err) {
                 }
                else {
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
        next(err.message)
    }
}

module.exports = {
    addImages,
    getAllimages,
    selectScreen,
    deleteScreens
}