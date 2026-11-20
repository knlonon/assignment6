

/*
 * Name: Keith N Lonon
 * Date: 11.20.2026
 * CSC 372-01
 *
 * Inserts the initial Triviabook topics and questions.
 */

INSERT INTO topics (name)
VALUES
    ('science'),
    ('geography')
ON CONFLICT (name) DO NOTHING;

-- Insert science questions.
INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What planet is known as the Red Planet?',
       'Mars', 'easy'
FROM topics
WHERE name = 'science'
AND NOT EXISTS (
    SELECT 1 FROM questions
    WHERE topic_id = topics.id
    AND question = 'What planet is known as the Red Planet?'
);

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What is the chemical symbol for gold?',
       'Au', 'medium'
FROM topics
WHERE name = 'science'
AND NOT EXISTS (
    SELECT 1 FROM questions
    WHERE topic_id = topics.id
    AND question = 'What is the chemical symbol for gold?'
);

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What is the powerhouse of the cell?',
       'Mitochondria', 'easy'
FROM topics
WHERE name = 'science'
AND NOT EXISTS (
    SELECT 1 FROM questions
    WHERE topic_id = topics.id
    AND question = 'What is the powerhouse of the cell?'
);

-- Insert geography questions.
INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What is the capital of Australia?',
       'Canberra', 'medium'
FROM topics
WHERE name = 'geography'
AND NOT EXISTS (
    SELECT 1 FROM questions
    WHERE topic_id = topics.id
    AND question = 'What is the capital of Australia?'
);

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'Which river flows through Cairo?',
       'The Nile', 'easy'
FROM topics
WHERE name = 'geography'
AND NOT EXISTS (
    SELECT 1 FROM questions
    WHERE topic_id = topics.id
    AND question = 'Which river flows through Cairo?'
);
