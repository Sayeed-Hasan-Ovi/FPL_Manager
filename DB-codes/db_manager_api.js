const database = require('./database')

const oracledb = require('oracledb')



async function findManagerByName(name){
    let sql = `
        SELECT 
            *
        FROM
            MANAGER
        WHERE
            NAME = :name
    `;
    let binds = {
        name : name
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

async function findManagerById(user_id){
    let sql = `
        SELECT 
            *
        FROM
            MANAGER
        WHERE
            ID = :id
    `;
    let binds = {
        id : user_id
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

async function insertManager(name, password){
    let sql = `
       INSERT INTO MANAGER (NAME, PASSWORD)
       VALUES(:NAME, :PASSWORD)
    `;
    let binds = {
        NAME : name,
        PASSWORD : password
    };

    return (await database.execute(sql, binds,database.options));
}

async function getManagedTeamName(id){
    let sql = `
       select MT.name from MANAGED_TEAM MT join MANAGER M on (MT.USER_T_ID=M.ID) where M.id=:id
    `;
    let binds = {
        id:id
    };

    return (await database.execute(sql, binds,database.options)).rows;
}



module.exports = {
    findManagerByName,
    findManagerById,
    insertManager,
    getManagedTeamName
}