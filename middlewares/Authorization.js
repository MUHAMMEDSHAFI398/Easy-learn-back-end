const jwt = require('jsonwebtoken');


const verifyTokenAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error('No token provided');
    error.statusCode = 401;
    return next(error);
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.ADMIN_SECRET);
    if(decoded) next();
  } catch (error) {
    next(error)
  }
};

const verifyTokenTeacher = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error('No token provided');
    error.statusCode = 401;
    return next(error);
  } 
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.TEACHER_SECRET);
    if(decoded){
      req.registerId = decoded.registerId;
      next();
    }
    
  } catch (error) {
    next(error)
  }
}; 


const verifyTokenStudent = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error('No token provided');
    error.statusCode = 401;
    return next(error);
  } 
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.STUNDENT_SECRET);
    if(decoded){
      req.registerId = decoded.registerId;
      next();
    }
  } catch (err) {
    next(err) 
  }
}; 

module.exports={
    verifyTokenAdmin,
    verifyTokenTeacher,
    verifyTokenStudent
}  