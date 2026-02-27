import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const PORT = process.env.PORT || 4000;
const DB_FILE = new URL("./db.json", import.meta.url);

// ---- tiny file DB ----
async function readDB() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { sessions: [], events: [], answers: [] };
  }
}

async function writeDB(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

// ---- schema ----
const typeDefs = `#graphql
  type Query {
    health: String!
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
    logHotspot(sessionId: ID!, sceneId: String!, hotspotId: String!): Event!
    submitAnswer(sessionId: ID!, questionId: String!, selectedIndex: Int!, isCorrect: Boolean!, responseTimeMs: Int!): Answer!
    endSession(sessionId: ID!, score: Int!): Session!
  }
`;

// ---- resolvers ----
const resolvers = {
  Query: {
    health: () => "ok",
  },
  Mutation: {
    startSession: async (_, { participantCode, group, audioCondition }) => {
      const db = await readDB();
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

    submitAnswer: async (_, { sessionId, questionId, selectedIndex, isCorrect, responseTimeMs }) => {
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

    endSession: async (_, { sessionId, score }) => {
      const db = await readDB();
      const session = db.sessions.find((s) => s.id === sessionId);
      if (!session) throw new Error("Session not found");
      session.score = score;
      session.endedAt = new Date().toISOString();
      await writeDB(db);
      return session;
    },
  },
};

// ---- start server ----
async function start() {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use("/graphql", expressMiddleware(apollo));

  app.listen(PORT, () => {
    console.log(`GraphQL running on http://localhost:${PORT}/graphql`);
  });
}

start();