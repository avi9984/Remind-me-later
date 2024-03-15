const { Reminder } = require('../models/reminder');
const { verifyToken } = require('../services/authServices')

const addReminder = async (req, res) => {
    const verification = await verifyToken(req, res);
    if (verification.isVerified) {
        const { date, time, message } = req.body;
        if (!(date && time && message)) {
            return res.status(400).json({ status: false, message: "All fields are required" })
        }
        const datetime = new Date(`${date} ${time}`);
        const obj = {
            userId: verification.data.data.userId,
            datetime: datetime,
            message: message
        }
        // console.log(obj);
        // process.exit(0)
        const reminder = await Reminder.create(obj);
        return res.status(201).json({ status: true, message: "Remind message" })
    } else {
        return res.status(401).json({ status: false, message: verification.message })
    }
}

const getReminderMessage = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userId = verification.data.data.userId;
            const message = await Reminder.find({ userId: userId });
            if (!message || message.length === 0) {
                return res.status(404).json({ status: false, message: "Message not found" })
            }
            return res.status(200).json({ status: true, message: "Reminder message", data: message })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

const getMessageById = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const id = req.params.id;
            const message = await Reminder.findOne({ _id: id })
            if (!message) {
                return res.status(404).json({ status: false, message: "Message not found" })
            }
            return res.status(200).json({ status: true, message: "Get message by id", message })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}

const updateReminderMessage = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userId = verification.data.data.userId
            const { message } = req.body;
            const id = req.params.id;
            // console.log(req.body, id);
            const findMessage = await Reminder.findOneAndUpdate({ _id: id, userId }, {
                $set: {
                    message: message
                }
            }, { new: true })
            if (!findMessage) {
                return res.status(404).json({ status: false, message: "Message not found" })
            }
            return res.status(200).json({ status: true, message: "Message updated success" })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteMessage = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userId = verification.data.data.userId;
            const id = req.params.id;
            const message = await Reminder.findOneAndDelete({ _id: id, userId });
            if (!message) {
                return res.status(404).json({ status: false, message: "Message not found" })
            }
            return res.status(200).json({ status: true, message: "Reminder message deleted successfully" })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}

const searchMessage = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const queryParams = req.query;
            const userId = verification.data.data.userId;
            let filterQuery = { ...queryParams, userId };
            const message = await Reminder.find(filterQuery);
            if (!message || message.length === 0) {
                return res.status(404).json({ status: false, message: "Not have any data" })
            }
            return res.status(200).json({ status: true, message: "Get search message", message })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = { addReminder, getReminderMessage, getMessageById, updateReminderMessage, deleteMessage, searchMessage };

