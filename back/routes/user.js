/******************************************************************************************** */
/**Configuration des routes USER                                                              */
/******************************************************************************************** */

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); //POST /api/auth/signup
router.post('/login', userCtrl.login);   //POST /api/auth/login



/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = router;