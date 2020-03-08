const express = require('express');
const expressJwt = require('express-jwt');
const router = express.Router();
const bbsModel = require('../Models/bbs');
const userModel = require('../Models/user');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }

};

const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});



// req.user._id 에 로그인 한 사람의 정보를 태우고 확인하는 과정
const requireLogin = expressJwt({
    secret: process.env.JWT_SECRET || "asdf1q2w"
});

// 게시판 데이터 불러오기
router.get('/', (req, res) => {
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


//상세 데이터 불러오기(게시판 내 게시물 중에 하나만)
router.get('/detail/:id', requireLogin, (req, res) => {
    const id = req.params.id

    bbsModel
        .findById(id)
        .then(result => {
            res.status(200).json({
                bbsInfo: result
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message
            })
        });
});



//메인노출용 PSAT게시판(카테고리) 불러오기
router.get('/category/psat', (req, res) => {

    bbsModel
        //find는 복수 도큐멘츠를 찾아서 결과물로 가져오고, findOne은 하나의 도큐멘트를 찾아서 결과물로 가져온다.
        .find({category: "psat"})
        .then(result => {
            res.status(200).json({
                cateCount: result.length,
                cateInfo: result
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message
            })
        });
})

//ncs게시판(카테고리) 불러오기
router.get('/category/ncs', (req, res) => {

    bbsModel
        //find는 복수 도큐멘츠를 찾아서 결과물로 가져오고, findOne은 하나의 도큐멘트를 찾아서 결과물로 가져온다.
        .find({ category: "ncs" })
        .then(result => {
            res.status(200).json({
                cateCount: result.length,
                cateInfo: result
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: err.message
            })
        });
})



//게시판 데이터 등록하기
router.post('/write', requireLogin, uploads.single('bbsimg'),(req, res) => {
    const {title, desc, category, url} = req.body;

    const newDoc = new bbsModel({
        title, desc, category, url,
        bbsimg: req.file.path,
        user: req.user._id
    })

    console.log(
        newDoc
    )

    newDoc
        .save()
        .then(doc => {
            res.status(200).json({
                docInfo: doc
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

// 좋아요(like api)
router.post('/likes/:bbsid', requireLogin, (req, res) => {
    console.log("a", req.user._id)
    userModel
        .findOne({user: req.user._id})
        .then(user => {
            bbsModel
                .findById(req.params.bbsid)
                .then(post => {
                    console.log("post is", post);
                    // if(post.likes.filter(like => like.user.toString() === req.user._id).length > 0) {
                    //     return res.status(400).json({
                    //         msg: 'User already liked this post'
                    //     });
                    // }
                    // post.likes.unshift({
                    //     user: req.user._id
                    // });
                    // post
                    //     .save()
                    //     .then(post => res.json(post));
                    if (post.likes.filter(like => like.user.toString() === req.user._id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already liked this post' });
                    }
                    // Add user id to likes array
                    post.likes.unshift({ user: req.user._id });
                    post.save().then(post => res.json(post));            
                })
                .catch(err=> res.status(400).json({
                    msg: err.message
                }));
        })
})

router.post('/unlike/:bbsid', requireLogin, (req, res) => {
    userModel
        .findOne({user: req.user._id})
        .then(user => {
            bbsModel.findById(req.params.bbsid)
                .then(post => {
                    console.log("post is", post);
                    if(post.likes.filter(like => like.user.toString() === req.user._id).length === 0){
                        return res.status(400).json({
                            notliked: 'You have not liked this post'
                        })

                    }
                    // get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user._id);
                    //slice out of array
                    post.likes.splice(removeIndex, 1);

                    //save
                    post
                        .save()
                        .then(post => res.json(post));
                })
                .catch(err => res.status(500).json({
                    err: err.message
                }));
        })
})

router.post('/commets/:bbsid', requireLogin, (req, res) => {
    const {desc} = req.body;

    bbsModel
        .findById(req.params.bbsid)
        .then(post => {
            console.log('comment is.. ', post)
            
        });
});


module.exports = router;