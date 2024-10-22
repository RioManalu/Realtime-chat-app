const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter a name"]
    },
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please enter a password"]
    },
    profile_pic:{
        type: String,
        default: ''
    }
},{
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;