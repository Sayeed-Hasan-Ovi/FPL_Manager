const database = require('./database');


async function getAllPlayers(){
    let sql = `
        SELECT 
            *
        FROM
            PLAYER
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getPlayerById(id){
    let sql = `
        SELECT 
            *
        FROM
            PLAYER
        WHERE id = :id
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}


async function getTeamByPlayerId(id){
    let sql = `
        select * from TEAM
        where id=(
        select t_id from plays where p_id=:id
        )
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getTotalPointsById(id){
    let sql = `
        select P.ID, sum(ps.TOTAL_POINTS) tpoints
        from PLAYER P JOIN PLAYER_STAT PS ON (P.ID=PS.P_ID)
        where p.id=:id
        GROUP BY p.id
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getPlayerByPosition(pos){
    let sql = `
        SELECT ID, ( FIRST_NAME || ' ' || LAST_NAME ) name, position, ( FIRST_NAME || ' ' || LAST_NAMe || ' (' || ( SELECT name FROM team WHERE id = ( SELECT T_ID FROM plays WHERE Player.ID = PLAYS.P_ID ) ) || ')' ) display 
        FROM player 
        WHERE POSITION = :pos    
    `;
    let binds = {
        pos:pos
    };
    return (await database.execute(sql, binds, database.options)).rows;
}



module.exports = {
    getAllPlayers,
    getPlayerById,
    getTeamByPlayerId,
    getTotalPointsById,
    getPlayerByPosition

}