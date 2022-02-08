const database = require('./database');


async function getAllTeam(){
    let sql = `
        SELECT 
            *
        FROM
            TEAM
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

module.exports = {

    getAllTeam,
    getTeamById,
    getTeamByName
}