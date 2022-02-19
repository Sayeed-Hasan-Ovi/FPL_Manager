const LocalStrategy = require('passport-local').Strategy;

const db_manager_api = require('../DB-codes/db_manager_api')

function validate(passport){
    passport.use(
        new LocalStrategy({
            usernameField: 'name'
        }, async (name, password, done) =>{
            const query_result  = await db_manager_api.findManagerByName(name);
            if (query_result.length > 0){
                const user = query_result[0];
                // console.log(user);
                if (user.PASSWORD===password){
                    console.log('password match')
                    return done(null, user);
                }else {
                    console.log('password wrong')
                    return done(null, false)
                }
            }else {
                return done(null, false)
            }
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.ID);
    });

    passport.deserializeUser(async function(id, done) {
        /*User.findById(id, function (err, user) {
            done(err, user);
        });*/
        const query_result = await db_manager_api.findManagerById(id);
        if (query_result.length > 0){
            done(null, query_result[0])
        }else {
            done(null, false)
        }
    });
}

module.exports = {validate}