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
        select P.ID, NVL(sum(ps.TOTAL_POINTS),0) tpoints
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
        SELECT ID, ( FIRST_NAME || ' ' || LAST_NAME ) name, position, ( FIRST_NAME || ' ' || LAST_NAMe || '(' || ( SELECT name FROM team WHERE id = ( SELECT T_ID FROM plays WHERE Player.ID = PLAYS.P_ID ) ) || ')' || 'Price:'||NVL((SELECT PRICE from PLAYER_PRICE where P_ID=player.id),4)) display
        FROM player WHERE POSITION = :pos    
    `;
    let binds = {
        pos:pos
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getPlayerByDetails(fn, ln, pos, tn){
    let sql = `
        SELECT ID, FIRST_NAME, LAST_NAME, position, 
        ( SELECT name FROM team WHERE id = ( SELECT T_ID FROM plays WHERE Player.ID = PLAYS.P_ID ) ) t_name 
        FROM player 
        WHERE POSITION = :pos 
        and FIRST_NAME = :fn and LAST_NAME =:ln 
        and ( SELECT name FROM team WHERE id = ( SELECT T_ID FROM plays WHERE Player.ID = PLAYS.P_ID ) ) = :tn
    `;
    let binds = {
        pos:pos,
        fn:fn,
        ln:ln,
        tn:tn
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getPlayerByDetailsWithoutTeam(fn, ln, pos){
    let sql = `
        SELECT *
        FROM player 
        WHERE POSITION = :pos 
        and FIRST_NAME = :fn and LAST_NAME =:ln 
    `;
    let binds = {
        pos:pos,
        fn:fn,
        ln:ln
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getPriceByPlayerId(id){
    let sql = `
        SELECT *
        FROM player_price 
        WHERE P_ID =:id 
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}


async function getAllPrices(){
    let sql = `
        SELECT *
        FROM player_price 
    `;

    return (await database.execute(sql, database.options)).rows;
}

async function getIdFromName(name){
    let sql = `
        SELECT * FROM (SELECT ID, ( FIRST_NAME || ' ' || LAST_NAME ) name, position, (SELECT PRICE from PLAYER_PRICE where P_ID=player.id) current_price
        FROM player) T 
        WHERE t.NAME = :name
    `;
    let binds = {
        name:name
    };
    return (await database.execute(sql,binds, database.options)).rows;
}




async function insertPlayerByDetails(fn, ln, pos){
    let sql = `
        insert into player (FIRST_NAME, LAST_NAME, POSITION) values (:fn,:ln,:pos)
    `;
    let binds = {
        pos:pos,
        fn:fn,
        ln:ln
    };
    // console.log(binds)
    return (await database.execute(sql, binds, database.options));
}
async function insert(fn, ln, pos){
    let sql = `
        insert into player (FIRST_NAME, LAST_NAME, POSITION) values (:fn,:ln,:pos)
    `;
    let binds = {
        pos:pos,
        fn:fn,
        ln:ln
    };
    // console.log(binds)
    return (await database.execute(sql, binds, database.options));
}
async function updatePlays(p_id,tn,season){
    let sql = `
        BEGIN 
            INSERT_ROW_PLAYS(:p_id, :tn, :season);
        END;
    `;
    let binds = {
        p_id:p_id,
        tn:tn,
        season:season
    };
    return (await database.execute(sql, binds, database.options));
}

async function updatePrice(p_id,season,price){
    let sql = `
        UPDATE PLAYER_PRICE set PRICE=:price WHERE P_ID=:p_id and SEASON=:season
    `;
    let binds = {
        p_id:p_id,
        price:price,
        season:season
    };
    return (await database.execute(sql, binds, database.options));
}








module.exports = {
    getAllPlayers,
    getPlayerById,
    getTeamByPlayerId,
    getTotalPointsById,
    getPlayerByPosition,
    getPlayerByDetails,
    insertPlayerByDetails,
    updatePlays,
    getPlayerByDetailsWithoutTeam,
    updatePrice,
    getPriceByPlayerId,
    getAllPrices,
    getIdFromName

}