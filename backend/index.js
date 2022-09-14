const express = require('express');
const app  = express();
const mongoose = require('mongoose');

const cors = require('cors');
const userRouter = require('./routes/Users');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(cors());
app.use("/api/v1/users/", userRouter)

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



app.listen(PORT, () => {
    console.log('listening on http://localhost:' + PORT);
});