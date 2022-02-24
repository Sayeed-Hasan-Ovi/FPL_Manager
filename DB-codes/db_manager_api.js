const database = require('./database')

const oracledb = require('oracledb')

async function getAllManager(){
    let sql = `
        select * from MANAGED_TEAM MT join MANAGER M on (MT.USER_T_ID=M.ID) order by points desc
    `;
    let binds = {

    };

    return (await database.execute(sql, binds,database.options)).rows;
}

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
       select * from MANAGED_TEAM MT join MANAGER M on (MT.USER_T_ID=M.ID) where M.id=:id
    `;
    let binds = {
        id:id
    };

    return (await database.execute(sql, binds,database.options)).rows;
}
async function getDrafted(gw_date, m_id){

    let sql = `
       select * from DRAFTED where Manager_id=:m_id AND GW=(select GW_ID from GAMEWEEK WHERE TO_DATE(:gw_date, 'YYYY-MM-DD HH24:MI') BETWEEN START_TIME and END_TIME)
    `;
    let binds = {
        m_id:m_id,gw_date:gw_date
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

async function insertIntoDrafted(m_id, gw, season, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11){
    let sql = `
       INSERT INTO DRAFTED
       VALUES(:m_id,:p1,:p2,:p3,:p4,:p5,:p6,:p7,:p8,:p9,:p10,:p11,:season,:gw)
    `;
    let binds = {
m_id:m_id,p1:p1,p2:p2,p3:p3,p4:p4,p5:p5,p6:p6,p7:p7,p8:p8,p9:p9,p10:p10,p11:p11,season:season,gw:gw
    };

    return (await database.execute(sql, binds,database.options));
}

async function updateManagedTeamName(m_id, new_name){
    let sql = `
               UPDATE MANAGED_TEAM MT set NAME=:new_name where M_id=:m_id
    `;
    let binds = {
        m_id:m_id,
        new_name:new_name
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    findManagerByName,
    findManagerById,
    insertManager,
    getManagedTeamName,
    getAllManager,
    insertIntoDrafted,
    getDrafted,updateManagedTeamName
}