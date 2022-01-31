// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const DB_player = require('../../DB-codes/DB-player-api');
router.get('/:id', async (req, res) => {
    const playerResult = await DB_player.getPlayerById(req.params.id);
    console.log(playerResult);
    res.render('layout.ejs', {
        title: `Contests - ForceCodes`,
        body: 'playerInfo',
        player:playerResult[0]
    });
});


module.exports = router;