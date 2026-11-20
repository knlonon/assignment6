

/*
 * Name: Keith N Lonon
 * Course: CSC 372
 * Assignment: 6 - Triviabook
 * Description: Handles requests for the Triviabook API.
 */

import {
    getAllTopics,
    getTopicByName,
    getQuestionsByTopic,
    getRandomQuestion as getRandomQuestionFromDatabase,
    getAnswerById,
    addQuestion
} from '../models/triviabook-models.js';

/**
 * Returns all available topics.
 */
export async function getTopics(req, res) {
    try {
        let topics = await getAllTopics();

        res.json(topics);
    } catch (error) {
        res.status(500).json({
            error: 'Unable to retrieve topics.'
        });
    }
}

/**
 * Returns questions for a topic.
 */
export async function getTopicQuestions(req, res) {
    try {
        let topic = req.params.topic.trim();
        let limit = req.query.limit;
        let difficulty = req.query.difficulty;

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

        let existingTopic = await getTopicByName(topic);

        if (!existingTopic) {
            return res.status(404).json({
                error: 'Topic not found.'
            });
        }

        let questions = await getQuestionsByTopic(
            topic,
            limit,
            difficulty
        );

        res.json(questions);
    } catch (error) {
        res.status(500).json({
            error: 'Unable to retrieve questions.'
        });
    }
}

/**
 * Returns one random question without its answer.
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
        res.status(500).json({
            error: 'Unable to retrieve a random question.'
        });
    }
}

/**
 * Checks a user's answer.
 */
export async function checkAnswer(req, res) {
    try {
        let body = req.body || {};
        let id = body.id;
        let guess = body.guess;

        if (id === undefined || guess === undefined ||
            String(guess).trim() === '') {
            return res.status(400).json({
                error: 'Both id and guess are required.'
            });
        }

        let questionId = Number(id);

        if (!Number.isInteger(questionId) || questionId < 1) {
            return res.status(400).json({
                error: 'Question ID must be a positive integer.'
            });
        }

        let question = await getAnswerById(questionId);

        if (!question) {
            return res.status(404).json({
                error: 'Question not found.'
            });
        }

        let correctAnswer = question.answer.trim().toLowerCase();
        let userGuess = String(guess).trim().toLowerCase();

        let correct = correctAnswer === userGuess;

        res.json({
            correct: correct,
            answer: question.answer
        });
    } catch (error) {
        res.status(500).json({
            error: 'Unable to check the answer.'
        });
    }
}

/**
 * Adds a new question to the database.
 */
export async function addNewQuestion(req, res) {
    try {
        let body = req.body || {};
        let topic = body.topic;
        let question = body.question;
        let answer = body.answer;
        let difficulty = body.difficulty;

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

        topic = topic.trim().toLowerCase();
        question = question.trim();
        answer = answer.trim();
        difficulty = difficulty.trim().toLowerCase();

        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Difficulty must be easy, medium, or hard.'
            });
        }

        if (topic.length > 100) {
            return res.status(400).json({
                error: 'Topic must be 100 characters or fewer.'
            });
        }

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
        res.status(500).json({
            error: 'Unable to add the question.'
        });
    }
}

