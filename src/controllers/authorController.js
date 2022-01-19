const authorModel = require('../models/authorModel.js');
const { genrateToken } = require('../token/jwt.js');
const { isValidString, isValidRequestBody, isValidTitle, isVaildEmail } = require('../validations/validator.js');

//****************** API for create author ******************
const registerAuthor = async function (req, res) {

    try {

        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: 'Empty request body. Please provide details' });

        const { fname, lname, title, email, password, } = req.body

        if (!isValidString(fname)) return res.status(400).send({ status: false, message: 'Please provide first name' });

        if (!isValidString(lname)) return res.status(400).send({ status: false, message: 'Please provide last name' });

        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: 'Please provide title' });

        if (!isValidString(email)) return res.status(400).send({ status: false, message: 'Please provide email' });

        if (!isVaildEmail(email)) return res.status(400).send({ status: false, message: 'Please provide valid email' });

        if (!isValidString(password)) return res.status(400).send({ status: false, message: 'Please provide password' });

        const emailExist = await authorModel.findOne({ email: email });

        if (emailExist) return res.status(400).send({ status: false, message: 'Email is already registered' });

        const authorDetails = await authorModel.create(req.body);  // creating entry in db

        res.status(201).send({ status: true, message: "Successfully Registered", data: authorDetails })

    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }

};


//****************** API for Author login ******************
const login = async function (req, res) {

    try {

        let requestBody = req.body;

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: 'Empty request body. Please provide details' });

        const { email, password } = req.body;

        if (!isValidString(email)) return res.status(400).send({ status: false, message: 'Please provide email' });

        if (!isVaildEmail(email)) return res.status(400).send({ status: false, message: 'Please provide valid email' });

        if (!isValidString(password)) return res.status(400).send({ status: false, message: 'Please provide password' });

        const authorEmail = await authorModel.findOne({ email: email }); //  matching email in db

        if (!authorEmail) return res.status(400).send({ status: false, message: 'Invalid email' });

        const authorPassword = await authorModel.findOne({ password: password });  // matching password in db

        if (!authorPassword) return res.status(400).send({ status: false, message: 'Invalid password' });

        const payload = { authorId: authorEmail._id };  //payload for token

        const token = await genrateToken(payload);   //genrating token

        res.status(200).send({ status: false, message: 'login successfull', data: { ...payload, token } }) //spreading feilds of payload


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};



//****************** API for list of all register Author ******************
const getRegisterAuthorList = async function (req, res) {
    try {
        const list = await authorModel.find();

        res.status(200).send({ status: true, message: "Register Author list", data: list });

    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }

};

//****************** for export functions ******************
module.exports = {
    registerAuthor, login, getRegisterAuthorList

}