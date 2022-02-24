// libraries
const express = require('express');
const moment = require('moment');
const DB_player = require("../../DB-codes/db_player_api");
const {getAllTeam, getTeamById, getPlayerByTeamId} = require("../../DB-codes/db_team_api");
const {getTeamByPlayerId, getPlayerById} = require("../../DB-codes/db_player_api");

const router = express.Router({mergeParams: true});

router.get('/', async (req, res)=>{

    const team = await getAllTeam()
    // console.log(team)
    res.render('layout.ejs',{
        title:'Teams',
        body:'team/all_teams',
        player: team
    })
})

router.get('/:id', async (req, res) => {
    const playerResult = await getTeamById(req.params.id);
    const player= await getPlayerByTeamId(req.params.id)
    // console.log(playerResult);
    // console.log(playertotalpointsResult)
    res.render('layout.ejs', {
        title: playerResult[0].NAME +'\'s players',
        body: 'team/team_profile',
        team:playerResult[0],
        player
    });
});


module.exports = router;