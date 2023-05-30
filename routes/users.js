const mongoose = require('mongoose');
const router = require('express').Router();
const utils = require('../lib/utils');
const User = require('../model/user');
const passport = require('passport');

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are authorized" });
});

router.post('/login', function (req, res, next) {
    // console.log(req.body.username);
    // console.log(req.body.password);
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                res.status(401).json({ success: false, msg: "could not find user" });
            }

            const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

            if (isValid) {

                const tokenObject = utils.issueJWT(user);
                res.status(200).json({
                    success: true,
                    user: user,
                    token: tokenObject.token,
                    expiresIn: tokenObject.expires
                })
            } else {
                res.status(401).json({
                    success: false,
                    msg: "You enters wrong credentials"
                })
            }
        })
        .catch((err) => {
            next(err);
        })
});

router.post('/register', function (req, res, next) {
    const saltHash = utils.genPassword(req.body.password)

    const salt = saltHash.salt
    const hash = saltHash.hash

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    newUser.save()
        .then((user) => {
            const id = user._id
            const jwt = utils.issueJWT(user);
            res.json({ success: true, user: user, token: jwt.token, expiresIn: jwt.expires });
        })
        .catch(err => next(err));

});

router.get('/signout', (req,res) => {
    req.logout();
    res.status(200).json({success: true, msg: "You are successfully signed Out"});
})

module.exports = router;