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
    const formation=['3-4-3','3-5-2','4-3-3','4-4-2','4-5-1','5-3-2','5-4-1']
    res.render('layout.ejs',{
        title: 'User team edit',
        body: 'user/edit',
        formation
    })
});

router.post('/edit',async(req, res)=>{
    console.log(req.body);
    let {param}=req.body;
    const frm=param
    res.redirect('/user/select?frm='+frm)
});

router.get('/select',async(req, res)=>{
    console.log(req.query.frm)
    let formation= req.query.frm.split('-')
    const def=parseInt(formation[0],10)
    const mid=parseInt(formation[1],10)
    const fwd=parseInt(formation[2],10)
    const gkplist=await db_player.getPlayerByPosition('GKP')
    const deflist=await db_player.getPlayerByPosition('DEF')
    const midlist=await db_player.getPlayerByPosition('MID')
    const fwdlist=await db_player.getPlayerByPosition('FWD')
    res.render('layout.ejs',{
        title: 'User team select',
        body: 'user/select',
        frm:req.query.frm,
        def, mid, fwd,
        gkplist, deflist, midlist, fwdlist
    })
})

router.post('/select', async (req,res)=>{

})

router.get('/view', async (req, res) => {
    // console.log("received request from user.js")
    res.render('layout.ejs',{
        title: 'User team ',
        body: 'user/view',
    })
});





module.exports = router;