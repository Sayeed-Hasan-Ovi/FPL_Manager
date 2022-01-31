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
        WHERE p_id = :id
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}


module.exports = {
    getAllPlayers,
    getPlayerById

}