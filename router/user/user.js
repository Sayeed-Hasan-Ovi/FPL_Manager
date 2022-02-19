const express = require('express');
const router = express.Router({mergeParams : true});

router.get('/', async (req, res) => {
    // console.log("received request from user.js")
    res.render('layout.ejs',{
        title: 'User profile',
        body: 'user/home',
        username: req.user.NAME
    })
});

module.exports = router;