
/*
 * Name: Keith N Lonon
 * Date: 11.20.2026
 * CSC 372-01
 *
 * Starts the Triviabook Express API server.
 */

import express from 'express';
import pool from './db.js';
import triviabookRoutes from './routes/triviabook-routes.js';

let app = express();
let port = process.env.PORT || 3000;

// Parse incoming JSON requests.
app.use(express.json());

// Provide a basic API welcome message.
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Triviabook API.',
        endpoints: '/triviabook/topics'
    });
});

// Connect the Triviabook routes.
app.use('/triviabook', triviabookRoutes);

// Handle invalid routes.
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found.'
    });
});

/**
 * Starts the server after checking the database connection.
 *
 * @returns {Promise<void>} Starts the Express server.
 */
async function startServer() {
    try {
        await pool.query('SELECT NOW()');

        app.listen(port, () => {
            console.log(`Triviabook API running on port ${port}`);
        });

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

startServer();
