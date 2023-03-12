const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    user: 'klara',
    port: 5432,
    password: 'klara',
    database: 'shteweButcher',
})
module.exports = client