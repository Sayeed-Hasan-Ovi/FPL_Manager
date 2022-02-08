// libraries
const express = require('express');
const moment = require('moment');

const router = express.Router({mergeParams: true});

const db_team = require('../../DB-codes/db_team_api')
const db_fixture = require('../../DB-codes/db_fixture_api')

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Admin page',
        body: 'admin/home'
    })
});
router.get('/create_fixture', async (req, res) => {
    res.render('layout.ejs', {
        title: 'create fixture',
        body: 'admin/create_fixture'
    })
})

router.post('/create_fixture', async (req, res) => {
    console.log(req.body);

    let {home, away, season, gw, kickoff} = req.body;
    kickoff = moment.utc(kickoff).format('yyyy-MM-DD HH:mm');
    let error = [];
    if (!home || !away || !season || !gw || home === away) {
        error.push({
            message: 'please fill up the form correctly'
        });
    }
    const s = season.split('-');

    let y1 = s[0];
    let y2 = s[1];
    y1 = parseInt(y1, 10);
    y2 = parseInt(y2, 10);
    gw = parseInt(gw, 10);

    if (y2 - y1 !== 1 || y1 < 2000 || y1 > 3000 || y2 < 2000 || y2 > 3000 || gw > 38 || gw < 1) {
        error.push({
            message: 'input season correctly'
        })
    }
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/create_fixture',
            error: error
        })
    }
    const home_result = await db_team.getTeamByName(home);
    const away_result = await db_team.getTeamByName(away);

    if (home_result.length !== 1 || away_result.length !== 1) {
        error.push({
            message: 'the team is not present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/create_fixture',
            error: error
        })
    }

    let home_team = home_result[0];
    let away_team = away_result[0];


    const fixture_exists = await db_fixture.getFixtureByDetails(home_team.ID, away_team.ID, season, gw);
    if (fixture_exists.length > 0) {
        error.push({
            message: 'the fixture is already present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/create_fixture',
            error: error
        })
    }
    const fixture_inserted = await db_fixture.insertFixtureByDetails(home_team.ID,away_team.ID,season,gw,kickoff)

    if (fixture_inserted.rowsAffected > 0){
        return res.redirect('/admin');
    }
    error.push({
        message: 'some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'admin/create_fixture',
        error : error
    })

})


module.exports = router;