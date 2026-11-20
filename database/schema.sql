
/*
 * Name: Keith N Lonon
 * Date: 11.20.2026
 * CSC 372-01
 *
 * Creates the Triviabook database tables.
 */

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,

    CONSTRAINT fk_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_difficulty
        CHECK (difficulty IN ('easy', 'medium', 'hard'))
);
