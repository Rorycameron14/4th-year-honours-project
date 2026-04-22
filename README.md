# FOCUSED

FOCUSED is a fourth-year dissertation project investigating how background audio conditions affect learning performance and concentration in an immersive multi-touch environment, with particular relevance to neurodivergent learners, especially those with ADHD and dyslexia.

The application presents an interactive Ancient Egypt lesson with hotspot-based exploration, followed by a seven-question quiz. A GraphQL logging backend records session data, hotspot interactions, quiz answers, response times, and final scores for later analysis.

## Project Structure

```text
src/
  App.js
  index.js
  App.css
  components/
    LessonScene.js
    QuizSection.js
    graphql.js
    navbar.js
    footer.js
    Cards.js
    CardItem.js
    Herosection.js
    pages/
      Home.js
      About.js
      Lesson.js
      Quiz.js
      Enquire.js

server/
  index.js
  db.json
  package.json
```

## Main Features

- Three-panel immersive lesson scene based on Ancient Egypt
- Interactive hotspots with educational content and short facts
- Background audio conditions including silence, white noise, and themed audio
- Quiz-based evaluation of learning performance
- GraphQL logging for sessions, events, and answers
- CSV export routes for later analysis

## Technology Stack

- React
- React Router
- Express
- Apollo Server
- GraphQL
- JSON file storage

## Running the Project Locally

The project uses two parts:

1. the React frontend
2. the Express and Apollo GraphQL backend

### Frontend

From the project root:

```powershell
npm install
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

### Backend

From the `server` folder:

```powershell
cd server
npm install
npm start
```

The backend runs on:

```text
http://localhost:4000/graphql
```

## GraphQL URL Behaviour

The frontend logging helper in `src/components/graphql.js` switches automatically between local and deployed backends:

- on `localhost`, it uses `http://localhost:4000/graphql`
- on the deployed site, it uses the Render backend

This can also be overridden with:

```text
REACT_APP_GRAPHQL_URL
```

## Data Storage

The backend stores logged data in:

```text
server/db.json
```

This file contains three top-level collections:

- `sessions`
- `events`
- `answers`

It is used as a lightweight datastore for the dissertation prototype.

## Exporting Data

The backend exposes CSV export routes for analysis:

```text
http://localhost:4000/export/sessions.csv
http://localhost:4000/export/events.csv
http://localhost:4000/export/answers.csv
```

These files can be used for later inspection, filtering, and visualisation.

## Notes

- The lesson and quiz logic are implemented in dedicated components rather than being split into many smaller modules.
- The project is designed as a controlled educational prototype rather than a large production system.
- The homepage layout and some reusable UI patterns were adapted from tutorial-style React website builds and then rewritten around the dissertation project content.

## Dissertation Context

This project explores the following research focus:

How do different background audio conditions affect learning performance and concentration during an interactive task in an immersive multi-touch environment, particularly for neurodivergent learners?

The system was built to support both delivery of the learning activity and collection of structured performance and interaction data for later evaluation.
