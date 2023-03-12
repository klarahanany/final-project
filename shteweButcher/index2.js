const express = require("express")
const bcrypt = require("bcrypt")
const saltRounds = 10;
const app = express()
const port = 3000 || process.env.port
const cors = require("cors")
const db = require("./shteweButcher/Database/connection.js");
const { request } = require("express");
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/shopnow.html")
})
app.post("/", async (req, res) => {
    const result = await db.query(`SELECT * FROM products ;`);
    res.json(result.rows);
});
app.use('/css', express.static(__dirname + '/css'))
app.use('/html', express.static(__dirname + '/html'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))
app.listen(port, () => {
    console.log('Listening at http://localhost:' + port)
})