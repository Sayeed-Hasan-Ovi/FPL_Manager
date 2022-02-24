// libraries
const express = require('express');
const moment = require('moment');

const router = express.Router({mergeParams: true});

const db_team = require('../../DB-codes/db_team_api')
const db_fixture = require('../../DB-codes/db_fixture_api')
const db_player_stat = require('../../DB-codes/db_player_stat_api')
const db_player= require('../../DB-codes/db_player_api')
const db_manager= require('../../DB-codes/db_manager_api')

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Admin Page',
        body: 'admin/home'
    })
});
router.get('/create_fixture', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Create Fixture',
        body: 'admin/create_fixture'
    })
})
router.get('/update_points', async (req, res) => {
        res.render('layout.ejs', {
        title: 'Enter only if GW is over',
        body: 'admin/update_points'
    })
})

router.post('/update_points', async (req, res) => {
    let {gw}=req.body
    const all_manager=await db_manager.getAllManager()
    // console.log(all_manager[0].M_ID)

    for (let i = 0; i < all_manager.length; i++) {
        const points_totalled = await db_player_stat.calculateUserPoints(all_manager[i].M_ID, gw)
    }

    res.render('layout.ejs', {
        title: 'Points updated',
        body: 'admin/home'
    })
})

router.post('/create_fixture', async (req, res) => {
    // console.log(req.body);

    let {home, away, season, gw, kickoff} = req.body;
    kickoff = moment.utc(kickoff).format('yyyy-MM-DD HH:mm');
    let error = [];
    if (!home || !away || !season || !gw || home === away) {
        error.push({
            message: 'Please fill up the form correctly'
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
            message: 'Input season correctly'
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
            message: 'The team is not present in database'
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
            message: 'The fixture is already present in database'
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
        message: 'Some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'admin/create_fixture',
        error : error
    })

})

// update fixture

router.get('/update_fixture', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Update Fixture',
        body: 'admin/update_fixture'
    })
})

