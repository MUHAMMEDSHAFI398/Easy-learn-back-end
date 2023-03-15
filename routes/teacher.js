const express = require('express');
const teacherRouter = express();
const teacherController = require('../controllers/teacher');
const verifyToken = require('../middlewares/Authorization')


teacherRouter.post('/login', teacherController.login)

teacherRouter.get('/home', verifyToken.verifyTokenTeacher, teacherController.getHome)

teacherRouter.patch('/update-profile', verifyToken.verifyTokenTeacher, teacherController.updateProfile)

teacherRouter.get('/my-students', verifyToken.verifyTokenTeacher, teacherController.getMyStudents)

teacherRouter.get('/each-student/:id', verifyToken.verifyTokenTeacher, teacherController.eachStudent)

teacherRouter.get('/my-batch', verifyToken.verifyTokenTeacher, teacherController.getMyBatch)

teacherRouter.post('/letter', verifyToken.verifyTokenTeacher, teacherController.postLetter)

teacherRouter.get('/leave-history', verifyToken.verifyTokenTeacher, teacherController.getLeaveHistory)

teacherRouter.get('/start-end', verifyToken.verifyTokenTeacher, teacherController.batchStartEndDate)

teacherRouter.post('/add-working-days', verifyToken.verifyTokenTeacher, teacherController.addWorkingDays)

teacherRouter.get('/month-work-days', verifyToken.verifyTokenTeacher, teacherController.monthlyWorkDays)

teacherRouter.get('/available-month', verifyToken.verifyTokenTeacher, teacherController.availableMonth)

teacherRouter.post('/add-attendance', verifyToken.verifyTokenTeacher, teacherController.addAttendance)

teacherRouter.get('/attendance-data/:id', verifyToken.verifyTokenTeacher, teacherController.attenDanceData)

teacherRouter.get('/batch-subjects/:id', verifyToken.verifyTokenTeacher, teacherController.getBatchSubjects)

teacherRouter.post('/add-marks', verifyToken.verifyTokenTeacher, teacherController.addStudentMark)

teacherRouter.get('/mark-data/:id', verifyToken.verifyTokenTeacher, teacherController.getMarkDetails)

teacherRouter.get('/student-Leaves', verifyToken.verifyTokenTeacher, teacherController.studenLeaves)

teacherRouter.patch('/leave-approve', verifyToken.verifyTokenTeacher, teacherController.studenLeavApprove)

teacherRouter.patch('/leave-reject', verifyToken.verifyTokenTeacher, teacherController.studentLeaveReject)

teacherRouter.get('/student-performance/:id', verifyToken.verifyTokenTeacher, teacherController.studentPerformance)

teacherRouter.get('/batch-performance', verifyToken.verifyTokenTeacher, teacherController.batchPerformance)









module.exports = teacherRouter 