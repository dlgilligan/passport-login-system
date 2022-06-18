const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if(user == null) {
            return done(null, false, { message: "No user with that email"}) // Used to return error, however there is a non-server error
        } 

        try {
            if(await bcrypt.compare(password,user.password)) { // Password Matched
                return done(null, user)
            } else { // Password did not match
                return done(null, false, {message: "Password incorrect"})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'},authenticateUser))
    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize