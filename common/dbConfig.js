require('dotenv').config()

dbUrl = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.b7gjyld.mongodb.net/${process.env.DB_NAME}`

module.exports = {dbUrl}