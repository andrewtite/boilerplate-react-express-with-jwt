import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {validateToken} from './tokenGeneration.js';
import {getConnection} from './db.js';
import bcrypt from 'bcrypt';
import {generateAccessToken, generateRefreshToken} from './tokenGeneration.js';
import {IpFilter} from 'express-ipfilter';

dotenv.config();
const app = express();
app.use(cors());
let refreshTokens = [];

// this middleware will allow us to pull req.body.<params>
app.use(express.json());

// get API Server port number from .env file
// API Server is run of different port from Auth Server
const PORT = process.env.TOKEN_SERVER_PORT;
const DB_PREFIX = process.env.DB_PREFIX || '';

// login endpoint
app.post('/api/signin', async (req, res) => {
    const dbConnect = async () => {
        return await getConnection();
    };

    dbConnect().then(connection => {
        connection.query(`SELECT * FROM ${DB_PREFIX}api WHERE username = '${req.body.user}'`, async (err, rows) => {
            if (err) {
                res.status(err.status || 500);
                const errRes = {
                    "success": false,
                    "message": err.sqlMessage ? `Database Error: ${err.sqlMessage}` : 'Database Error. Please check your request or contact the system administrator.',
                    "errno": err.errno ? err.errno : "0", // just defaulting to 0 for now
                    "error": err,
                    "request": {
                        "method": req.method,
                        "url": req.url,
                    },
                    "data": {}
                };
                res.send(errRes);
                return;
            }

            if (rows.length === 0) {
                res.status(404).send('User does not exist')
                return;
            }

            // get access token and refresh token
            if (await bcrypt.compare(req.body.password, rows[0].password)) {
                const accessToken = generateAccessToken({user: req.body.name});
                const refreshToken = generateRefreshToken({user: req.body.name});
                refreshTokens.push(refreshToken);

                res.json({accessToken: accessToken, refreshToken: refreshToken});
            } else {
                res.status(401).send('Password Incorrect!');
            }
        });
    });
});

// refresh token endpoint
app.post('/api/refreshToken', (req, res) => {
    if (!refreshTokens.includes(req.body.refreshToken)) {
        res.status(401).send('Refresh Token Invalid!');
    } else if (!req.body.user) {
        res.status(401).send('User Invalid!');
    } else {
        // remove old refresh token
        refreshTokens = refreshTokens.filter(c => c !== req.body.refreshToken);

        // generate new accessToken and refreshToken
        const accessToken = generateAccessToken({user: req.body.name});
        const refreshToken = generateRefreshToken({user: req.body.name});
        refreshTokens.push(refreshToken);

        res.json({accessToken: accessToken, refreshToken: refreshToken});
    }
});

// retire refresh token on logout
app.delete('/api/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(c => c !== req.body.token);
    res.status(204).send('Logged out!');
});


// Whitelist
const validIps = ['::12', '127.0.0.1']; // Put your IP whitelist in this array
app.use(IpFilter(validIps));

app.listen(PORT, () => {
    console.log(`Authorization Server running on port ${PORT}...`)
});