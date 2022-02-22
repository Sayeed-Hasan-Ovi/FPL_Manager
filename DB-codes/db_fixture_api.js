const database = require('./database');


async function getAllFixture(){
    let sql = `
        SELECT 
            *
        FROM
            FIXTURE
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getFixtureById(id){
    let sql = `
        SELECT 
            *
        FROM
            FIXTURE
        WHERE ID = :id
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getFixtureByDetails(home, away, season, gw){
    let sql = `
        SELECT *
        FROM FIXTURE
        WHERE TEAM_H_ID = :home
            AND TEAM_A_ID = :away
            AND SEASON = :season
            AND GAME_WEEK = :gw
    `;
    let binds = {
        home:home,
        away:away,
        season:season,
        gw:gw
    };
    return (await database.execute(sql, binds, database.options)).rows;
}
async function insertFixtureByDetails(home, away, season, gw, kickoff){
    let sql = `
        INSERT INTO 
            fixture (SEASON, GAME_WEEK, TEAM_A_ID, TEAM_H_ID, KICK_OFF)
        VALUES 
               (:season,:gw,:away_id ,:home_id, TO_DATE(:kickoff, 'YYYY-MM-DD HH24:MI'))
    `;
    let binds = {
        season:season,
        gw:gw,
        away_id: away,
        home_id: home,
        kickoff:kickoff
    };
    return (await database.execute(sql, binds, database.options));
}
async function updateFixtureByDetails(home, away, season, gw, home_score, away_score, goal_scorer, assist, goal_conceded, own_goal, penalty_miss, penalty_save, red_card, yellow_card, clean_sheet){
    let sql = `
        UPDATE 
            FIXTURE
        SET 
            TEAM_A_SCORE=:away_score, TEAM_H_SCORE=:home_score, GOAL_SCORED=:goal_scorer, ASSISTS=:assist, GOAL_CONCEDED=:goal_conceded, OWN_GOAL=:own_goal, PENALTY_MISSED=:penalty_miss, PENALTY_SAVED=:penalty_save, RED_CARD=:red_card, YELLOW_CARD=:yellow_card, CLEAN_SHEET=:clean_sheet
        WHERE TEAM_H_ID = :home
            AND TEAM_A_ID = :away
            AND SEASON = :season
            AND GAME_WEEK = :gw 
    `;
    let binds = {
        season:season,
        gw:gw,
        away: away,
        home: home,
        away_score: away_score,
        home_score: home_score,
        goal_scorer: goal_scorer, assist: assist, goal_conceded: goal_conceded, own_goal: own_goal, penalty_miss:penalty_miss, penalty_save:penalty_save, red_card:red_card, yellow_card:yellow_card, clean_sheet:clean_sheet
    };
    return (await database.execute(sql, binds, database.options));
}



module.exports = {
    getAllFixture,
    getFixtureById,
    getFixtureByDetails,
    insertFixtureByDetails,
    updateFixtureByDetails //needs stat

}