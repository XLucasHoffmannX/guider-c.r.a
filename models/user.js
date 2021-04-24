const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    cratedAt: {
        type: Date,
        default: Date.now
    }
})

UserModel.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};

UserModel.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', UserModel);

module.exports = User