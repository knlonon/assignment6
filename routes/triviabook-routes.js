
/*
 * Name: Keith N Lonon
 * Date: 11.20.2026
 * CSC 372-01
 *
 * Defines the Triviabook API routes.
 */

import express from 'express';

import {
    getTopics,
    getTopicQuestions,
    getRandomQuestion,
    checkAnswer,
    addNewQuestion
} from '../controllers/triviabook-controller.js';

let router = express.Router();

// Get all trivia topics.
router.get('/topics', getTopics);

// Get questions belonging to a topic.
router.get('/topic/:topic', getTopicQuestions);

// Get a random question.
router.get('/random', getRandomQuestion);

// Check a submitted answer.
router.post('/answer', checkAnswer);

// Add a new trivia question.
router.post('/question/add', addNewQuestion);

export default router;
