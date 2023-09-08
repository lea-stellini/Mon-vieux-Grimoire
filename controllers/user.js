const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');
require('dotenv').config()

exports.signup = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(!regex.test(email) || password.length < 8){
        res.status(400).json({message: 'Informations incorrectes pour s\'inscrire'})
    } else {
        bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message : 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }    
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            return res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                   return res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'});
                } else {
                    res.status(200).json({
                        userId : user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            process.env.TOKEN,
                            {expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })

};