const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const router = express.Router();
const userModel = require('../Models/user');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// req.user._id 에 로그인 한 사람의 정보를 태우고 확인하는 과정
const requireLogin = expressJwt({
    secret: process.env.JWT_SECRET
});

// 회원가입
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
            const token = jwt.sign(
                {name, email, password},
                process.env.JWT_ACCOUNT_ACTIVATION,
                {expiresIn: '10m'}
            );
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Account activation link',
                html: `
                    <h1>Please use the following link to activate your account</h1>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
            };
            sgMail
                .send(emailData)
                .then(sent => {
                    return res.status(200).json({
                        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                    });

                })  
                .catch(err =>{
                    return res.json({
                        message: err.message
                    });
                });

        });


        // let newUser = new userModel({ name, email, password});

        // newUser
        //     .save((err, success) => {
        //         if(err){
        //             return res.status(400).json({
        //                 error: err.message
        //             });
        //         }
        //         const token = jwt.sign(
        //             {name, email, password},
        //             process.env.JWT_ACCOUNT_ACTIVATION,
        //             {expiresIn: '10m'}
        //         );

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
                    

            //     res.json({
            //         message: 'Signup success! Please signin', 
            //         tokeninfo: token
            //     })
            // });
   
});


//로그인
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

// 패스워드 찾기, put = patch
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


// 패스워드 재설정
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


// 회원가입시 계정 활성화 위한 이메일 확인
router.post('/account-activation', (req, res) => {
    // const {token} = req.body;
    // if(token) {
    //     jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded){
    //         if(err) {
    //             return res.status(401).json({
    //                 error: 'Expired link. Signup again'
    //             });
    //         }
    //         const {name, email, password} = jwt.decode(token);

    //         const user = new userModel( name, email, password );

    //         user
    //             .save((err, user) => {
    //                 if(err){ 
    //                     return res.status(401).json({
    //                         error: 'Error saving user in database. Try signup again'
    //                     });
    //                 } 
    //                 return res.json({
    //                     message: 'Signup success. Please Signin'
    //                 });
    //             });
            
    //     });
    // } else {
    //     return res.json({
    //         message: 'Something went wrong. Try again.'
    //     });
    // }
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            if (err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                });
            }

            const { name, email, password } = jwt.decode(token);

            const user = new userModel({ name, email, password });

            user
                .save((err, user) => {
                    if (err) {
                        console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                        return res.status(401).json({
                            error: 'Error saving user in database. Try signup again'
                        });
                    }
                    return res.json({
                        message: 'Signup success. Please signin.'
                    });
                });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again.'
        });
    }
});

router.get('/:user_id', requireLogin, (req, res) => {
    const userID = req.params.user_id;
    userModel
        .findById(userID)
        .exec((err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'User not found'
                });
            } 
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);

            // 패스워드 쪽은 undefined되어서 안나오고, user정보를 json으로 받아오게 된다. 
            // {
            //     "role": "subscriber",
            //     "_id": "5dfed423fe8d280b8f2bd6f7",
            //     "name": "test02",
            //     "email": "dw4157@naver.com",
            //     "createdAt": "2019-12-22T02:25:39.676Z",
            //     "updatedAt": "2019-12-22T02:25:39.676Z",
            //     "__v": 0
            // }
        });
                
});

//requireLogin은 유저정보가 필요한 모든 함수값에는 반드시 들어가야 하고, 이게 들어가야 user라는 오브젝트(객체-_id, email, passwrod 등 model에 있는 값을 들고 있는 존재)를 불러오거나 사용할 수 있다. 
router.put('/update', requireLogin, (req, res) => {
    const {name, password} = req.body;

    userModel
        // 접속된 토큰에서의 user _id를 데려온다.
        .findById(req.user._id)
        .exec((err, user) => {
            if(err || !user){
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
            if(password){
                if(password.length < 6){
                    return res.status(400).json({
                        error: 'Password should be min characters long'
                    });
                } else {
                    user.password = password;
                }

            }
            //exec에서의 err를 위에서 밟고, err를 다 밟은 후 user의 exec단계로 넘어간다.
            user.save((err, updatedUser) => {
                if(err){
                    console.log('USER update error', err);
                    return res.status(400).json({
                        error: 'User update failed'
                    });
                } 
                updatedUser.hashed_password = undefined;
                updatedUser.salt = undefined;
                res.json(updatedUser);
            });

        });


});


module.exports = router;