const express = require('express');
const officeRouter = express();
const officeController = require('../controllers/office');
const verifyToken = require('../middlewares/Authorization')
const uploadImage = require('../config/cloudinary')


officeRouter.post('/login', officeController.login)

officeRouter.post('/add-teacher', verifyToken.verifyTokenAdmin, uploadImage, officeController.addTeacher)

officeRouter.get('/teachers', verifyToken.verifyTokenAdmin, officeController.getTeachers)

officeRouter.get('/get-teacher/:id', verifyToken.verifyTokenAdmin, officeController.getTeacher)

officeRouter.patch('/edit-teacher/:id', verifyToken.verifyTokenAdmin, officeController.editTeacher)

officeRouter.patch('/block-teacher/:id', verifyToken.verifyTokenAdmin, officeController.blockTeacher)

officeRouter.patch('/unblock-teacher/:id', verifyToken.verifyTokenAdmin, officeController.unBlockTeacher)

officeRouter.get('/batches', verifyToken.verifyTokenAdmin, officeController.getBatches)

officeRouter.post('/add-batch', verifyToken.verifyTokenAdmin, officeController.addBatch)

officeRouter.get('/get-batch/:id', verifyToken.verifyTokenAdmin, officeController.getBatch)

officeRouter.get('/get-edit-batch/:id', verifyToken.verifyTokenAdmin, officeController.getEditBatch)

officeRouter.post('/add-student', verifyToken.verifyTokenAdmin, uploadImage, officeController.addStudent)

officeRouter.patch('/edit-batch/:id', verifyToken.verifyTokenAdmin, officeController.patchEditBatch)

officeRouter.get('/students', verifyToken.verifyTokenAdmin, officeController.getStudents)

officeRouter.patch('/block-student/:id', verifyToken.verifyTokenAdmin, officeController.blockStudent)

officeRouter.patch('/unblock-student/:id', verifyToken.verifyTokenAdmin, officeController.unBlockStudent)

officeRouter.get('/student/:id', verifyToken.verifyTokenAdmin, officeController.getStudent)

officeRouter.get('/available-batches', verifyToken.verifyTokenAdmin, officeController.getAvailableBatch)

officeRouter.get('/available-teachers', verifyToken.verifyTokenAdmin, officeController.getAvaliableTeachers)

officeRouter.get('/leave-applications', verifyToken.verifyTokenAdmin, officeController.getLeaveApplications)

officeRouter.patch('/leave-approve', verifyToken.verifyTokenAdmin, officeController.leaveApprove)

officeRouter.patch('/leave-reject', verifyToken.verifyTokenAdmin, officeController.leaveReject)

officeRouter.get('/dashboard', verifyToken.verifyTokenAdmin, officeController.getDashbordData)

officeRouter.get('/payments', verifyToken.verifyTokenAdmin, officeController.getPaymentData)

    









module.exports = officeRouter