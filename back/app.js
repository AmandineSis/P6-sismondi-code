/**************************************************************************************** */
/*********                   APPLICATION EXPRESS                                ********* */
/**************************************************************************************** */

const express = require('express'); 
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express(); 

const path = require('path');
require('dotenv').config();
/******************************************************************************************** */
/**Connexion à la base de donnée MongoDB                                                      */
/******************************************************************************************** */
const mongoDB = mongoose.connect(process.env.DB_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


/******************************************************************************************** */
/**Sécurisation des en-têtes HTTP                                                      */
/******************************************************************************************** */
  
app.use(helmet());

/******************************************************************************************** */
/**CORS - Paramètrage des en-têtes                                                                                      */
/******************************************************************************************** */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/******************************************************************************************** */
/**Mise à disposition du body des requêtes avec comme Content-type: application/json
/**  directement sur l'objet requête.
/******************************************************************************************** */
app.use(express.json()); 


/******************************************************************************************** */
/**Logique globale de l'application                                                           */
/******************************************************************************************** */

/**Gestion de la ressource Image de manière statique */
app.use('/images', express.static(path.join(__dirname, 'images'))); 

/**USERS */
app.use('/api/auth', userRoutes);

/**SAUCES */
app.use('/api/sauces', sauceRoutes);


/******************************************************************************************** */
/**Exportation de l'application                                                               */
/******************************************************************************************** */
module.exports = app;