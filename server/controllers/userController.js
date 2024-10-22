const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDetailsFromToken = require('../utils/getDetailsFromToken');

module.exports.userRegister = async (req, res) => {
    try {
        const { name, email, password, profile_pic } = req.body;
        const checkEmail = await UserModel.findOne({ email });    // { name, email } || null
        if(checkEmail) {
            return res.status(400).json({
                message: 'email already exist',
                error: true,
            });
        }

        // hash password using bcrptjs
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const payload = {
            name,
            email,
            password: hashedPassword,
            profile_pic,
        }

        const user = new UserModel(payload);
        const userSave = await user.save();
        return res.status(201).json({
            message: 'user created successfully',
            data: userSave,
            success: true,
        });
    } catch(error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
        });
    }
}

module.exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const checkEmail = await UserModel.findOne({ email }).select('-password');

        if(!checkEmail) {
            return res.status(400).json({
                message: 'please enter registered email',
                error: true
            });
        }

        return res.status(200).json({
            message: "email verified",
            success: true,
            data: checkEmail
        });
    }catch(error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports.checkPassword = async (req, res) => {
    try {
        const { password, userId } = req.body;
        const user = await UserModel.findById(userId);
        const verifyPassword = await bcryptjs.compare(password, user.password);

        if(!verifyPassword) {
            return res.status(400).json({
                message: "wrong password",
                error: true
            });
        }
        
        const payload = {
            id: user._id,
            email: user.email
        }
        const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d'});
        const cookieOptions = {
            http: true,
            secure: true
        }

        return res.cookie('token', token, cookieOptions).status(200).json({
            message: "Login successfully",
            success: true,
            token: token
        });
    }catch(err) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports.userDetails = async (req, res) => {
    try {
        const token = req.cookies.token || '';
        const user = await getDetailsFromToken(token);
    
        return res.status(200).json({
            message: "user details",
            data: user
        });
    }catch(error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports.logout = async (req, res) => {
    try {
        const cookieOptions = {
            http: true,
            secure: true
        }

        return res.cookie('token', '', cookieOptions).status(200).json({
            message: "session out",
            success: true
        });
    } catch (error) {
        res.status(500).jsojn({
            message : error.message || error,
            error: true
        })
    }
}

module.exports.updateUserDetails = async (req, res) => {
    try {
        const token = req.cookies.token || '';
        const user = await getDetailsFromToken(token);
        const { name, profile_pic } = req.body;
        const updateUser = await UserModel.updateOne({ _id : user._id }, {
            name,
            profile_pic
        });

        const userDetails = await UserModel.findById(user._id);
        return res.status(200).json({
            message : "update successfully",
            success : true,
            data : userDetails
        })
    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            error : true
        });
    }
}

module.exports.searchUser = async (req, res) => {
    try {
        const { search } = req.body;
        const query = new RegExp(search,"i","g");
        const user = await UserModel.find({
            "$or" : [
                { name : query },
                { email : query }
            ]
        }).select("-password");

        return res.status(200).json({
            message : "all user",
            data : user,
            success : true
        });

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        });
    }
}