router.post('/update_fixture', async (req, res) => {
    // console.log(req.body);

    let {home, away, season, gw, home_score, away_score, goal_scorer, assist, goal_conceded, own_goal, penalty_miss, penalty_save, red_card, yellow_card, clean_sheet} = req.body;
    let error = [];
    if (!home || !away || !season || !gw || !home_score || !away_score || home === away) {
        error.push({
            message: 'Please fill up the form correctly'
        });
    }
    const s = season.split('-');

    let y1 = s[0];
    let y2 = s[1];
    y1 = parseInt(y1, 10);
    y2 = parseInt(y2, 10);
    gw = parseInt(gw, 10);
    home_score = parseInt(home_score, 10);
    away_score = parseInt(away_score, 10);

    if (y2 - y1 !== 1 || y1 < 2000 || y1 > 3000 || y2 < 2000 || y2 > 3000 || gw > 38 || gw < 1) {
        error.push({
            message: 'Input season correctly'
        })
    }
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/update_fixture',
            error: error
        })
    }
    const home_result = await db_team.getTeamByName(home);
    const away_result = await db_team.getTeamByName(away);

    if (home_result.length !== 1 || away_result.length !== 1) {
        error.push({
            message: 'The team is not present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/update_fixture',
            error: error
        })
    }

    let home_team = home_result[0];
    let away_team = away_result[0];


    const fixture_exists = await db_fixture.getFixtureByDetails(home_team.ID, away_team.ID, season, gw);
    if (fixture_exists.length === 0) {
        error.push({
            message: 'The fixture is not present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/update_fixture',
            error: error
        })
    }
    //eta niche jaabe, niche gese
    //goal scorer der hishab
    let goal_scorer_list =  goal_scorer.split(',')

    for (let i = 0; i < goal_scorer_list.length; i++) {
        goal_scorer_list[i]=parseInt(goal_scorer_list[i],10)
        if (isNaN(goal_scorer_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(goal_scorer_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const goal_updated = await db_player_stat.updateGoalScoredByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (goal_updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }

//assist der hishab
    let assist_list =  assist.split(',')

    for (let i = 0; i < assist_list.length; i++) {
        assist_list[i]=parseInt(assist_list[i],10)
        if (isNaN(assist_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(assist_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const assist_updated = await db_player_stat.updateAssistsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (assist_updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }

//conceded der hishab
    let conceded_list =  goal_conceded.split(',')

    for (let i = 0; i < conceded_list.length; i++) {
        conceded_list[i]=parseInt(conceded_list[i],10)
        if (isNaN(conceded_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(conceded_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const conceded_updated = await db_player_stat.updateGoalConcededByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (conceded_updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }

// //og der hishab
    let og_list =  own_goal.split(',')

    for (let i = 0; i < og_list.length; i++) {
        og_list[i]=parseInt(og_list[i],10)
        if (isNaN(og_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(og_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const updated = await db_player_stat.updateOwnGoalByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }


//pen miss er hishab
    let pen_miss_list =  penalty_miss.split(',')

    for (let i = 0; i < pen_miss_list.length; i++) {
        pen_miss_list[i]=parseInt(pen_miss_list[i],10)
        if (isNaN(pen_miss_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(pen_miss_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const updated = await db_player_stat.updatePenaltyMissedByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }
//og der hishab
    let pen_save_list =  penalty_save.split(',')

    for (let i = 0; i < pen_save_list.length; i++) {
        pen_save_list[i]=parseInt(pen_save_list[i],10)
        if (isNaN(pen_save_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(pen_save_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const updated = await db_player_stat.updatePenaltySavedByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }
    //og der hishab
    let yellow_list = yellow_card.split(',')

    for (let i = 0; i < yellow_list.length; i++) {
        yellow_list[i]=parseInt(yellow_list[i],10)
        if (isNaN(yellow_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(yellow_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const updated = await db_player_stat.updateYellowCardByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }
//og der hishab
    let red_list =  red_card.split(',')

    for (let i = 0; i < red_list.length; i++) {
        red_list[i]=parseInt(red_list[i],10)
        if (isNaN(red_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(red_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const updated = await db_player_stat.updateRedCardByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
    }
    //og der hishab
    let cs_list =  clean_sheet.split(',')

    for (let i = 0; i < cs_list.length; i++) {
        cs_list[i]=parseInt(cs_list[i],10)
        if (isNaN(cs_list[i])) { break; }
        let player_exists = await db_player.getPlayerById(cs_list[i])
        if (player_exists.length === 0) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        const statline_exists= await db_player_stat.getPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (statline_exists.length===0)
        {
            await db_player_stat.insertPlayerStatByFixtureId(player_exists[0].ID, fixture_exists[0].ID);
        }
        const updated = await db_player_stat.updateCleanSheetByFixtureId(player_exists[0].ID, fixture_exists[0].ID)
        if (updated.rowsAffected!==1 ) {
            error.push({
                message: 'The player is not present in database'
            })
            return res.render('layout.ejs', {
                title: 'ERROR',
                body: 'admin/update_fixture',
                error: error
            })
        }
        await db_player_stat.updateTotalPointsByFixtureId(player_exists[0].ID, fixture_exists[0].ID)

    }


    const fixture_updated = await db_fixture.updateFixtureByDetails(home_team.ID,away_team.ID,season,gw, home_score, away_score, goal_scorer, assist, goal_conceded, own_goal, penalty_miss, penalty_save, red_card, yellow_card, clean_sheet);


    if (fixture_updated.rowsAffected === 1){
        return res.redirect('/admin');
    }
    error.push({
        message: 'Some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'admin/update_fixture',
        error : error
    })

})

//insert player

router.get('/insert_player', async (req, res) => {
    // console.log(req.query)
    res.render('layout.ejs', {
        title: 'Insert Player',
        body: 'admin/insert_player'
    })
})



router.post('/insert_player', async (req, res) => {
    // console.log(req.body);
    let error=[]
    let {first_name, last_name, team_name, season, position} = req.body;
    if (!first_name || !last_name || !season || !team_name || !position) {
        error.push({
            message: 'Please fill up the form correctly'
        });
    }
    const s = season.split('-');

    let y1 = s[0];
    let y2 = s[1];
    y1 = parseInt(y1, 10);
    y2 = parseInt(y2, 10);
    if (y2 - y1 !== 1 || y1 < 2000 || y1 > 3000 || y2 < 2000 || y2 > 3000
        || (position!=='FWD'&& position!=='DEF'&& position!=='MID'&& position!=='GKP')) {
        error.push({
            message: 'Input data correctly'
        })
    }

    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/insert_player',
            error: error
        })
    }
    const home_result = await db_team.getTeamByName(team_name);

    if (home_result.length !== 1) {
        error.push({
            message: 'The team is not present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/insert_player',
            error: error
        })
    }
    const player_exists= await db_player.getPlayerByDetails(first_name,last_name,position,team_name)
    if (player_exists.length > 0) {
        error.push({
            message: 'The player is already present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/insert_player',
            error: error
        })
    }
    // console.log(first_name, last_name, team_name, season, position)
    const player_inserted = await db_player.insertPlayerByDetails(first_name, last_name, position)
    const player_exists2 = await db_player.getPlayerByDetailsWithoutTeam(first_name,last_name,position)


    const plays_inserted = await db_player.updatePlays(player_exists2[0].ID,team_name,season);

    if (player_inserted.rowsAffected > 0){
        return res.redirect('/admin');
    }
    error.push({
        message: 'Some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'admin/insert_player',
        error : error
    })




})


//update player (price)
router.get('/update_price', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Update Player Price',
        body: 'admin/update_price'
    })
})

router.post('/update_price', async (req, res) => {

    // console.log(req.body)

    let {first_name, last_name, team_name, season, position, price} = req.body; let error=[];
    if (!first_name || !last_name || !season || !team_name || !position || !price) {
        error.push({
            message: 'Please fill up the form correctly'
        });
    }
    const s = season.split('-');

    let y1 = s[0];
    let y2 = s[1];
    y1 = parseInt(y1, 10);
    y2 = parseInt(y2, 10);
    if (y2 - y1 !== 1 || y1 < 2000 || y1 > 3000 || y2 < 2000 || y2 > 3000 ||
        price < 4 || price > 14
        || (position!=='FWD'&& position!=='DEF'&& position!=='MID'&& position!=='GKP')) {
        error.push({
            message: 'Input data correctly'
        })
    }

    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/update_price',
            error: error
        })
    }
    const home_result = await db_team.getTeamByName(team_name);

    if (home_result.length !== 1) {
        error.push({
            message: 'The team is not present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/update_price',
            error: error
        })
    }
    const player_exists= await db_player.getPlayerByDetails(first_name,last_name,position,team_name)
    if (player_exists.length !== 1) {
        error.push({
            message: 'The player is not present in database'
        })

        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'admin/update_price',
            error: error
        })
    }
    // console.log(first_name, last_name, team_name, season, position)

    const price_updated= await db_player.updatePrice(player_exists[0].ID, season, price)
// console.log(price_updated.rowsAffected)
    if (price_updated.rowsAffected > 0){
        return res.redirect('/admin');
    }
    error.push({
        message: 'Some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'admin/update_price',
        error : error
    })

    if (price_updated.rowsAffected > 0){
        return res.redirect('/admin');
    }
    error.push({
        message: 'Some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'admin/update_price',
        error : error
    })




})



















//data parsing admin side














module.exports = router;