// libraries
const express = require('express');
const marked = require('marked');

const router = express.Router({mergeParams : true});

const DB_player = require('../DB-codes/db_player_api');
//
// const blogUtils = require(process.env.ROOT + '/utils/blog-utils');
//
// // sub-routers
const playerRouter = require('./player/player');
const adminRouter= require('./admin/admin_router')
// const loginRouter = require('./auth/login');
// const logoutRouter = require('./auth/logout');
// const userRouter = require('./users/users.js');
// const profileRouter = require('./profile/profile');
// const blogRouter = require('./blog/blog');
// const countryRouter = require('./country/countryAll');
// const contestRouter = require('./contest/contest');
// const problemsRouter = require('./problems/problems');
// const apiRouter = require('./api/api');
// const teamsRouter = require('./teams/teams');
// const aboutRouter = require('./about/about');
//
// const rightPanelUtils = require('../utils/rightPanel-utils');

// ROUTE: home page
router.get('/', async (req, res) =>{

    // const id = (req.user === null)? null : req.user.id;
    // const blogs = await DB_blog.getAdminBlogs(id);
    //
    // for(let i = 0; i<blogs.length; i++){
    //     await blogUtils.blogProcess(blogs[i]);
    //     blogs[i].BODY = marked(blogs[i].BODY);
    // }

    // let rightPanel = await rightPanelUtils.getRightPanel(req.user);
    const playerResult = await DB_player.getAllPlayers();

    res.render('layout.ejs', {
        title: 'Fantasy Premier League',
        players:playerResult,
        body : 'homepage',
        // user: req.user,
        // blogs : blogs,
        // rightPanel : rightPanel
    });
});

// setting up sub-routers
router.use('/player', playerRouter);
router.use('/admin', adminRouter);


module.exports = router