const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        msg: 'profile get'
    })
})

router.post('/', (req, res) => {
    res.status(200).json({
        msg: 'profile post'
    })
})

router.patch('/', (req, res) => {
    res.status(200).json({
        msg: 'profile update'
    })
})

router.delete('/', (req, res) => {
    res.status(200).json({
        msg: 'profile delete'
    })
})

module.exports = router;