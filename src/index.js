const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000

const userRoutes = require("./routes/user");
const reminderRoutes = require("./routes/reminder");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB is connected..")).catch((err) => console.log(err))


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reminder', reminderRoutes)

app.listen(PORT, () => {
    console.log(`Server is listing on port: http://localhost:${PORT}`);
})

