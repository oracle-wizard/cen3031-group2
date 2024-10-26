const customMiddleware = (req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`);
    next();
  };

export default customMiddleware