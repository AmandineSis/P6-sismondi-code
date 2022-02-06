/******************************************************************************************** */
/**Création d'un schéma de données USER                                                       */
/******************************************************************************************** */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true }
});

userSchema.plugin(uniqueValidator); 

/******************************************************************************************** */
/**Exportation du router                                                                      */
/******************************************************************************************** */
module.exports = mongoose.model('User', userSchema); 