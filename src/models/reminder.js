const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
    userId: { type: Number },
    datetime: { type: String, required: true },
    message: { type: String, required: true }
}, { versionKey: false, timestamps: true })

const Reminder = mongoose.model("Reminder", reminderSchema)
module.exports = { Reminder };