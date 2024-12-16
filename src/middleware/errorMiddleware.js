function errorMiddleware(err, req, res, next) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
  
  module.exports = errorMiddleware;