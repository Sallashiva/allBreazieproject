const jwt = require('jsonwebtoken')
const Register = require('../model/register-model');

const auth = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({
    error: true,
    message: "Access Denied / Unauthorized request"
  });

  try {
    token = token.split(' ')[1]
    if (token === null || !token) return res.status(401).json({
      error: true,
      message: "Access Denied / Unauthorized request"
    });

    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    const register = await Register.findOne({
      _id: verifiedUser.userId
  })
    if (!verifiedUser) {
      return res.status(401).json({
        error: true,
        message: "Access Denied / Unauthorized request"
      });
    } else if(!register){
      return res.status(401).json({
        error: true,
        message: "Access Denied / Unauthorized request"
      });
    } else {
      next()
    }
  } catch (err) {
  }
}

module.exports = {
  auth
}