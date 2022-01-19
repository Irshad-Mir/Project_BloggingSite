const jwt = require('jsonwebtoken')

const genrateToken = async function (payload) {
    try {

        let token = await jwt.sign(payload, 'my@Secret_Key', { expiresIn: '24h' });

        return token

    } catch (error) {

        res.status(500).send({ status: false, message: error.message });

    }
}

const decodeToken = async function (token) {

    try {

         let decodedToken = await jwt.verify( token , 'my@Secret_Key');

         if(!decodedToken) return res.status(400).send({ status : false , message : 'Invalid Token'});

         return decodedToken;

    } catch (error) {

        res.status(500).send({ status: false, messsage: error.message });
    }

};

module.exports = {
    genrateToken,
    decodeToken
}