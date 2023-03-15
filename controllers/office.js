const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const teacher = require('../models/teacher')
const batch = require('../models/batch');
const student = require('../models/student')
const payment = require('../models/payment')
const helpers = require('../helpers/helpers')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
dotenv.config();


module.exports = {
    login: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;

        if (process.env.officeEmail === email && process.env.officePassword === password) {
            const payload = {
                email: email,
            };
            jwt.sign(
                payload,
                process.env.ADMIN_SECRET,
                {
                    expiresIn: 3600000,
                },
                (err, token) => {
                    if (err) console.error("There is some error in token", err);
                    else {
                        res.json({
                            status: true,
                            email: email,
                            token: `Bearer ${token}`,
                        });
                    }
                }
            );
        } else {
            errors = "Incorrect email or password";
            res.json({ errors: errors })
        }
    },
    addTeacher: async (req, res, next) => {
        const data = req.body
        const registerId = await helpers.uniqueCodeGenerator('teacher')
        const image = {
            url: req.file.path,
            filename: req.file.filename
        }
        const password = data.date_of_birth
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            await teacher.create({
                registerId: registerId,
                name: data.name,
                phone: data.phone,
                email: data.email,
                date_of_birth: data.date_of_birth,
                gender: data.gender,
                salary: data.salary,
                qualification: data.qualification,
                experience: data.experience,
                remarks: data.remarks,
                isBlocked: false,
                image: image,
                password: hashedPassword,
                address: {
                    house_name: data.house_name,
                    place: data.place,
                    post: data.post,
                    pin: data.pin,
                    district: data.district,
                    state: data.state
                }

            })
            res.json({ success: true })
        } catch (err) {
            next(err)
        }




    },
    getTeachers: (req, res, next) => {

        teacher.find().then((teachers) => {
            res.json({
                status: true,
                teachers: teachers
            })
        })
    },
    getTeacher: (req, res) => {
        const id = req.params.id

        teacher.findOne({ _id: id }).then((teacher) => {
            res.json({
                status: true,
                teacher: teacher
            })
        })
    },
    editTeacher: (req, res, next) => {
        const data = req.body
        const id = req.params.id
        teacher.findByIdAndUpdate(id,
            {
                experience: data.experience,
                salary: data.salary
            },
            {
                new: true,
                runValidators: true
            }

        ).then((teacher) => {
            res.json({
                status: true,
                teacher: teacher
            })
        })
    },
    blockTeacher: (req, res, next) => {
        const id = req.params.id
        teacher.findByIdAndUpdate(
            { _id: id },
            {
                isBlocked: true
            },
            {
                new: true,
                runValidators: true
            }
        ).then((teacher) => {
            res.json({
                status: true,
                teacher: teacher
            })
        })
    },
    unBlockTeacher: (req, res, next) => {
        const id = req.params.id
        teacher.findByIdAndUpdate(
            { _id: id },
            {
                isBlocked: false
            },
            {
                new: true,
                runValidators: true
            }
        ).then((teacher) => {
            res.json({
                status: true,
                teacher: teacher
            })
        })
    },
    getAvaliableTeachers: async (req, res) => {

        try {
            const teachers = await teacher.find({ myBatch: "" })
            const allTeachers = await teacher.find()
            res.json({
                status: true,
                teachers: teachers,
                allTeachers: allTeachers
            })
        } catch (err) {

            next(err)
        }
    },

    addBatch: async (req, res, next) => {

        const data = req.body
        const batchId = await helpers.uniqueCodeGenerator('batch')
        await teacher.updateOne(

            { registerId: data.headOfTheBatch },
            {
                $set: {
                    myBatch: batchId
                }
            }
        )
        const startDate = new Date(data.startDate);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + parseInt(data.duration), startDate.getDate());

        batch.create({
            registerId: batchId,
            startDate: data.startDate,
            endDate: endDate,
            duration: data.duration,
            fee: data.fee,
            numberOfSeat: data.numberOfSeat,
            headOfTheBatch: data.headOfTheBatch,
            remarks: data.remarks,
            subjects: data.subjectValues
        }).then(() => {
            res.json({ status: true })
        })
    },
    getBatches: async (req, res, next) => {
        try {
            const batchData = await batch.aggregate([
                {
                    $lookup: {
                        from: "teachers",
                        localField: "headOfTheBatch",
                        foreignField: "registerId",
                        as: "teacher_data"
                    }
                }
            ])
            res.json({
                status: true,
                batches: batchData
            })
        } catch (err) {
            next(err)
        }


    },
    getBatch: async (req, res, next) => {
        const batchId = req.params.id

        try {
            const batchStudents = await student.find({ batch: batchId })
            const batchData = await batch.aggregate([
                {
                    $match: {
                        registerId: batchId
                    }
                },
                {
                    $lookup: {
                        from: "teachers",
                        localField: "headOfTheBatch",
                        foreignField: "registerId",
                        as: "teacher_data"
                    }
                }
            ])
            const numberOfSeat = batchData[0].numberOfSeat
            const batchFill = batchData[0].batchFill
            const availableSeat = numberOfSeat - batchFill

            res.json({
                status: true,
                batch: batchData,
                availableSeat: availableSeat,
                students: batchStudents
            })

        } catch (err) {
            next(err)
        }

    },
    getEditBatch: async (req, res, next) => {

        const id = req.params.id
        const objectId = mongoose.Types.ObjectId(id);

        try {
            const batchData = await batch.aggregate([
                {
                    $match: {
                        _id: objectId
                    }
                },
                {
                    $lookup: {
                        from: "teachers",
                        localField: "headOfTheBatch",
                        foreignField: "registerId",
                        as: "teacher_data"
                    }
                },
                {
                    $project: {
                        numberOfSeat: 1,
                        remarks: 1,
                        subjects: 1,
                        batchHeadId: '$headOfTheBatch',
                        headOfTheBatch: { $arrayElemAt: ["$teacher_data.name", 0] }
                    }
                }
            ])
            const teachers = await teacher.aggregate([
                {
                    $match: {}
                },
                {
                    $project: {
                        name: 1,
                        registerId: 1
                    }
                }
            ])
            const availableTeachers = await teacher.aggregate([
                {
                    $match: { myBatch: "" }
                },
                {
                    $project: {
                        name: 1,
                        registerId: 1
                    }
                }
            ])

            res.json({
                status: true,
                batchData: batchData,
                teachers: teachers,
                availableTeachers: availableTeachers
            })


        } catch (err) {
            next(err)
        }



    },
    patchEditBatch: async (req, res, next) => {

        const id = req.params.id
        const data = req.body
        const batchData = await batch.findOne({ _id: id })

        if (batchData.headOfTheBatch !== data.batchHeadId) {
            try {
                await teacher.updateOne(
                    {
                        myBatch: batchData.registerId
                    },
                    {
                        $set: {
                            myBatch: ""
                        }
                    }

                )
            } catch (err) {
                next(err)
            }
        }
        await teacher.updateOne(

            { registerId: data.batchHeadId },
            {
                $set: {
                    myBatch: batchData.registerId,
                }
            }
        )
        try {
            await batch.updateOne(
                { _id: id },
                {
                    $set: {
                        numberOfSeat: data.numberOfSeat,
                        remarks: data.remarks,
                        headOfTheBatch: data.batchHeadId,
                        subjects: data.subjectValues
                    }
                }
            )
            res.json({ status: true })
        } catch (err) {
            next(err)
        }
    },
    getAvailableBatch: async (req, res, next) => {

        try {
            const availableBatches = await batch.find(
                {
                    $expr: {
                        $lt: ["$batchFill", "$numberOfSeat"]
                    }
                }
            )
            res.json({
                status: true,
                batches: availableBatches
            })
        } catch (err) {
            next(err)
        }

    },
    addStudent: async (req, res, next) => {
        const data = req.body

        const registerId = await helpers.uniqueCodeGenerator('student')
        const image = {
            url: req.file.path,
            filename: req.file.filename
        }
        const password = data.dateOfBirth
        const hashedPassword = await bcrypt.hash(password, 10);

        try {

            const batchFee = await batch.aggregate([
                {
                    $match: {
                        registerId: data.batch
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fee: 1
                    }
                }
            ])
            await student.create({
                registerId: registerId,
                name: data.name,
                phone: data.phone,
                email: data.email,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                parentName: data.parentName,
                parentPhone: data.parentPhone,
                education: data.education,
                institute: data.institute,
                batch: data.batch,
                isBlocked: false,
                password: hashedPassword,
                pendingFee: batchFee[0].fee,
                image: image,
                address: {
                    house_name: data.house_name,
                    place: data.place,
                    post: data.post,
                    pin: data.pin,
                    district: data.district,
                    state: data.state
                }

            })
            await batch.updateOne(
                {
                    registerId: data.batch
                },
                {
                    $inc: { batchFill: 1 }
                }
            )
            res.json({ success: true })
        } catch (err) {
            next(err)
        }


    },
    getStudents: async (req, res, next) => {
        try {
            const students = await student.find()
            res.json({
                status: true,
                students: students
            })
        } catch (err) {
            next(err)
        }
    },
    blockStudent: async (req, res) => {

        try {
            const id = req.params.id;
            await student.updateOne(
                { _id: id },
                { isBlocked: true }
            )
            res.json({ status: true })
        } catch (err) {
            next(err)
        }
    },
    unBlockStudent: async (req, res, next) => {

        try {
            const id = req.params.id;
            await student.updateOne(
                { _id: id },
                { isBlocked: false }
            )
            res.json({ status: true })
        } catch (err) {
            next(err)
        }
    },
    getStudent: async (req, res, next) => {
        try {
            const id = req.params.id
            const studentData = await student.findOne({ _id: id })
            res.json({
                status: true,
                studentData: studentData
            })
        } catch (err) {
            next(err)
        }
    },
    getLeaveApplications: async (req, res, next) => {
        try {
            const leaveData = await teacher.aggregate([
                {
                    $match: {
                        myLeaves: { $exists: true }
                    }
                },
                {
                    $unwind: "$myLeaves"
                },
                {
                    $project: {
                        _id: 0,
                        myLeaves: 1,
                        registerId: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        "myLeaves.appliedDate": -1
                    }
                }
            ])

            res.json({
                status: true,
                leaveData: leaveData
            })
        } catch (err) {
            next(err)
        }
    },
    leaveApprove: async (req, res, next) => {
        try {
            const data = req.body
            await teacher.updateOne(
                {
                    registerId: data.id,
                    "myLeaves._id": data.arrayElementId
                },
                {
                    $set: {
                        "myLeaves.$.status": "Approved"
                    }
                }
            )
            res.json({ status: true })
        } catch (err) {
            next(err)
        }
    },
    leaveReject: async (req, res, next) => {
        try {
            const data = req.body
            await teacher.updateOne(
                {
                    registerId: data.id,
                    "myLeaves._id": data.arrayElementId
                },
                {
                    $set: {
                        "myLeaves.$.status": "Rejected",
                        "myLeaves.$.reason": data.reason

                    }
                }
            )

            res.json({ status: true })
        } catch (err) {
            next(err)
        }
    },
    getDashbordData: async (req, res, next) => {
        try {

            const studentsCount = await student.countDocuments()
            const batchCount = await batch.countDocuments()
            const teacherCount = await teacher.countDocuments()

            const activeBatchesTotalFee = await batch.aggregate([
                
                {
                    $match: {
                        endDate: { $gte: new Date() }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: { $multiply: ["$batchFill", "$fee"] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total" }
                    }
                }
            ])
            const totalPaidAmount = await payment.aggregate([
                {
                    $match:{
                        status:"Paid"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ])
            const feeCompletionRate = ((totalPaidAmount[0].total / activeBatchesTotalFee[0].total) * 100).toFixed(2)

            const batchData = await batch.aggregate([
                {
                    $project:{
                        _id:0,
                        batch:"$registerId",
                        students:"$batchFill",
                        seats:"$numberOfSeat"
                    }
                }
            ])
            const teacherData = await teacher.aggregate([
                {
                    $project:{
                        _id:0,
                        name:1,
                        salary:1,
                        experience:1
                    }
                }
            ])
            res.json({
                studentsCount, batchCount, teacherCount, feeCompletionRate,batchData,teacherData
            })

        } catch (err) {

            next(err)
        }

    },
    getPaymentData: async (req, res, next) => {
        try {
            const paymentData = await payment.aggregate([
                {
                    $match: {}
                },
                {
                    $lookup: {
                        from: "students",
                        localField: "registerId",
                        foreignField:"registerId",
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    name: 1
                                }
                            }
                        ],
                        as: "studentData"
                    }
                },
                {
                    $unwind: "$studentData"
                },
                {
                    $project:
                    {
                        registerId: 1,
                        batch: 1,
                        amount: 1,
                        type: 1,
                        status: 1,
                        createdAt:1,
                        name: "$studentData.name"
                    }
                }
            ])
            res.status(200).json({ paymentData })
        } catch (err) {
            next(err)
        }
    }

}

