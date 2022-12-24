const express = require('express');
const verify  = require('./verifyToken');


const router = express.Router();


router.get('/', verify, (req, res) => {
    res.json({
        posts:{
            title: "my first post",
            description: "random data you shouldnt access"
        }
    });
});


module.exports = router; 