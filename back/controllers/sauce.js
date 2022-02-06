/******************************************************************************************** */
/**SAUCES CONTROLLER                                                                          */
/******************************************************************************************** */

/***********************************************************/
/**Importation du schéma sauce et du module fs de node.js  */
/********************************************************* */
const Sauce = require("../models/sauce");
const fs = require('fs');
const mongoose = require('mongoose');

/***********************************************************/
/**Implémentation CRUD et like                             */
/********************************************************* */


//Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces);
        })
        .catch(error => {
            res.status(400).json({ error });  
    mongoose.connection.close();          
    });

};

//Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
    mongoose.connection.close();
};

//Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    let sauce = new Sauce({
        userId: req.token.userId,
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //sauvegarde de la sauce créée dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
    mongoose.connection.close();
};

//Modification d'une sauce
exports.updateSauce = (req, res, next) => {
    Sauce
        .findOne({ _id: req.params.id })
        .then(sauce => {

            //vérifie si l'utilisateur est autorisé à faire la modification
            if (sauce.userId !== req.token.userId) {
                return res.status(401).json({ error });
            }

            // Récupération et suppression de l'image sur le serveur avant modification
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw 'error';
                });
            }

            //Modification de l'objet Sauce : 2 cas possibles (avec fichier image ou sans fichier image)
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };

            //Mise à jour de la base de donnée
            Sauce
                .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
    mongoose.connection.close();
}

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce
        .findOne({ _id: req.params.id })
        .then(sauce => {

            //vérifie si l'utilisateur est autorisé à faire la modification
            if (sauce.userId === req.token.userId) {
                const filename = sauce.imageUrl.split('/images/')[1];

                //supprime l'image du serveur
                fs.unlink(`images/${filename}`, () => {

                    //supprime la sauce de la base de données
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            } else {
                return res.status(401).json({ messgae: "utilisateur non autorisé !" })
            }
        })
        .catch(error => res.status(500).json({ error }));
    mongoose.connection.close();
};


exports.userLike = (req, res, next) => {      
    const userId = req.body.userId;
    const like = req.body.like;

    Sauce
        .findOne({ _id: req.params.id })
        .then(sauce => {
            //vérifie si l'utilisateur est autorisé à faire la modification
            if (userId !== req.token.userId) {
                return res.status(401).json({ error });
            }
            //Implémentation des likes :
            //Like = 1
            if (like === 1 && !sauce.usersLiked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: 1 },
                            $push: { usersLiked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: 'Vous avez aimé cette sauce !' }))
                    .catch(error => res.status(400).json({ error }));
            //Like = -1          
            } else if (like === -1 && !sauce.usersLiked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: "Vous n'avez pas aimé cette sauce !" }))
                    .catch(error => res.status(400).json({ error }));

            //Like = 0 et userId est inclus dans le tableau usersLiked
            } else if (like === 0 && sauce.usersLiked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: "Vous n'avez plus d'avis sur cette saucec!" }))
                    .catch(error => res.status(400).json({ error }));

            //Like = 0 et userId est inclus dans le tableau usersDisliked            
            } else if (like === 0 && sauce.usersDisliked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: " Vous n'avez plus d'avis sur cette sauce !"}))
                    .catch(error => res.status(400).json({ error }));

            } else {
                return res.status(400).json({ error })
            }
        })
        .catch(error => res.status(500).json({ error }));
    mongoose.connection.close();
};



