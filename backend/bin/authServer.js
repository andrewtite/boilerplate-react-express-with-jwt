import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {validateToken} from './tokenGeneration.js';
import {getConnection} from './db.js';
import bcrypt from 'bcrypt';
import {generateAccessToken, generateRefreshToken} from './tokenGeneration.js';
import {IpFilter} from 'express-ipfilter';
import fs from 'fs';
import os from 'os';
import {parse as envParse, stringify as envStringify} from 'envfile';

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
    const saltRounds = 10;
    let password = 'test';

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

// Generate password for frontend to use.
// This is a hashed password using the ACCESS_TOKEN_SIGNIN environment variable
// This route is not run from the frontend. For security reasons, it is designed to be run from
// an API tool such as Postman (https://www.postman.com)
// 1. Sign in using API tool on your computer to get access key.
// 2. Send API request using access to /signingen and it will respond with the username and password you should
//    use on the frontend.
// 3. Modify frontend .env:
//      -ACCESS_TOKEN_SIGNIN = Same ACCESS_TOKEN_SIGNIN as backend environment variable (.env file)
//      -REACT_APP_API_USER = Username provided to you by /signingen API call from API tool on your computer.
//      -REACT_APP_API_PASS = Password provided to you by /signingen API call from API tool on your computer.

app.get('/api/signinSaltGen', validateToken, async (req, res) => {
    // Get current Environment Variables
    const getEnvironmentVars = async () => {
        const envVars = fs.readFileSync("./.env", {encoding: 'utf8'}).split(os.EOL);
        return envVars;
    };

    // Update Environment Variable in .env file
    const updateEnvFile = (async (key, value) => {
        // read file from hdd & split if from a linebreak to a array
        const ENV_VARS = await getEnvironmentVars();

        // find the env we want based on the key
        const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
            // (?<!#\s*)   Negative lookbehind to avoid matching comments (lines that starts with #).
            //             There is a double slash in the RegExp constructor to escape it.
            // (?==)       Positive lookahead to check if there is an equal sign right after the key.
            //             This is to prevent matching keys prefixed with the key of the env var to update.
            const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?==)`);

            return line.match(keyValRegex);
        }));

        // if key-value pair exists in the .env file,
        if (target !== -1) {
            // replace the key/value with the new value
            ENV_VARS.splice(target, 1, `${key}=${value}`);
        } else {
            // if it doesn't exist, add it instead
            ENV_VARS.push(`${key}=${value}`);
        }

        // write everything back to the file system
        fs.writeFileSync(".env", ENV_VARS.join(os.EOL));
    });

    // Salt
    let saltRounds = parseInt(process.env.SALT_ROUNDS);

    const salt = await bcrypt.genSalt(saltRounds);
    await updateEnvFile('ACCESS_TOKEN_SIGNIN_SALT', salt);

    const apiUsername = process.env.REACT_APP_API_USER ? process.env.REACT_APP_API_USER : 'apiPublic1';

    const response = {
        "salt": salt,
        "username": process.env.REACT_APP_API_USER ? process.env.REACT_APP_API_USER : apiUsername
    };

    console.log('response to send', response);
    console.log('\n\n!! ENVIRONMENT VARIABLES UPDATED !!\n!! PLEASE RESTART SERVER !!\n\n');

    res.send(response);

    // bcrypt.genSalt(saltRounds, salt => {
    //     console.log('salt', salt);
    //     const response = {
    //         "salt": salt,
    //         "username": process.env.REACT_APP_API_USER ? process.env.REACT_APP_API_USER : 'api_user_1'
    //     };
    //     console.log('response to send', response);
    //     res.send(response);
    // })

    // const dbConnect = async () => {
    //     return await getConnection();
    // };
    //
    // dbConnect().then(connection => {
    //     connection.query(`SELECT * FROM ${DB_PREFIX}api WHERE username = '${req.body.user}'`, async (err, rows) => {
    //         if (err) {
    //             res.status(err.status || 500);
    //             const errRes = {
    //                 "success": false,
    //                 "message": err.sqlMessage ? `Database Error: ${err.sqlMessage}` : 'Database Error. Please check your request or contact the system administrator.',
    //                 "errno": err.errno ? err.errno : "0", // just defaulting to 0 for now
    //                 "error": err,
    //                 "request": {
    //                     "method": req.method,
    //                     "url": req.url,
    //                 },
    //                 "data": {}
    //             };
    //             res.send(errRes);
    //             return;
    //         }
    //
    //         if (rows.length === 0) {
    //             res.status(404).send('User does not exist')
    //             return;
    //         }
    //
    //         // get access token and refresh token
    //         if (await bcrypt.compare(req.body.password, rows[0].password)) {
    //             const accessToken = generateAccessToken({user: req.body.name});
    //             const refreshToken = generateRefreshToken({user: req.body.name});
    //             refreshTokens.push(refreshToken);
    //
    //             res.json({accessToken: accessToken, refreshToken: refreshToken});
    //         } else {
    //             res.status(401).send('Password Incorrect!');
    //         }
    //     });
    // });
});


app.get('/signingentest1', validateToken, (req, res) => {
    const testRes = {
        "username": process.env.REACT_APP_API_USER ? process.env.REACT_APP_API_USER : 'api_user_1',
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

// Whitelist
const validIps = ['::12', '127.0.0.1']; // Put your IP whitelist in this array
app.use(IpFilter(validIps));

app.listen(PORT, () => {
    console.log(`Authorization Server running on port ${PORT}...`)
});