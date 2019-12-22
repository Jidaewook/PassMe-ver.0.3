const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const router = express.Router();
const userModel = require('../Models/user');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
                const token = jwt.sign(
                    {name, email, password},
                    process.env.JWT_ACCOUNT_ACTIVATION,
                    {expiresIn: '10m'}
                );

                // 이메일 인증 코드(센드그리드 활용)
                // const emailData = {
                //     from: 'psatdoctor@naver.com',
                //     to: email,
                //     subject: 'ACCOUNT activation link',
                //     html: `
                //         <h1>Please use the following link to activate your account</h1>
                //         <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                //         <hr />
                //         <p>This email may contain sensetive information</p>
                //         <p>${process.env.CLIENT_URL}</p>
                //         `}
                // sgMail
                //     .send(emailData)
                //     .then(sent => {
                //         return res.status(200).json({
                //             message: `Email has been send to ${email}. Follow the instruction to activate your account`
                //         });
                //     })
                //     .catch(err => {
                //         return res.json({
                //             message: err.message
                //         });
                //     });
                    

                res.json({
                    message: 'Signup success! Please signin', 
                    tokeninfo: token
                })
            });
   
});

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    userModel
        .findOne({email})
        .exec((err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'User with that email does not exist. please signup'
                });
            }
            if (!user.authenticate(password)){
                return res.status(400).json({
                    error: 'Email and password do not match'
                });
            }
            const token = jwt.sign({
                _id: user._id
            }, 
            process.env.JWT_SECRET, {expiresIn: '7d'});
            const {_id, name, email, role} = user;
            return res.status(200).json({
                tokeninfo: token,
                user: {_id, name, email, role}
            });
        })
});

// put = patch
router.put('/forgot', (req, res) => {
    const {email} = req.body;

    userModel
        .findOne({email}, (err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'User with that email does not exist'
                });
            }
            const token = jwt.sign(
                {_id: user._id, name: user.name },
                process.env.JWT_RESET_PASSWORD,
                {expiresIn: '10m'}
            )
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Password Reset Link`,
                html: 
                    `
                        <h1>Please use the following link to reset your password</h1>
                        <p>${process.env.CLIENT_URL}/auth/password/reset${token}</p>
                        <hr />
                        <p>This email may contain sensetive information</p>
                        <p>${process.env.CLIENT_URL}</p>

                    `
            };
            return user
                .updateOne({ resetPasswordLink: token }, (err, success) => {
                    if(err){
                        return res.status(400).json({
                            error: 'Database connection error on user password forgot request'
                        });

                    } else {
                        sgMail
                            .send(emailData)
                            .then(setn => {
                                return res.json({
                                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                                });
                            
                            })
                            .catch(err => {
                                return res.json({
                                    message: err.message
                                });
                            });
                    };

                })
        })



});

router.put('/reset', (req, res) => {
    const {name, password} = req.body;

    userModel
        .findOne({_id: req.user._id}, (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            } 
            if(!name){
                return res.status(400).json({
                    error: 'Name is required'
                });
            } else {
                user.name = name;
            }
            if(password) {
                if(password.length < 6) {
                    return res.status(400).json({
                        error: 'Password should be min 6 characters long'
                    });
                } else {
                    user.password = password;
                }
            }
            user.save((err, updatedUser) => {
                if(err) {
                    console.log('USER UPDATE ERROR', err);
                    return res.status(400).json({
                        error: 'USER UPDATE FAILED'
                    });
                }
                updatedUser.hashed_password = undefined;
                updatedUser.salt = undefined;
                res.json(updatedUser);
            });

        });
});



module.exports = router;