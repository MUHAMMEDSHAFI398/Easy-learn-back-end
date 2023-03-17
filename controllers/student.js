const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const batch = require('../models/batch');
const student = require('../models/student')
const payment = require('../models/payment')
const bcrypt = require('bcrypt');
const helpers = require('../helpers/helpers')
dotenv.config();
const crypto = require('crypto')
const Razorpay = require('razorpay');
const mongoose = require("mongoose");




const login = async (req, res,next) => {
    const data = req.body
    try {
        const studentData = await student.findOne({ registerId: data.registerId })
        if (studentData) {
            const passwordMatch = await bcrypt.compare(data.password, studentData.password)
            if (passwordMatch) {
                const payload = {
                    registerId: data.registerId,
                };
                jwt.sign(
                    payload,
                    process.env.STUNDENT_SECRET,
                    {
                        expiresIn: 3600000,
                    },
                    (err, token) => {
                        if (err) console.error("There is some error in token", err);
                        else {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`,
                            });
                        }
                    }
                );
            } else {
                res.json({ error: "Invalid registerId or password" })
            }
        } else {
            res.json({ error: "Invalid registerId or password" })
        }

    } catch (err) {
        next(err)
    }
}
const getHome = async (req, res,next) => {
    const id = req.registerId
    try {
        const studentData = await student.findOne({ registerId: id })
        res.json({ studentData: studentData })
    } catch (err) {
        next(err)
    }
}
const getMarkDetails = async (req, res,next) => {
    const studentId = req.registerId
    try {
        const markdetails = await student.aggregate([
            {
                $match: {
                    registerId: studentId
                }
            },
            {
                $project: {
                    _id: 0,
                    markdetails: 1
                }
            }
        ])
        const sortedMarkDeatails = markdetails[0].markdetails.sort((a, b) => b.month - a.month)
        res.status(200).json({
            markdetails: sortedMarkDeatails
        })
    } catch (err) {
        next(err)
    }

}
const attenDanceData = async (req, res,next) => {
    const id = req.registerId
    try {
        const attendanceDatas = await student.aggregate([
            {
                $match: {
                    registerId: id
                }
            },
            {
                $project: {
                    attendance: 1
                }
            }
        ])
        const attendacearray = await attendanceDatas[0]?.attendance?.sort((a, b) => b.month - a.month)
        res.json({
            status: true,
            attendanceData: attendacearray
        })
    } catch (err) {
        next(err)
    }
}
const postLetter = async (req, res,next) => {
    const id = req.registerId
    const today = new Date();
    const data = {
        appliedDate: today,
        from: req.body.from,
        to: req.body.to,
        letter: req.body.leaveLetter,
        status: "Pending",
        reason: ""
    }
    try {
        await student.updateOne(
            {
                registerId: id
            },
            {
                $push: {
                    myLeaves: data
                }
            }
        )
        res.json({
            status: true,
        })
    } catch (err) {
        next(err)
    }
}
const getLeaveHistory = async (req, res,next) => {
    const id = req.registerId
    try {
        const leaveHistory = await student.aggregate([
            {
                $match: {
                    registerId: id
                }
            },
            {
                $unwind: "$myLeaves"
            },
            {
                $project: {
                    myLeaves: 1,
                }
            },
            {
                $sort: {
                    "myLeaves.appliedDate": -1,
                }
            }
        ])
        res.json({
            status: true,
            leaveHistory: leaveHistory
        })
    } catch (err) {
        next(err)
    }
}
const getFeeDetails = async (req, res,next) => {
    const batchId = req.params.id
    const studentId = req.registerId
    try {
        const courseFee = await batch.aggregate([
            {
                $match: {
                    registerId: batchId
                }
            },
            {
                $project: {
                    _id: 0,
                    fee: 1
                }
            }
        ])
        const pendingFee = await student.aggregate([
            {
                $match: {
                    registerId: studentId
                }
            },
            {
                $project: {
                    _id: 0,
                    pendingFee: 1
                }
            }
        ])
        const installmentAmount = ((courseFee[0].fee) / 4).toFixed(2)
        res.status(200).json({
            totalFee: courseFee[0].fee,
            pendingFee: pendingFee[0].pendingFee,
            installmentAmount: installmentAmount
        })
    } catch (err) {
        next(err)
    }
}

const feePayment = async (req, res,next) => {
    const studentId = req.registerId
    const batchId = req.params.id
    let amountToPay;
    try {
        if (req.body.option === "One time") {
            const pendingFee = await student.aggregate([
                {
                    $match: {
                        registerId: studentId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        pendingFee: 1
                    }
                }
            ])
            amountToPay = pendingFee[0].pendingFee
        } else {
            const courseFee = await batch.aggregate([
                {
                    $match: {
                        registerId: batchId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fee: 1
                    }
                }
            ])
            const installmentAmount = ((courseFee[0].fee) / 4).toFixed(2)
            amountToPay = installmentAmount
        }

    } catch (err) {
        next(err)
    }
    try {

        const paymentData = await payment.create({
            registerId: studentId,
            batch: batchId,
            amount: amountToPay,
            status: "Cancelled",
            type:req.body.option
        })
        const reffereceId = paymentData._id
        const instance = new Razorpay({
            key_id: process.env.KEYID,
            key_secret: process.env.KEYSECRET,
        });
        let options = {
            amount: amountToPay * 100, // converting  paise to rupay
            currency: "INR",
            receipt: "" + reffereceId
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                next(err);
            } else {
                res.status(200).json({ order: order })
            }
        })
    } catch (err) {
        next(err)
    }
}
const verifyFeePayment = async (req, res, next) => {
    const studentId = req.registerId
    try {
        const details = req.body;
        let hmac = crypto.createHmac("sha256", process.env.KEYSECRET);
        hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
        hmac = hmac.digest("hex");
        if (hmac == details.payment.razorpay_signature) {

            const objId = mongoose.Types.ObjectId(details.details.order.receipt);
            await payment.updateOne(
                {
                    _id: objId
                },
                {
                    $set: {
                        status: "Paid"
                    }
                }
            )
            const paidAmount = (details.details.order.amount) / 100
            await student.updateOne(
                {
                    registerId: studentId
                },
                {
                    $inc: {
                        pendingFee: -paidAmount
                    }
                }
            )
            res.status(200).json({ message: "payment varified successfullly" })
        } else {
            res.status(400).json({ message: "Invalid signature" })
        }
    } catch (err) {
        next(err)
    }

}

const paymentDetails = async (req, res, next) => {
    const studentId = req.registerId
    try {
        const paymentDetails = await payment.find(
            {
                registerId: studentId, status: "Paid"
            }
        )
        res.status(200).json({
            paymentDetails:paymentDetails 
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    login,
    getHome,
    getMarkDetails,
    attenDanceData,
    postLetter,
    getLeaveHistory,
    getFeeDetails,
    feePayment,
    verifyFeePayment,
    paymentDetails
}   