const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getDetailsFromToken = async (token) => {
    if(!token){
        return {
            message : "session out",
            logout : true
        }
    }

    const decode = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await UserModel.findById(decode.id).select('-password');

    return user;
}

module.exports = getDetailsFromToken;