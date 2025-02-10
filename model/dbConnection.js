import pg from "pg";

import dotenv from "dotenv";

dotenv.config();

export const db = new pg.Client({

    user: process.env.USER,        
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT_AIVEN,
    ssl: {
        rejectUnauthorized: false,
    }
});