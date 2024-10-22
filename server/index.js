const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const endPoint = require('./routes/index');
const cookieParser = require('cookie-parser');
const { app, server } = require("./socket/index")
require('dotenv').config();



// const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true,
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({
        message: `server running on port ${PORT}`,
    });
});

app.use('/api', endPoint);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
