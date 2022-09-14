const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const UserModel = require('./models/Users');
const bcrypt = require("bcrypt");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.dbConnect)

app.get("/getUsers", (req, res) => {
    UserModel.find({}, (err, result) => {
        if  (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
})

app.post("/signup", async (req, res) => {
    const body = req.body;

    if (!(body.email)) {
        return res.status(400).send({ error: "Data doesn't contain email or is formmated incorrectly" });
    }

    if (!(body.password)) {
        return res.status(400).send({ error: "Data doesn't contain password or is formmated incorrectly" });
    }

    if (!(body.type)) {
        return res.status(400).send({ error: "Data doesn't contain email or is formmated incorrectly" });
    }

    if (!(body.name)) {
        return res.status(400).send({ error: "Data doesn't contain name or is formmated incorrectly" });
    }

    const user = new UserModel(body);
    const salt = await bcrypt.genSalt(10);
    
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
});

app.listen(PORT, () => {
    console.log('listening on http://localhost:' + PORT);
});