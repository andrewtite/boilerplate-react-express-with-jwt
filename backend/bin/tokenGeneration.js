import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

let refreshTokens = [];

export const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

export const generateRefreshToken = user => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });

    return refreshToken;
};

export const validateToken = (req, res, next) => {
    // get token from response header
    if (req.headers['authorization'] === null) res.sendStatus(400).send('Auth header present');

    const authHeader = req.headers.authorization;

    if (authHeader) {
        // the request header contains the token "Bearer <token>",
        // split the string and use the second value in the split array
        const token = typeof (authHeader) !== 'undefined' ? authHeader.split(' ')[1] : null;

        if (token === null) res.sendStatus(400).send('Token not present');

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(401);
                //res.status(403).send('Token invalid');
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
