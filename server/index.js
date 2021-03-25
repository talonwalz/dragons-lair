require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const app = express()
const authCtrl = require('./controllers/authCtrl')
const treasureCtrl = require('./controllers/treasureCtrl')
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register)
app.post(`/auth/login`, authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
.then( dbInstance => {
    app.set('db', dbInstance)
app.listen(SERVER_PORT, () => console.log(`The server is connected to the DB and running on port ${SERVER_PORT}`))
})
.catch(err => console.log(err))


