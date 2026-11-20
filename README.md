# assignment6
# Triviabook API

**Author:** Keith N Lonon  
**Course:** CSC 372-01  
**Assignment:** Assignment 6 - Express.js CRUD API

## Description

Triviabook is a REST API built using Node.js, Express.js,
and PostgreSQL. It allows users to retrieve trivia topics,
search questions, receive random questions, check answers,
and add new trivia questions.

The application uses Neon PostgreSQL for hosted database storage.

## Technologies

- Node.js
- Express.js
- PostgreSQL
- Neon
- JavaScript
- dotenv

## Database Schema

### topics

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) UNIQUE NOT NULL |

### questions

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| topic_id | INTEGER FOREIGN KEY |
| question | TEXT |
| answer | TEXT |
| difficulty | VARCHAR(20) |

Difficulty values: easy, medium, hard.

## Installation

1. Clone the repository.

   git clone YOUR_GITHUB_REPOSITORY_URL

2. Navigate into the project.

   cd triviabook

3. Install dependencies.

   npm install

4. Create a .env file in the project root.

   DATABASE_URL=YOUR_NEON_CONNECTION_STRING

5. Run database/schema.sql in the Neon SQL Editor.

6. Run database/seed.sql in the Neon SQL Editor.

7. Start the application.

   npm run dev

The local application runs at http://localhost:3000.

## API Endpoints

### 1. Get all topics

GET /triviabook/topics

### 2. Get questions by topic

GET /triviabook/topic/:topic

import {
    getAllTopics,
    getTopicByName,
    getQuestionsByTopic,
    getAnswerById,
    addQuestion,
    getRandomQuestion as getRandomQuestionFromDatabase
} from '../models/triviabook-model.js';

/**
 * Returns all available topics.
 */
export async function getTopics(req, res) {
    try {
        let topics = await getAllTopics();

        res.json(topics);
    } catch (error) {
        console.error('Get topics error:', error);

        res.status(500).json({
            error: 'Unable to retrieve topics.'
        });
    }
}

/**
 * Returns questions for a specific topic.
 */
export async function getTopicQuestions(req, res) {
    try {
        let topic = req.params.topic.trim();
        let limit = req.query.limit;
        let difficulty = req.query.difficulty;

        // Validate the limit.
        if (limit !== undefined) {
            limit = Number(limit);

            if (!Number.isInteger(limit) || limit < 1) {
                return res.status(400).json({
                    error: 'Limit must be a positive integer.'
                });
            }
        } else {
            limit = null;
        }

        // Validate the difficulty.
        if (difficulty !== undefined) {
            difficulty = difficulty.toLowerCase();

            if (!['easy', 'medium', 'hard'].includes(difficulty)) {
                return res.status(400).json({
                    error: 'Difficulty must be easy, medium, or hard.'
                });
            }
        } else {
            difficulty = null;
        }

        // Check whether the topic exists.
        let existingTopic = await getTopicByName(topic);

        if (!existingTopic) {
            return res.status(404).json({
                error: 'Topic not found.'
            });
        }

        // Get questions for the requested topic.
        let questions = await getQuestionsByTopic(
            topic,
            limit,
            difficulty
        );

        res.json(questions);

    } catch (error) {
        console.error('Get topic questions error:', error);

        res.status(500).json({
            error: 'Unable to retrieve questions.'
        });
    }
}

/**
 * Returns one random question without revealing its answer.
 */
export async function getRandomQuestion(req, res) {
    try {
        let question = await getRandomQuestionFromDatabase();

        if (!question) {
            return res.status(404).json({
                error: 'No questions are available.'
            });
        }

        res.json(question);

    } catch (error) {
        console.error('Random question error:', error);

        res.status(500).json({
            error: 'Unable to retrieve a random question.'
        });
    }
}

/**
 * Checks a user's answer against the correct answer.
 */
export async function checkAnswer(req, res) {
    try {
        let body = req.body || {};
        let id = body.id;
        let guess = body.guess;

        // Check that both values were provided.
        if (
            id === undefined ||
            guess === undefined ||
            String(guess).trim() === ''
        ) {
            return res.status(400).json({
                error: 'Both id and guess are required.'
            });
        }

        let questionId = Number(id);

        // Validate the question ID.
        if (!Number.isInteger(questionId) || questionId < 1) {
            return res.status(400).json({
                error: 'Question ID must be a positive integer.'
            });
        }

        // Find the correct answer.
        let question = await getAnswerById(questionId);

        if (!question) {
            return res.status(404).json({
                error: 'Question not found.'
            });
        }

        // Compare answers without considering capitalization or extra spaces.
        let correctAnswer = question.answer.trim().toLowerCase();
        let userGuess = String(guess).trim().toLowerCase();

        let correct = correctAnswer === userGuess;

        res.json({
            correct: correct,
            answer: question.answer
        });

    } catch (error) {
        console.error('Check answer error:', error);

        res.status(500).json({
            error: 'Unable to check the answer.'
        });
    }
}

/**
 * Adds a new question to the database.
 * Creates the topic if it does not already exist.
 */
export async function addNewQuestion(req, res) {
    try {
        let body = req.body || {};

        let topic = body.topic;
        let question = body.question;
        let answer = body.answer;
        let difficulty = body.difficulty;

        // Make sure all required fields are provided.
        if (
            typeof topic !== 'string' ||
            typeof question !== 'string' ||
            typeof answer !== 'string' ||
            typeof difficulty !== 'string' ||
            !topic.trim() ||
            !question.trim() ||
            !answer.trim() ||
            !difficulty.trim()
        ) {
            return res.status(400).json({
                error: 'Topic, question, answer, and difficulty are required.'
            });
        }

        // Clean up the submitted values.
        topic = topic.trim().toLowerCase();
        question = question.trim();
        answer = answer.trim();
        difficulty = difficulty.trim().toLowerCase();

        // Check that difficulty is valid.
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Difficulty must be easy, medium, or hard.'
            });
        }

        // Check the topic name length.
        if (topic.length > 100) {
            return res.status(400).json({
                error: 'Topic must be 100 characters or fewer.'
            });
        }

        // Add the question and retrieve the updated topic questions.
        let questions = await addQuestion(
            topic,
            question,
            answer,
            difficulty
        );

        res.status(201).json({
            message: 'Question added successfully.',
            questions: questions
        });

    } catch (error) {
        console.error('Add question error:', error);

        res.status(500).json({
            error: 'Unable to add the question.'
        });
    }
}