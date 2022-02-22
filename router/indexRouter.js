// libraries
const express = require('express');
const marked = require('marked');

const router = express.Router({mergeParams : true});
const auth = require('./auth/ensureAuth')

const DB_player = require('../DB-codes/db_player_api');
//
// // sub-routers
const playerRouter = require('./player/player');
const adminRouter= require('./admin/admin_router')
const authRouter= require('./auth/authenticate')
const userRouter= require('./user/user')
//
// const rightPanelUtils = require('../utils/rightPanel-utils');

// ROUTE: home page
router.get('/', async (req, res) =>{


    // let rightPanel = await rightPanelUtils.getRightPanel(req.user);
    const playerResult = await DB_player.getAllPlayers();

    res.render('layout.ejs', {
        title: 'Fantasy Premier League',
        players:playerResult,
        body : 'homepage'
    });
});

// setting up sub-routers
router.use('/player', playerRouter);
router.use('/admin', adminRouter);
router.use('/auth',authRouter);
router.use('/user',auth.authenticated, userRouter);

module.exports = router