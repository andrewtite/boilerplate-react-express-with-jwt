import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {IpFilter} from 'express-ipfilter';
import {validateToken} from './tokenGeneration.js';
// import {getConnection} from './db.js';
// import {reject} from 'bcrypt/promises.js';
// import * as Errors from './error.js';
// import {BadRequest, Forbidden, Unauthorized} from './error.js';

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors());

// get API Server port number from .env file
// API Server is run of different port from Auth Server
const PORT = process.env.PORT;
// const DB_PREFIX = process.env.DB_PREFIX || '';

// Whitelist
const validIps = ['::12', '127.0.0.1']; // Put your IP whitelist in this array
app.use(IpFilter(validIps));

app.listen(PORT, () => {
    console.log(`API server running on running on port ${PORT}...`);
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
        "message": err.name ? err.name : 'Error occurred. Please check your request.',
        "error_code": err.code ? err.code : 1308, // just defaulting to 1308 for now
        "request": {
            "method": req.method,
            "url": req.url,
        },
        "data": {}
    };
    res.send(errRes);
});