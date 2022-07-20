import dotenv from 'dotenv';
import express from 'express';
import {validateToken} from './tokenGeneration.js';

dotenv.config();
const app = express();
app.use(express.json());

// get API Server port number from .env file
// API Server is run of different port from Auth Server
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Validation server running on port ${port}`);
});

app.get('/posts', validateToken, (req, res) => {
    res.send(`${req.user.user} successfully accessed post`);
});