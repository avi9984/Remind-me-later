const { UserToken } = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = async (req, res, data) => {
    try {
        let message = {
            isVerified: false,
            token: '',
            refreshToken: ''
        }

        const existingUserToken = await UserToken.findOne({ userId: data.userId });
        if (existingUserToken) {
            // Check if a token already exists for the given user
            const expireInOneDay = 3600 * 24;
            const token = jwt.sign({ data: data }, process.env.JWT_SECRET_KEY, {
                expiresIn: expireInOneDay,
            });
            existingUserToken.token = token;
            existingUserToken.active = 1;
            await existingUserToken.save();

            const refreshToken = jwt.sign({ data: { ...data, id: existingUserToken._id } }, process.env.JWT_REFRESH_KEY, { expiresIn: expireInOneDay * 7 });

            existingUserToken.refreshToken = refreshToken;
            await existingUserToken.save();

            message = {
                isVerified: true,
                token: token,
                active: 1,
                refreshToken: refreshToken,
            };
        } else {
            //create a new one
            const expiresInOneDay = 3600 * 24;
            const token = jwt.sign({ data: data }, process.env.JWT_SECRET_KEY, {
                expiresIn: expiresInOneDay * 7,
            });

            const userToken = new UserToken({
                userId: data.userId,
                token: token,
                refreshToken: '',
                active: 1,
                expiresIn: expiresInOneDay,
            });
            const savedUserToken = await userToken.save();

            const refreshToken = jwt.sign(
                { data: { ...data, id: savedUserToken._id } },
                process.env.JWT_REFRESH_KEY,
                {
                    expiresIn: expiresInOneDay,
                }
            );

            savedUserToken.refreshToken = refreshToken;
            await savedUserToken.save();

            message = {
                isVerified: true,
                token: token,
                refreshToken: refreshToken,
            };
        }
        return message
    } catch (error) {
        console.log(error);
    }
}

const verifyToken = async (req, res, next) => {
    const bearerHeader = await req.headers["authorization"]
    if (!bearerHeader) {
        return { message: "Token is missing", isVerified: false }
    }
    let token = bearerHeader.split(' ')[1]
    if (typeof bearerHeader !== "undefined" && token) {
        let matchToken = await UserToken.findOne({ token: token })
        try {
            if (matchToken && matchToken.active === 1) {
                const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
                return {
                    message: "Success",
                    isVerified: true,
                    data: decode,
                    token: token,
                };
            } else {
                return {
                    message: "Token Expired !!",
                    isVerified: false,
                    data: "",
                };
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    message: "Token Expired",
                    isVerified: false,
                    data: "",
                };
            } else {
                console.log(error);
                return {
                    message: "UnAuthorized User !!",
                    isVerified: false,
                    data: "",
                };
            }
        }
    } else {
        res.status(400).send({ status: false, message: "Invalid token" });
    }
}


module.exports = { createToken, verifyToken }