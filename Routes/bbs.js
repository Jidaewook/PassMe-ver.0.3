const express = require('express');
const expressJwt = require('express-jwt');
const router = express.Router();
const bbsModel = require('../Models/bbs');

// req.user._id 에 로그인 한 사람의 정보를 태우고 확인하는 과정
const requireLogin = expressJwt({
    secret: process.env.JWT_SECRET || "asdf1q2w"
});

// 게시판 데이터 불러오기
router.get('/', requireLogin, (req, res) => {
    bbsModel
        .find()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                bbsInfo: docs
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message
            })
        });
})

//게시판 데이터 등록하기
router.post('/write', requireLogin,(req, res) => {
    const {title, desc, category} = req.body;

    const newUser = new bbsModel({
        title, desc, category, 
        user: req.user._id
    })

    newUser
        .save()
        .then(user => {
            res.status(200).json({
                userInfo: user
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message     
            })
        });
})

router.patch('/', (req, res) => {
    res.status(200).json({
        msg: 'bbs patch'
    })
})

router.delete('/delete/:id', requireLogin, (req, res) => {
    bbsModel
        .findByIdAndRemove(req.params.id)
        .then(result => {
            console.log(result)

            if(!result) {
                return res.status(400).json({
                    msg: 'cannot find BBS ID'
                })
            }

            res.status(200).json({
                msg: 'success delete' + req.params.id
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message
            })
        });
})

module.exports = router;