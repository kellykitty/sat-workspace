# SAT Vocabulary Learning Web Application

## 1. Overview

This document describes the product requirements and functional
specification for a free, no-login web application designed to help
students memorize SAT vocabulary words. The app offers two main study
modes: a timed practice mode and a word-count practice mode. All data is
stored locally within the user's browser and does not require
authentication.

## 2. Goals & Objectives

-   Provide students with an efficient, engaging, and free tool for
    learning SAT vocabulary.
-   Offer flexible practice modes suitable for quick review or targeted
    study sessions.
-   Automatically reinforce the user's weaknesses by increasing the
    frequency of incorrectly answered words.
-   Operate without user accounts or back-end authentication.

## 3. Target Users

-   Primary: High-school students preparing for the SAT.
-   Secondary: Teachers or parents recommending supplementary study
    tools.

## 4. Key Features

### 4.1 SAT Word Bank

-   A predefined list of SAT vocabulary words and definitions.
-   Stored on the server or as a client-accessible static file (JSON).
-   Words include: term, definition, example sentences (optional),
    difficulty tag (optional).

### 4.2 Study Modes

#### 4.2.1 Timed Practice Mode

-   User selects a 5-minute fixed-duration session.
-   User chooses one of two question formats:
    1.  **Definition → Word**: Show definition; user selects the correct
        word.
    2.  **Word → Definition**: Show word; user selects from four
        definitions.
-   During each question:
    -   Immediate feedback is shown upon answering.
    -   Correct answers display a green check mark animation.
    -   Incorrect answers show a red X, and the correct option is
        highlighted in green.
-   At the end of the 5 minutes, user sees:
    -   Total questions answered
    -   Correct vs incorrect
    -   Accuracy percentage
    -   List of missed words

#### 4.2.2 Word Count-Based Practice Mode

-   User specifies a number of questions (e.g., 30).
-   The system generates questions for that number.
-   Incorrectly answered words during the session are recorded.
-   Frequently missed words appear more often in future sessions.

### 4.3 Local Performance Tracking

-   Stored in localStorage; no login required.
-   Tracks per-word statistics:
    -   Times seen
    -   Times correct
    -   Times incorrect
-   Word frequency in quizzes dynamically adjusts based on performance.

### 4.4 User Interface

-   Clean, minimal interface optimized for quick study.
-   Mobile-friendly responsive design.
-   Clear feedback for right/wrong answers.

## 5. Technical Specification

### 5.1 Architecture

-   **Frontend**: Next.js application.
-   **Backend**: Node.js server responsible for serving the word list
    and handling user-specific data.
-   **User Data Storage**: A lightweight per-user database, keyed by a
    unique browser identifier, storing accuracy percentages for each
    word. Data may be stored via:
    -   Local persistent storage in the browser (as fallback), and/or
    -   A lightweight backend store (e.g., SQLite, lowdb, or a small
        NoSQL collection) mapped to anonymous user IDs.

### 5.2 Suggested Tech Stack

-   **Frontend**: React (via Next.js), TailwindCSS.
-   **State Management**: Local storage + lightweight client-side state.
-   **Backend**: Node.js with a lightweight database.
-   **Build/Deploy**: Vercel, Netlify, or static hosting.

### 5.3 Data Model

#### Word Object

    {
      id: number,
      word: string,
      definition: string,
      examples?: string[],
      difficulty?: string
    }

#### Local Performance Object (per-user)

    {
      [wordId]: {
        correct: number,
        incorrect: number
      }
    }

### 5.4 Question Generation Logic

-   Randomly select a word based on weighted probabilities:
    -   Base weight = 1
    -   Additional weight added for high incorrect rate
-   Generate 3 distractor answers:
    -   Random selection from other words
    -   Ensure no duplicates and not the correct word

### 5.5 Session Flow

#### Timed Mode

1.  User selects question type.
2.  5-minute timer starts.
3.  Questions generated one at a time with immediate feedback.
4.  At expiration, stop and show a summary.

#### Word Count Mode

1.  User chooses number of questions.
2.  System creates a fixed sequence based on weighted word selection.
3.  After finishing, show performance summary and update stored
    statistics.

## 6. Future Enhancements

-   Add spaced-repetition scheduling.
-   Add synonyms and antonyms.
-   Allow exporting missed words.
-   Add optional login to sync progress.
-   Add streaks and gamification elements.

## 7. Non-Functional Requirements

-   Fully client-side execution for speed.
-   Fully accessible (WCAG compliant whenever possible).
-   Loads quickly on mobile devices.

## 8. Success Metrics

-   High session completion rate.
-   Repeat daily/weekly usage.
-   Improved correct-answer rate over time.

## 9. Appendix: Example Screens

(Design sketches can be added later.)
