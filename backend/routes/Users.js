const router = require('express').Router();

const { createUser } = require('../controllers/Users');


router.post("/signup", createUser);

module.exports = router