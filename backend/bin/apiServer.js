import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {validateToken} from './tokenGeneration.js';
// import {getConnection} from './db.js';
// import {reject} from 'bcrypt/promises.js';
import * as Errors from './error.js';
import {Forbidden} from './error.js';

dotenv.config();
const app = express();

app.use(express.json());

// get API Server port number from .env file
// API Server is run of different port from Auth Server
const PORT = process.env.PORT;
// const DB_PREFIX = process.env.DB_PREFIX || '';

app.listen(PORT, () => {
    console.log(`API server running on running on port ${PORT}...`);
});

app.use(cors());

// Whitelist
app.use((req, res, next) => {
    let validIps = ['::12', '127.0.0.1']; // Put your IP whitelist in this array

    console.log('req.connection', req.connection.remoteAddress);
    if(validIps.includes(req.connection.remoteAddress)){
        // IP is ok, so go on
        console.log("IP ok");
        next();
    }
    else{
        // Invalid ip
        console.log("Bad IP: " + req.connection.remoteAddress);
        const err = new Error("Bad IP: " + req.connection.remoteAddress);

        next(err);
    }
});

// Routes
app.get('/test', validateToken, (req, res) => {
    console.log('Token is valid');

    const testRes = {
        "success": true,
        "status_code": req.statusCode ? req.statusCode : "1",
        "status_message": req.statusMessage ? req.statusMessage : "Successful",
        "request": {
            "method": req.method,
            "url": req.url,
        },
        "data": {
            "employee_name": "Mister Ed",
            "employee_id": 1
        }
    };
    res.send(testRes);
});

// EXAMPLE GET ROUTE
//
// app.get('/currencies', validateToken, (req, res) => {
//     try {
//         const dbConnect = async () => {
//             return await getConnection();
//         };
//         dbConnect().then(connection => {
//             connection.query(`SELECT * FROM ${DB_PREFIX}currency`, (err, rows, fields) => {
//                 res.json(rows);
//             });
//         });
//     } catch (err) {
//         console.log('error', err);
//     }
// });

// Error handler
app.use((err, req, res, next) => {
    console.log('err', err);
    if (res.headersSent) {
        return next(err)
    }
    res.status(err.status || 500);
    const errRes = {
        "success": false,
        "message": err ? JSON.stringify(err) : 'Error occurred. Please check your request.',
        "error_code": 1308,
        "request": {
            "method": req.method,
            "url": req.url,
        },
        "data": {}
    };
    res.send(errRes);
});