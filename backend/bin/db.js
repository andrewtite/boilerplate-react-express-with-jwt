import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 100,
    charset: 'utf8mb4',
    debug: true
});

export const getConnection = res => {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection(function(err,connection){
                if (err) {
                    connection.release();
                    reject(err);
                }

                connection.on('error', function(err) {
                    connection.release();
                    reject(err);
                });

                resolve(connection);
            });
        } catch (err) {
            reject(err);
        }
    });
};