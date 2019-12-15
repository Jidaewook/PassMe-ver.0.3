const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const router = express.Router();
const userModel = require('../Models/user');
const sgMail = require('@sendgrid/mail');

router.post('/register', (req, res) => {
   const {name, email, password} = req.body;
   userModel
        .findOne({email})
        .exec((err, user) => {
            if(user) {
                return res.status(400).json({
                    error: 'Email is taken'
                });
            } 
        });
        let newUser = new userModel({ name, email, password});

        newUser
            .save((err, success) => {
                if(err){
                    return res.status(400).json({
                        error: err.message
                    });
                }
                res.json({
                    message: 'Signup success! Please signin', 
                    userinfo: newUser
                })
            });
   
});

router.post('/login', (req, res) => {
    res.status(200).json({
        msg: 'User login'
    })
})

module.exports = router;