const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const config = require('./config.json');
const UserModel = require('./models/Users');
const cors = require('cors');

app.use(express.json());
app.use(cors());

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

app.post("/createUser", async (req, res) => {
    const user = req.body
    const newUser = new UserModel(user);
    await newUser.save();

    res.json(user);
})

app.listen(3001, () => {
    console.log('listening on http://localhost:3001');
});