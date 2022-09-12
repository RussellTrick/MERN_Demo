const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const config = require('./config.json');
const UserModel = require('./models/Users');

mongoose.connect(config.dbConnect)

app.get("/getUsers", (req, res) => {
    UserModel.find({}, (err, result) => {
        if  (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
})

app.listen(3001, () => {
    console.log('listening on http://localhost:3001');
});