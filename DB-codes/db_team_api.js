const database = require('./database');


async function getAllTeam(){
    let sql = `
        SELECT 
            *
        FROM
            TEAM order by NAME
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getTeamById(id){
    let sql = `
        SELECT 
            *
        FROM
             TEAM
        WHERE ID = :id
    `;
    let binds = {
        id:id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getTeamByName(name){
    let sql = `
        SELECT 
            *
        FROM
             TEAM
        WHERE NAME = :name
    `;
    let binds = {
        name : name
    };
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getPlayerByTeamId(id){
    let sql = `
        SELECT 
            *
        FROM
             player
        WHERE id = any ( select p_id from plays where t_id=:id 
        )
        order by 
    case 
       when POSITION = 'GKP' then 1 
       when POSITION = 'DEF' then 2
       when POSITION = 'MID' then 3
       when POSITION = 'FWD' then 4
       else 5 
    end
    `;
    let binds = {
        id : id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}
module.exports = {

    getAllTeam,
    getTeamById,
    getTeamByName,
    getPlayerByTeamId
}