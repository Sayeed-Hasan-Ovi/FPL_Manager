// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const DB_player = require('../../DB-codes/db_player_api');

router.get('/', async (req, res)=>{

    const playerResult = await DB_player.getAllPlayers()
    let team = []
    for (let i = 0; i < playerResult.length; i++) {
        team.push(await DB_player.getTeamByPlayerId(playerResult[i].ID));
    }
    // console.log(playerResult)
    res.render('layout.ejs',{
        title:'All players\' profile',
        body:'player/all_players',
        player: playerResult,
        team: team
    })
})

router.get('/:id', async (req, res) => {
    const playerResult = await DB_player.getPlayerById(req.params.id);
    const playertotalpointsResult= await DB_player.getTotalPointsById(req.params.id);
    const team= await DB_player.getTeamByPlayerId(req.params.id);
    // console.log(team);
    // console.log(playerResult);
    // console.log(playertotalpointsResult)
    res.render('layout.ejs', {
        title: playerResult[0].LAST_NAME +'\'s Profile',
        body: 'player/player_profile',
        player:playerResult[0],
        playertotalpoints:playertotalpointsResult[0],
        team:team[0]
    });
});


module.exports = router;