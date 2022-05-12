const Visitor = require('../model/visitor-model');
const Employee = require('../model/employee-model');
const Timeline = require('../model/timeline-model');
const jwt = require('jsonwebtoken')
const getEmployeesTimeline = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, process.env.jwtSecret);
        let userId = verifiedUser.userId
        let startDate = req.params.startDate
        let endDate = req.params.endDate
        if (startDate == "All") {
        const timeline = await Timeline.find({
            userId
        }).sort({
            created_at: -1
        })
        res.status(200).json({
            error: false,
            timeline
        })
    }else{
        let timeline = []
        const timelineData = await Timeline.find({
                        userId,
                    }).sort({
                        created_at: -1
                    })
                    timelineData.forEach((ele, i) => {
                        if (new Date(startDate) >= new Date(ele.loginTime) && new Date(endDate) <= new Date(ele.loginTime)) {
                            timeline.push(ele)
                        }
                    })
                    res.status(200).json({
                     error: false,
                     timeline
                     })
    }
    } catch (err) {
        next(err.message)
    }
}

module.exports = {
    getEmployeesTimeline
}