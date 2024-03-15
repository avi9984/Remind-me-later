const express = require('express');
const router = express.Router();
const { addReminder, getReminderMessage, getMessageById, updateReminderMessage, deleteMessage, searchMessage } = require('../controllers/reminder');


router.post('/addReminder', addReminder);
router.get('/getReminderMessage', getReminderMessage);
router.get('/getMessage/:id', getMessageById);
router.put('/updateReminder/:id', updateReminderMessage);
router.delete('/deleteMessage/:id', deleteMessage);
router.get('/search', searchMessage);


module.exports = router;