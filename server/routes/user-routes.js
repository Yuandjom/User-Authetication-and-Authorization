const express = require('express');
const { signup, login , verifyToken, getUser, refreshToken} = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', signup)
router.post("/login", login)
router.get("/user", verifyToken, getUser);
//router.get('refresh', refreshToken, verifyToken, getUser);
//verify token

//exporting router as a standalone module
module.exports = router