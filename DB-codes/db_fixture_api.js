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
               (:season,:gw,:away_id ,:home_id, TO_DATE(:kickoff, 'YYYY-MM-DD HH:MI'))
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
async function updateFixtureByDetails(home, away, season, gw, home_score, away_score){
    let sql = `
        UPDATE 
            FIXTURE
        SET 
            TEAM_A_SCORE=:away_score, TEAM_H_SCORE=:home_score
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
        home_score: home_score
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