const nodemailer = require('nodemailer');
const contacts= async(req, res, next) => {
try {
    const {
        name,
        email,
        phone,
        message
    } = req.body;
    console.log(req.body);

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
        to: process.env.WebsiteEmail,
        subject: "Enquiry mail ",
        html: `<h1><strong>Name: </strong>${name}</h1> </br>
        <h1><strong>Email: </strong>${email}</h1> </br>
        <h1><strong>Phone: </strong>${phone}</h1> </br>
        <h1><strong>Message: </strong>${message}</h1> </br>`,
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log("email sent"+ info.response)
            res.status(200).json({
                error: false,
                message: "Thankyou for reaching Us"
            })
        }
    })

}catch (err) {
    console.log(err);
    next(err.message);
}
}

module.exports = {
    contacts
}