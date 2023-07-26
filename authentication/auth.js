const jwt = require('jsonwebtoken')

const getIdFromJWT = async (req, res, next) => {
    try {
      const secret = 'this is my secret token, dont stole it please';
      const token = req.cookies.jwt;
  
      if (!token) {
 
        return next();
    
      }

      const decodedToken = jwt.verify(token, secret);
 
      const userId = decodedToken.id;
  
      req.userId = userId;
      next();

    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
  
  module.exports = getIdFromJWT;