// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const DB_player = require('../../DB-codes/db_player_api');
const {getAllManager, getManagedTeamName, getDrafted} = require("../../DB-codes/db_manager_api");
const moment = require("moment");
const {getPlayerById} = require("../../DB-codes/db_player_api");

router.get('/', async (req, res)=>{

    const managerResult = await getAllManager()

    // console.log(playerResult)
    res.render('layout.ejs',{
        title:'All manager\'s profile',
        body:'leaderboard/leaderboard',
        player: managerResult
    })
})

router.get('/:id', async (req, res) => {
    const team_name = await getManagedTeamName(req.params.id)
    const managerResult = await getAllManager()

    // console.log(team);
    // console.log(playerResult);
    let currentdate = new Date();
    let gw_date = currentdate.getFullYear() + "-"
        + (currentdate.getMonth()+1)  + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() ;

    // console.log(gw_date)
    gw_date= moment.utc(gw_date).format('yyyy-MM-DD HH:mm');
    // console.log(gw_date, req.user.ID)
    // const team_name = await getManagedTeamName(req.user.ID)
    // console.log(team_name)
    const drafted_players = await getDrafted(gw_date, req.params.id)
    // console.log(gw_date, req.user.ID, drafted_players)


    let error =[]

    try {
     const player_name1 = await getPlayerById(drafted_players[0].P1_ID)



    // console.log(player_name1)

    const player_name2 = await getPlayerById(drafted_players[0].P2_ID)
    // console.log(1)
    const player_name3 = await getPlayerById(drafted_players[0].P3_ID)
    // console.log(1)
    const player_name4 = await getPlayerById(drafted_players[0].P4_ID)
    // console.log(1)
    const player_name5 = await getPlayerById(drafted_players[0].P5_ID)
    // console.log(1)
    const player_name6 = await getPlayerById(drafted_players[0].P6_ID)
    // console.log(1)
    const player_name7 = await getPlayerById(drafted_players[0].P7_ID)
    // console.log(1)
    const player_name8 = await getPlayerById(drafted_players[0].P8_ID)
    // console.log(1)
    const player_name9 = await getPlayerById(drafted_players[0].P9_ID)
    // console.log(1)
    const player_name10 = await getPlayerById(drafted_players[0].P10_ID)
    // console.log(1)
    const player_name11 = await getPlayerById(drafted_players[0].P11_ID)
    // console.log(1)
    const points_till_now=team_name[0].POINTS;

    let player=[]

    player.push(player_name11[0])
    player.push(player_name1[0])
    player.push(player_name2[0])
    player.push(player_name3[0])
    player.push(player_name4[0])
    player.push(player_name5[0])
    player.push(player_name6[0])
    player.push(player_name7[0])
    player.push(player_name8[0])
    player.push(player_name9[0])
    player.push(player_name10[0])

    let team = []
    for (let i = 0; i < 11; i++) {
        team.push(await DB_player.getTeamByPlayerId(player[i].ID));
    }

    res.render('layout.ejs', {
        title: team_name[0].NAME +'\'s Team',
        body: 'leaderboard/manager',

        team_name:team_name,
        player,
        points_till_now,
        team:team


    })
    }catch (err){
        error.push({
            message:'The manager has not picked a team for the current gameweek'
        })
        return res.render('layout.ejs',{
            title:'All manager\'s profile',
            body:'leaderboard/leaderboard',
            player: managerResult, error: error
        })
    }
});


module.exports = router;