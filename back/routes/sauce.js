/******************************************************************************************** */
/**Configuration des routes SAUCES                                                            */
/******************************************************************************************** */

const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, sauceCtrl.getAllSauces); //GET api/sauces
router.get('/:id', auth, sauceCtrl.getOneSauce); //GET api/sauces/:id
router.post('/', auth, multer, sauceCtrl.createSauce);   //POST api/sauces
router.put('/:id', auth, multer, sauceCtrl.updateSauce);   //PUT api/sauces/:id
router.delete('/:id', auth, sauceCtrl.deleteSauce);   //DELETE api/sauces/:id
router.post('/:id/like', auth, sauceCtrl.userLike);   //POST api/sauces/:id/like


/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = router;