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

router.get('/user_team',async(req, res)=>{
    res.render('layout.ejs',{
        title: 'User team',
        body: 'user/user_team',
        user: req.user
    })
})

router.get('/edit_team',async(req, res)=>{
    res.render('layout.ejs',{
        title: 'User team edit',
        body: 'user/edit_team',
        user: req.user
    })
})



module.exports = router;