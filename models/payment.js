const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        registerId: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        name:{
            type:String
        },
        batch:{
            type: String,
        },
        amount: {
            type: Number
        },
        type:{
           type:String
        },
        status:{
          type:String,
          default:"Pending"
        }

    },
    { timestamps: true }
);


const payment = mongoose.model("payment", paymentSchema);
module.exports = payment