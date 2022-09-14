const UserModel = require('../models/Users');
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    const body = req.body;
    
    const user = new UserModel(body);
    const salt = await bcrypt.genSalt(10);
    
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
}