const express = require('express');
const passport = require('passport')

const router = express.Router({mergeParams: true});

const db_manager_api = require('../../DB-codes/db_manager_api')

router.get('/register', (req, res) => {
    res.render('layout.ejs', {
        title: 'Register',
        body: 'auth/register',
    });
})

router.get('/login', (req, res) => {
    res.render('layout.ejs', {
        title: 'Login',
        body: 'auth/login',
    });
})

router.post('/register', async (req, res) => {
    const {name, password, password2} = req.body;
    // console.log(req.body)
    let errors = [];

    if (!name || !password || !password2) {
        errors.push({
            message: 'Please fill in the form'
        })
    }
    if (password !== password2) {
        errors.push({
            message: 'Passwords do not match'
        })
    }
    if (password && password.length < 8) {
        errors.push({
            message: 'Passwords should be at least 8 characters'
        })
    }

    if (errors.length > 0) {
        // console.log(errors)
        res.render('layout.ejs', {
            title: 'Register',
            body: 'auth/register',
            errors
        })
    }
    else {
        //no errors
        const query_result = await db_manager_api.findManagerByName(name)

        if (query_result.length > 0) {
            //username already exists
            errors.push({
                message: 'Sorry! The username is taken.'
            })

            res.render('layout.ejs', {
                title: 'Register',
                body: 'auth/register',
                errors
            })
        }
        else {
            // insert new user (manager)
            const insert_result = await db_manager_api.insertManager(name, password)

            if (insert_result.rowsAffected > 0) {
                res.redirect('/auth/login')
            }
            else {
                errors.push({
                    message: 'Some internal server error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Register',
                    body: 'auth/register',
                    errors
                })
            }

        }
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/auth/login'
        // failureFlash: true
    })(req, res, next);
})

router.get('/logout', ((req, res) => {
    req.logout();
    // req.flash('success_msg', 'Successfully logged out')
    res.redirect('/')
}))

module.exports = router;