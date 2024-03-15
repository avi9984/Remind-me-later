const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: { type: Number },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minLenght: 8 }
}, { versionKey: false, timestamps: true })


const userToken = new mongoose.Schema({
    userId: { type: Number },
    token: { type: String },
    refreshToken: { type: String },
    active: { type: Number },
    expireIn: { type: Number }
})

const User = mongoose.model("User", userSchema);
const UserToken = mongoose.model("UserToken", userToken);

module.exports = { User, UserToken }