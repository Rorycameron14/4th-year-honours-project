import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_FILE = path.join(__dirname, "db.json");
const RENDER_DB_FILE = "/var/data/db.json";

function resolveDbFile() {
  if (process.env.DB_FILE_PATH) {
    return process.env.DB_FILE_PATH;
  }

  if (process.env.DB_STORAGE_DIR) {
    return path.join(process.env.DB_STORAGE_DIR, "db.json");
  }

  return LOCAL_DB_FILE;
}

// db.json is the prototype's lightweight datastore for saved sessions, hotspot events, and quiz answers.
let DB_FILE = resolveDbFile();

async function ensureDbFile() {
  try {
    const dbDirectory = path.dirname(DB_FILE);
    await fs.mkdir(dbDirectory, { recursive: true });
    await fs.access(DB_FILE);
  } catch (error) {
    // On Render, /var/data only works when a persistent disk is actually mounted.
    if (
      process.env.RENDER &&
      !process.env.DB_FILE_PATH &&
      !process.env.DB_STORAGE_DIR &&
      DB_FILE === LOCAL_DB_FILE
    ) {
      try {
        DB_FILE = RENDER_DB_FILE;
        const renderDbDirectory = path.dirname(DB_FILE);
        await fs.mkdir(renderDbDirectory, { recursive: true });
        await fs.access(DB_FILE);
        return;
      } catch {
        DB_FILE = LOCAL_DB_FILE;
      }
    }

    try {
      const bundledDb = await fs.readFile(LOCAL_DB_FILE, "utf-8");
      await fs.writeFile(DB_FILE, bundledDb, "utf-8");
    } catch {
      const emptyDb = {
        _comment:
          "This file stores the prototype's logged session data, hotspot events, and quiz answers.",
        sessions: [],
        events: [],
        answers: [],
      };
      await fs.writeFile(DB_FILE, JSON.stringify(emptyDb, null, 2), "utf-8");
    }
  }
}

// Tiny file DB
async function readDB() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    // The prototype starts with empty collections if the file does not exist or cannot be read yet.
    return { sessions: [], events: [], answers: [] };
  }
}

async function writeDB(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

// CSV helper
function toCSV(rows) {
  if (!rows.length) return "";

  // CSV export is used for later analysis, so values are escaped rather than assuming plain text only.
  const headers = Object.keys(rows[0]);

  const escape = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];

  return lines.join("\n");
}

