const database = require('./database');


async function getAllPlayerStats(){
    let sql = `
        SELECT 
            *
        FROM
            PLAYER_STAT
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getPlayerStatById(p_id){
    let sql = `
        SELECT 
            *
        FROM
            PLAYER_STAT
        WHERE p_id = :p_id
    `;
    let binds = {
        p_id:p_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}
async function insertPlayerStatByFixtureId(p_id,fixture_id){
    let sql = `
        INSERT INTO 
            PLAYER_STAT 
        VALUES 
               (:p_id,:fixture_id,0,0,0,0,0,0,0,0,0,0)
    `;
    let binds = {
        p_id: p_id,
        fixture_id: fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}
async function getPlayerStatByFixtureId(p_id,fixture_id){
    let sql = `
        SELECT 
            *
        FROM
            PLAYER_STAT
        WHERE p_id = :p_id
        AND FIXTURE_ID = :fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}




async function updatePlayerStatByFixtureId(p_id,fixture_id,goal_scorer, assist, goal_conceded, own_goal, penalty_miss, penalty_save, red_card, yellow_card, clean_sheet){
    let sql = `
        UPDATE 
            PLAYER_STAT
        SET 
            GOAL_SCORED=:goal_scorer, ASSISTS=:assist, GOAL_CONCEDED=:goal_conceded, OWN_GOAL=:own_goal, PENALTY_MISSED=:penalty_miss, PENALTY_SAVED=:penalty_save, RED_CARD=:red_card, YELLOW_CARD=:yellow_card, CLEAN_SHEET=:clean_sheet
        WHERE p_id = :p_id
            AND FIXTURE_ID = :fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id,
        goal_scorer:goal_scorer,
        assist:assist,
        goal_conceded:goal_conceded,
        own_goal:own_goal,
        penalty_miss:penalty_miss,
        penalty_save:penalty_save,
        red_card:red_card,
        yellow_card:yellow_card,
        clean_sheet:clean_sheet
    };
    return (await database.execute(sql, binds, database.options));
}
//goal scored
async function updateGoalScoredByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set GOAL_SCORED=GOAL_SCORED+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}

async function updateAssistsByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set ASSISTS=ASSISTS+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}
async function updateGoalConcededByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set GOAL_CONCEDED=GOAL_CONCEDED+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}
async function updateOwnGoalByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set OWN_GOAL=OWN_GOAL+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}
async function updatePenaltyMissedByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set PENALTY_MISSED=PENALTY_MISSED+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}
async function updatePenaltySavedByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set PENALTY_SAVED=PENALTY_SAVED+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}

async function updateRedCardByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set RED_CARD=RED_CARD+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}
async function updateYellowCardByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set YELLOW_CARD=YELLOW_CARD+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}

async function updateCleanSheetByFixtureId(p_id,fixture_id){
    let sql = `
        update PLAYER_STAT set CLEAN_SHEET=CLEAN_SHEET+1 WHERE p_id=:p_id and FIXTURE_ID=:fixture_id
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}

async function updateTotalPointsByFixtureId(p_id,fixture_id){
    let sql = `
        BEGIN 
            calculate_total_points(:fixture_id,:p_id); 
        END;
    `;
    let binds = {
        p_id:p_id,
        fixture_id:fixture_id
    };
    return (await database.execute(sql, binds, database.options));
}








module.exports = {
    getAllPlayerStats,
    getPlayerStatById,
    getPlayerStatByFixtureId,
    insertPlayerStatByFixtureId,
    updateGoalScoredByFixtureId,
    updateAssistsByFixtureId,
    updateGoalConcededByFixtureId,
    updateOwnGoalByFixtureId,
    updatePenaltyMissedByFixtureId,
    updatePenaltySavedByFixtureId,
    updateRedCardByFixtureId,
    updateYellowCardByFixtureId,
    updateCleanSheetByFixtureId,
    updateTotalPointsByFixtureId
}