if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express') // Server
const app = express() 
const bcrypt = require('bcrypt') // Hashing
const passport = require('passport') // Login
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override') // For Logout Feature

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email =>  users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = [] // Stores user information
/*
    NOTE: 
        1. When used in a real application, this data would be stored in a database
        2. users variable will be cleared everytime the server is reset
*/

app.set('view-engine','ejs')
app.use(express.urlencoded({ extended: false})) // Allows us to access forms in req in post methods
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Route for welcome page
app.get('/', checkAuthenticated, (req,res) => {
    res.render('index.ejs', { name : req.user.name})
})


// Routes for login page *******************************
app.get('/login', checkNotAuthenticated,(req,res) => {
    res.render('login.ejs')
})


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// *****************************************************



// Routes for register page ****************************
app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs')
})


app.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

// ********************************************************


// Allows a logged in user to be logged out
app.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});


// Checks if the user has been authenticated
// Prevents user from accessing index page without being logged in
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
} 


// Checks if the user has been authenticated 
// Prevents yser from accessing login and register pages while being logged in
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)