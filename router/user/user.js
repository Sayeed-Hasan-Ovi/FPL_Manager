const express = require('express');
const router = express.Router({mergeParams : true});

const db_team = require('../../DB-codes/db_team_api')
const db_player= require('../../DB-codes/db_player_api')
const db_manager= require('../../DB-codes/db_manager_api')



router.get('/', async (req, res) => {
    // console.log("received request from user.js")
    res.render('layout.ejs',{
        title: 'User profile',
        body: 'user/home',
        username: req.user.NAME
    })
});

router.get('/edit', async (req, res) => {
    // console.log("received request from user.js")
    res.render('layout.ejs',{
        title: 'User team edit',
        body: 'user/edit',
    })
});

router.get('/view', async (req, res) => {
    // console.log("received request from user.js")
    res.render('layout.ejs',{
        title: 'User team ',
        body: 'user/view',
    })
});





module.exports = router;