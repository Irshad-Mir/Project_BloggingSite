const { decodeToken } = require('../token/jwt.js');

const authorAuth = async function (req, res, next) {

    try {

        const token = req.header('x-api-key');

        if (!token) return res.status(400).send({ status: false, message: 'Missing  authentication token in requst' });

        const decodedToken = await decodeToken(token);

        if (!decodedToken) return res.status(403).send({ status: false, message: 'Invalid authentication token in requst' });

        req.authorId = decodedToken.authorId;

        next();

    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }

};

module.exports = {authorAuth}