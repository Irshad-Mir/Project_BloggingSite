const mongoose = require('mongoose');

const isValidString = function( value){

    if( typeof value === 'undefined' || typeof value === null ) return false;
    if( typeof value === 'string' && value.trim().length === 0 ) return false;
    if( typeof value === 'number') return false;

    return true;

};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
};

const isValidTitle = function(title) {   
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
};

const isVaildEmail = function (email){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let valid = re.test(email);
    return valid 
};

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
};

module.exports = {
    isValidString,
    isValidRequestBody,
    isValidTitle,
    isVaildEmail,
    isValidObjectId
}