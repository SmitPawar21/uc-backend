const jwt = require("jsonwebtoken");

const authMiddlewares = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) return res.status(403).send('Access denied');

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

module.exports = authMiddlewares;