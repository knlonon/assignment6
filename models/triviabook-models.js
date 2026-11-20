
/*
 * Name: Keith N Lonon
 * Date: 11.20.2026
 * CSC 372-01
 *
 * Contains database operations for Triviabook.
 */

import pool from '../db.js';

/**
 * Retrieves all available trivia topics.
 *
 * @returns {Promise<Array>} List of topics.
 */
export async function getAllTopics() {
    let result = await pool.query(
        'SELECT id, name FROM topics ORDER BY name'
    );

    return result.rows;
}

/**
 * Retrieves a topic by name.
 *
 * @param {string} name - Topic name.
 * @returns {Promise<Object|undefined>} Matching topic.
 */
export async function getTopicByName(name) {
    let result = await pool.query(
        'SELECT id, name FROM topics WHERE name = $1',
        [name]
    );

    return result.rows[0];
}

/**
 * Retrieves questions for a specific topic.
 *
 * @param {string} topic - Topic name.
 * @param {number|null} limit - Maximum number of questions.
 * @param {string|null} difficulty - Difficulty filter.
 * @returns {Promise<Array>} Matching questions.
 */
export async function getQuestionsByTopic(topic, limit, difficulty) {
    let query = `
        SELECT questions.id, topics.name AS topic,
               questions.question, questions.answer,
               questions.difficulty
        FROM questions
        JOIN topics ON questions.topic_id = topics.id
        WHERE topics.name = $1
    `;

    let values = [topic];
    let position = 2;

    if (difficulty) {
        query += ` AND questions.difficulty = $${position}`;
        values.push(difficulty);
        position++;
    }

    query += ' ORDER BY questions.id';

    if (limit !== null) {
        query += ` LIMIT $${position}`;
        values.push(limit);
    }

    let result = await pool.query(query, values);

    return result.rows;
}

/**
 * Retrieves one random question without its answer.
 *
 * @returns {Promise<Object|undefined>} Random question.
 */
export async function getRandomQuestion() {
    let result = await pool.query(`
        SELECT questions.id, topics.name AS topic,
               questions.question, questions.difficulty
        FROM questions
        JOIN topics ON questions.topic_id = topics.id
        ORDER BY RANDOM()
        LIMIT 1
    `);

    return result.rows[0];
}

/**
 * Retrieves the correct answer for a question.
 *
 * @param {number} id - Question ID.
 * @returns {Promise<Object|undefined>} Question answer.
 */
export async function getAnswerById(id) {
    let result = await pool.query(
        'SELECT id, answer FROM questions WHERE id = $1',
        [id]
    );

    return result.rows[0];
}

/**
 * Adds a question and creates its topic if necessary.
 *
 * @param {string} topic - Topic name.
 * @param {string} question - Question text.
 * @param {string} answer - Correct answer.
 * @param {string} difficulty - Difficulty level.
 * @returns {Promise<Array>} Updated questions for the topic.
 */
export async function addQuestion(topic, question, answer, difficulty) {
    let client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Create the topic if it does not already exist.
        let topicResult = await client.query(
            `INSERT INTO topics (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [topic]
        );

        let topicId = topicResult.rows[0].id;

        // Insert the new question.
        await client.query(
            `INSERT INTO questions
             (topic_id, question, answer, difficulty)
             VALUES ($1, $2, $3, $4)`,
            [topicId, question, answer, difficulty]
        );

        // Retrieve all questions belonging to the topic.
        let questionsResult = await client.query(
            `SELECT questions.id, topics.name AS topic,
                    questions.question, questions.answer,
                    questions.difficulty
             FROM questions
             JOIN topics ON questions.topic_id = topics.id
             WHERE topics.id = $1
             ORDER BY questions.id`,
            [topicId]
        );

        await client.query('COMMIT');

        return questionsResult.rows;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
}
