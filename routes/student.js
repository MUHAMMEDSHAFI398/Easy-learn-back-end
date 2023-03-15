const express = require('express');
const studentRouter = express();
const studentController = require('../controllers/student');
const verifyToken = require('../middlewares/Authorization')


studentRouter.post('/login', studentController.login)

studentRouter.get('/home',verifyToken.verifyTokenStudent, studentController.getHome)

studentRouter.get('/attendance-data', verifyToken.verifyTokenStudent, studentController.attenDanceData)

studentRouter.get('/mark-data', verifyToken.verifyTokenStudent, studentController.getMarkDetails)

studentRouter.post('/letter', verifyToken.verifyTokenStudent, studentController.postLetter)

studentRouter.get('/leave-history' , verifyToken.verifyTokenStudent, studentController.getLeaveHistory)

studentRouter.get('/get-fee/:id', verifyToken.verifyTokenStudent, studentController.getFeeDetails)

studentRouter.post('/fee-payment/:id', verifyToken.verifyTokenStudent, studentController.feePayment)

studentRouter.post('/verify-payment', verifyToken.verifyTokenStudent, studentController.verifyFeePayment)

studentRouter.get('/payment-details', verifyToken.verifyTokenStudent, studentController.paymentDetails)






module.exports = studentRouter 