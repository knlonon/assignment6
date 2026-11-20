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

for the render i try my best to get it to run but i could figure out the problem https://api.render.com/deploy/srv-dc0bn5bm8hqs738i3dq0?key=P8NGpvnGR1g