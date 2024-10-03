const express = require("express");
const router = express.Router();
const {signup, login} = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddlewares");

router.post('/signup', signup);
router.post('/login', login);

router.get('/protected', authMiddleware, (req, res)=>{
    res.send("This is a protected route");
});

module.exports = router;