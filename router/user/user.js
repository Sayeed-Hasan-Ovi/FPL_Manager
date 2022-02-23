const express = require('express');
const router = express.Router({mergeParams : true});
const formation=['3-4-3','3-5-2','4-3-3','4-4-2','4-5-1','5-3-2','5-4-1']
const db_team = require('../../DB-codes/db_team_api')
const db_player= require('../../DB-codes/db_player_api')
const db_manager= require('../../DB-codes/db_manager_api')



router.get('/', async (req, res) => {
    res.render('layout.ejs',{
        title: 'User profile',
        body: 'user/home',
        username: req.user.NAME,
        userid: req.user.ID
    })
});

router.get('/edit', async (req, res) => {
    // console.log(req.user.NAME)
    // console.log(req.user.ID)
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
    // console.log(req.user0.name)
    // console.log(req.user.name)

    let formation= req.query.frm.split('-')
    const def=parseInt(formation[0],10)
    const mid=parseInt(formation[1],10)
    const fwd=parseInt(formation[2],10)
    const gkplist=await db_player.getPlayerByPosition('GKP')
    // console.log(gkplist)
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
    // console.log(req.body)

    // console.log(req.user0)
    let error=[]
    let {gkp_pick, def_pick, mid_pick, fwd_pick}= req.body;
    // console.log(gkp_pick)
    // for (let i = 0; i < def_pick.length; i++) {
    //     console.log(def_pick[i])
    // }

    if(!gkp_pick){
        error.push({
            message: 'The team is not picked properly'
        })
    }

    let dl=def_pick.length
    let ml=mid_pick.length
    let fl=fwd_pick.length

    for (let i = 0; i < dl; i++) {
        if(!def_pick[i]){
            error.push({
                message: 'The team is not picked properly'
            })
        }
    }

    for (let i = 0; i < ml; i++) {
        if(!mid_pick[i]){
            error.push({
                message: 'The team is not picked properly'
            })
        }
    }
    for (let i = 0; i < fl; i++) {
        if(!fwd_pick[i]){
            error.push({
                message: 'The team is not picked properly'
            })
        }
    }
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'user/edit',
            error: error,
            formation
        })
    }

    let teams= []
    let names= []

    let gkp = gkp_pick.split('(')
    let gkp_name= gkp[0]

    let temp= gkp[1].split(')')
    let gkp_team=temp[0]
    names.push(gkp_name)
    teams.push(gkp_team)

    // console.log(gkp_name + gkp_team)

    let def_name=[]
    let mid_name=[]
    let fwd_name=[]
    let def_team=[]
    let mid_team=[]
    let fwd_team=[]

    for (let i = 0; i < dl; i++) {
        let def = def_pick[i].split('(')
        def_name.push(def[0])
        let temp= def[1].split(')')
        def_team.push(temp[0])
        names.push(def_name[i])
        teams.push(def_team[i])
    }
    for (let i = 0; i < ml; i++) {
        let mid = mid_pick[i].split('(')
        mid_name.push(mid[0])
        let temp= mid[1].split(')')
        mid_team.push(temp[0])
        names.push(mid_name[i])
        teams.push(mid_team[i])
    }
    for (let i = 0; i < fl; i++) {
        let fwd = fwd_pick[i].split('(')
        fwd_name.push(fwd[0])
        let temp= fwd[i].split(')')
        fwd_team.push(temp[0])
        names.push(fwd_name[i])
        teams.push(fwd_team[i])
    }


    // console.log(def_name)
    // console.log(def_team)
    // console.log(mid_name)
    // console.log(mid_team)
    // console.log(fwd_name)
    // console.log(fwd_team)

    for (let i = 0; i < 11; i++) {
        for (let j = i+1; j < 11; j++) {
            if(names[i]===names[j])
                error.push({
                    message: 'Please avoid picking duplicate players'
                });

        }
    }
    let count_team= []
    for (let i = 0; i < 11; i++) {
        count_team.push(0)    }
    for (let i = 0; i < 11; i++) {
        for (let j = i+1; j < 11; j++) {
            if(i===j) continue
            else{
                if(teams[i]===teams[j]) count_team[i]++
            }
        }
    }
    for (let i = 0; i < 11; i++) {
        if(count_team[i]>=3)
            error.push({
            message: 'More than 3 players from the same team are not allowed'
        })
    }
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'user/edit',
            error: error,
            formation
        })
    }

    // console.log(count_team)


    let player_data=[]
    for (let i = 0; i < 11; i++) {
        player_data.push(await db_player.getIdFromName(names[i]))
    }

    let total_cost=0
    for (let i = 0; i < 11; i++) {
        total_cost+=player_data[i][0].CURRENT_PRICE
    }

    console.log(total_cost)

    if(total_cost>45) //change korte hobe
        error.push({
            message: 'You have exceeded your gameweek balance'
        })
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'user/edit',
            error: error,
            formation
        })
    }






})

router.get('/view', async (req, res) => {
    // console.log("received request from user.js")
    res.render('layout.ejs',{
        title: 'User team ',
        body: 'user/view',
    })
});





module.exports = router;