// GraphQL API references used while implementing the prototype backend:
// - GraphQL Foundation. (n.d.). GraphQL documentation. https://graphql.org/learn/
// - Apollo GraphQL. (n.d.). Apollo Server documentation. https://www.apollographql.com/docs/apollo-server/
// - Apollo GraphQL. (n.d.). Apollo Client documentation. https://www.apollographql.com/docs/react/
// - Meta Open Source. (n.d.). GraphQL: A query language for APIs. https://graphql.org/
// These sources informed the use of schemas, resolvers, mutations, and Apollo's Express middleware.
// Schema
const typeDefs = `#graphql
  type Query {
    health: String!
    sessions: [Session!]!
    events: [Event!]!
    answers: [Answer!]!
  }

  type Session {
    id: ID!
    participantCode: String!
    group: String!
    audioCondition: String!
    createdAt: String!
    endedAt: String
    score: Int
  }

  type Event {
    id: ID!
    sessionId: ID!
    sceneId: String!
    hotspotId: String!
    createdAt: String!
  }

  type Answer {
    id: ID!
    sessionId: ID!
    questionId: String!
    selectedIndex: Int!
    isCorrect: Boolean!
    responseTimeMs: Int!
    createdAt: String!
  }

  type Mutation {
    startSession(participantCode: String!, group: String!, audioCondition: String!): Session!
    updateSessionDetails(sessionId: ID!, participantCode: String!, group: String!, audioCondition: String!): Session!
    logHotspot(sessionId: ID!, sceneId: String!, hotspotId: String!): Event!
    submitAnswer(sessionId: ID!, questionId: String!, selectedIndex: Int!, isCorrect: Boolean!, responseTimeMs: Int!): Answer!
    endSession(sessionId: ID!, score: Int!, participantCode: String, group: String, audioCondition: String): Session!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    health: () => "ok",
    sessions: async () => {
      const db = await readDB();
      return db.sessions;
    },
    events: async () => {
      const db = await readDB();
      return db.events;
    },
    answers: async () => {
      const db = await readDB();
      return db.answers;
    },
  },

  Mutation: {
    startSession: async (_, { participantCode, group, audioCondition }) => {
      const db = await readDB();
      // A session is created before the quiz so lesson interactions can still be logged.
      const session = {
        id: randomUUID(),
        participantCode,
        group,
        audioCondition,
        createdAt: new Date().toISOString(),
        endedAt: null,
        score: null,
      };
      db.sessions.push(session);
      await writeDB(db);
      return session;
    },

    updateSessionDetails: async (
      _,
      { sessionId, participantCode, group, audioCondition }
    ) => {
      const db = await readDB();
      const session = db.sessions.find((s) => s.id === sessionId);
      if (!session) throw new Error("Session not found");

      // Participant details are updated later because they are confirmed on the quiz screen.
      session.participantCode = participantCode;
      session.group = group;
      session.audioCondition = audioCondition;

      await writeDB(db);
      return session;
    },

    logHotspot: async (_, { sessionId, sceneId, hotspotId }) => {
      const db = await readDB();
      const event = {
        id: randomUUID(),
        sessionId,
        sceneId,
        hotspotId,
        createdAt: new Date().toISOString(),
      };
      db.events.push(event);
      await writeDB(db);
      return event;
    },

    submitAnswer: async (
      _,
      { sessionId, questionId, selectedIndex, isCorrect, responseTimeMs }
    ) => {
      const db = await readDB();
      const answer = {
        id: randomUUID(),
        sessionId,
        questionId,
        selectedIndex,
        isCorrect,
        responseTimeMs,
        createdAt: new Date().toISOString(),
      };
      db.answers.push(answer);
      await writeDB(db);
      return answer;
    },

    endSession: async (
      _,
      { sessionId, score, participantCode, group, audioCondition }
    ) => {
      const db = await readDB();
      let session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        // If localStorage still points at a session after db.json has been reset, recreate the session row
        // so the already logged hotspot and quiz records remain linked by the same session ID.
        session = {
          id: sessionId,
          participantCode: participantCode || "recovered-participant",
          group: group || "recovered-group",
          audioCondition: audioCondition || "recovered-audio",
          createdAt: new Date().toISOString(),
          endedAt: null,
          score: null,
        };

        db.sessions.push(session);
      }

      session.score = score;
      session.endedAt = new Date().toISOString();

      await writeDB(db);
      return session;
    },
  },
};

// Start server
async function start() {
  await ensureDbFile();

  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("GraphQL server is running");
  });

  app.get("/export/sessions.csv", async (req, res) => {
    const db = await readDB();
    const csv = toCSV(db.sessions);
    res.header("Content-Type", "text/csv");
    res.attachment("sessions.csv");
    res.send(csv);
  });

  app.get("/export/events.csv", async (req, res) => {
    const db = await readDB();
    const csv = toCSV(db.events);
    res.header("Content-Type", "text/csv");
    res.attachment("events.csv");
    res.send(csv);
  });

  app.get("/export/answers.csv", async (req, res) => {
    const db = await readDB();
    const csv = toCSV(db.answers);
    res.header("Content-Type", "text/csv");
    res.attachment("answers.csv");
    res.send(csv);
  });

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  // GraphQL handles logging operations, while the plain routes above are kept for easy CSV export.
  app.use("/graphql", expressMiddleware(apollo));

  app.listen(PORT, () => {
    console.log(`GraphQL running on http://localhost:${PORT}/graphql`);
    console.log(`Using datastore at ${DB_FILE}`);
  });
}

start();
