const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => {
    res.status(200).json({
        msg: 'User register'
    })
})

router.post('/login', (req, res) => {
    res.status(200).json({
        msg: 'User login'
    })
})

module.exports = router;