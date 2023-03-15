const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const teacherSchema = new Schema(
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
    date_of_birth: {
      type: Date,
      required: true
    },
    gender: {
      required: true,
      type: String,

    },
    salary: {
      required: true,
      type: Number,

    },
    address: {
      house_name: {
        type: String,
        required: true,
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
        type: Number,
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
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    remarks: {
      type: String,
    },
    myBatch: {
      default: "",
      type: String
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    image: [{
      url: {
        type: String
      },
      filename: {
        type: String
      }
    }],
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
    isBlocked: {
      type: Boolean
    }
  },
  { timestamps: true }
);

const teacher = mongoose.model("teacher", teacherSchema);
module.exports = teacher