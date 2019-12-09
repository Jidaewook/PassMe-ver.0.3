const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        msg: 'bbs get'
    })
})

router.post('/', (req, res) => {
    res.status(200).json({
        msg: 'bbs post'
    })
})

router.patch('/', (req, res) => {
    res.status(200).json({
        msg: 'bbs patch'
    })
})

router.delete('/', (req, res) => {
    res.status(200).json({
        msg: 'bbs delete'
    })
})

module.exports = router;