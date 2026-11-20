
/*
 * Name: Keith N Lonon
 * Date: 11.20.2026
 * CSC 372-01
 *
 * Establishes the PostgreSQL database connection.
 */

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Create a connection pool for Neon PostgreSQL.
let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
