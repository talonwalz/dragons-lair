const bcrpyt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const { username, password, isAdmin } = req.body
        try {
            const result = await db.get_user([username])
            const existingUser = result[0]
            if (existingUser) {
                return res.status(409).send('Username taken')
            } 
            const salt = bcrpyt.genSaltSync(10)
            const hash = bcrpyt.hashSync(password, salt)
            const registeredUser = await db.register_user([isAdmin, username, hash])
            const user = registeredUser[0]
            req.session.user = {isAdmin: user.isAdmin, username: user.username, password: user.password, id: user.id}
            return res.status(201).send(req.session.user)
        } catch(err) {
            console.log(err)
            res.sendStatus(500)
        }
    } ,
    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        try {
            const foundUser = await db.get_user([username])
            const user = foundUser[0]
            if(!user) {
                return res.status(401).send(`User not found. Please register as a new user before logging in.`)
            }
            const isAuthenticated = bcrpyt.compareSync(password, user.hash)
            if(!isAuthenticated) {
                return res.status(403).send(`Incorrect password`)
            }
            req.session.user = {isAdmin: user.isAdmin, username: user.username, password: user.password, id: user.id}
            return res.status(200).send(req.session.user)
        } catch(err) {
            console.log(err)
            res.sendStatus(500)
        }
    },
    logout: async (req, res) => {
        req.session.destroy()
        return res.sendStatus(200)
    }
}