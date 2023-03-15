const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const studentSchema = new Schema(
  {
    registerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentPhone: {
      type: Number,
      required: true,
    },
    address: {
      house_name: {
        type: String,
        trim: true,
      },
      place: {
        type: String,
        required: true,
        trim: true,
      },
      post: {
        type: String,
        required: true,
        trim: true,
      },
      pin: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
    education: {
      type: String,
      required: true,
      trim: true,
    },
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    pendingFee: {
     type:Number
    },
    performance:{
     type:Number,
     default:0
    },
    avgAttendance:{
      type:Number,
     default:0
    },
    attendance: {
      type: [
        {
          month: {
            type: Date
          },
          workingDays: {
            type: Number
          },
          noOfDaysPresent: {
            type: Number
          },
          percent: {
            type: Number
          }
        }
      ],
      default: [],

    },
    myLeaves: {
      type: [
        {
          appliedDate:{
            type: Date
          },
          from: {
            type: Date
          },
          to:{
            type:Date
          },
          letter: {
            type: String
          },
          status: {
            type: String,
            default: "Pending"
          },
          reason:{
           type:String,
           default:""
          }
        }
      ],
      default: [],
    },
    markdetails: {
      type: [
        {
          month: {
            type: Date
          },
          percentage: {
            type: Number
          },
          subjectMarks: {
            type: [
              {
                subject: {
                  type: String
                },
                mark: {
                  type: Number
                },
              }
            ]
          },


        }
      ],
      default: []
    },
    image: [{
      url: {
        type: String
      },
      filename: {
        type: String
      }
    }],
    isBlocked: {
      type: Boolean
    }
  },
  { timestamps: true }
);

const student = mongoose.model("student", studentSchema);
module.exports = student