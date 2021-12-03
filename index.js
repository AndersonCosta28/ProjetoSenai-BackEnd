const con = require('./db');
const express = require('express')
const bodyparser = require('body-parser');
const { request } = require('express');
const app = express()
var cors = require('cors');


app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors({origin: '*'}));

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/dados', (request, response) => {
    console.log(request.query)
    response.header("Access-Control-Allow-Origin", "*");
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    response.json({ name: "Anderson" })
})

app.listen(3000, function () {
    console.log('Server listening on port 3000!');
});