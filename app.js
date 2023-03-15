const express = require('express');
const app = express();
const officeRouter = require('./routes/office');
const studentRouter = require('./routes/student');
const teacherRouter = require('./routes/teacher');
const dbconnect = require("./config/databaseConnection");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middlewares/Errorhandler")
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

// const fileUpload = require("express-fileupload");

dbconnect.dbconnect();
dotenv.config()
// app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/office", officeRouter);
app.use("/teacher", teacherRouter);
app.use("/student",  studentRouter);
   
app.use(errorHandler);

app.listen(process.env.PORTNO, () => {
    console.log("server started listening to port 5000");
});
 