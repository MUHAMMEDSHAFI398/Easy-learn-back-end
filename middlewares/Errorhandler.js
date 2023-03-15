const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something wnet wrong');
  };
  
  module.exports = errorHandler;
  