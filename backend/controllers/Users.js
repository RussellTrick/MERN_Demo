const UserModel = require('../models/Users');
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
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
}