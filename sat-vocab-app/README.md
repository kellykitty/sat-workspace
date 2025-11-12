# SAT Vocabulary Practice Web Application

A free, no-login web application designed to help students memorize SAT vocabulary words through adaptive learning.

## Features

- **1,796 High-Frequency SAT Words** - Comprehensive word bank with definitions and synonyms
- **Two Study Modes:**
  - **Timed Practice** - 5-minute sessions for quick review
  - **Word Count Practice** - Choose your own number of questions (10, 20, 30, 50, or custom)
- **Two Question Types:**
  - Definition → Word
  - Word → Definition
- **Adaptive Learning** - Words you miss appear more frequently in future sessions
- **Instant Feedback** - Visual feedback with green checkmarks for correct answers and red X for incorrect
- **Performance Tracking** - All data stored locally in your browser (no login required)
- **Results Summary** - Detailed performance statistics and list of missed words after each session
- **Mobile-Responsive Design** - Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Running

1. Navigate to the project directory:
   ```bash
   cd sat-vocab-app
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How It Works

### Adaptive Learning Algorithm

The application uses a weighted selection algorithm to prioritize words based on your performance:

- Each word starts with a base weight of 1
- Words you answer incorrectly get higher weights
- Higher weights mean the word appears more frequently in future sessions
- This ensures you practice your weakest words more often

### Data Storage

All user data is stored locally in your browser using localStorage:

- Performance data is tracked per word (correct/incorrect counts)
- No account creation or backend server required
- Data persists across sessions until you clear browser data

## Project Structure

```
sat-vocab-app/
├── app/
│   ├── page.tsx           # Home page with mode selection
│   └── quiz/
│       └── page.tsx       # Quiz session page
├── components/
│   ├── QuestionCard.tsx   # Question display with feedback
│   ├── QuizSession.tsx    # Main quiz logic
│   ├── QuizSetup.tsx      # Word count selection
│   └── ResultsSummary.tsx # Results screen
├── lib/
│   ├── questionGenerator.ts  # Question generation logic
│   └── storage.ts           # localStorage utilities
├── types/
│   └── index.ts          # TypeScript type definitions
└── data/
    └── words.json        # SAT vocabulary word bank (1,796 words)
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **localStorage API** - Client-side data persistence

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
