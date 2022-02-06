/******************************************************************************************** */
/**Authentification de la requête                                                    */
/******************************************************************************************** */

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    //Ajout du token dans la requête
    req.token = jwt.verify(token, process.env.TOKEN_KEY);
    
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error:'mauvaise authentification!!'});
  }
};