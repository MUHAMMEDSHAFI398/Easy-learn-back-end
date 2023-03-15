const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// mongoose.set('strictQuery', true);
module.exports = {
  dbconnect: () => {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("database connected successfully");
      })
      .catch((err) => console.log("error" + err));
  },
};