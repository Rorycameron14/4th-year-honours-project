function normaliseGraphqlUrl(rawUrl) {
  if (!rawUrl) return rawUrl;

  return rawUrl.endsWith('/graphql') ? rawUrl : `${rawUrl}/graphql`;
}

const GRAPHQL_URL = normaliseGraphqlUrl(
  process.env.REACT_APP_GRAPHQL_URL ||
    (window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : 'https://graphqlserver-nkjy.onrender.com')
);

// All lesson and quiz logging goes through one helper so the request shape stays consistent.
async function gqlRequest(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  let json;

  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `GraphQL endpoint returned non-JSON response (${res.status}). Check that the deployed URL points to /graphql.`
    );
  }

  if (json.errors) {
    console.error(json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL request failed');
  }

  return json.data;
}

export async function startSession(participantCode, group, audioCondition) {
  const query = `
    mutation StartSession($participantCode: String!, $group: String!, $audioCondition: String!) {
      startSession(participantCode: $participantCode, group: $group, audioCondition: $audioCondition) {
        id
        participantCode
        group
        audioCondition
        createdAt
      }
    }
  `;

  const data = await gqlRequest(query, {
    participantCode,
    group,
    audioCondition,
  });

  return data.startSession;
}

export async function logHotspot(sessionId, sceneId, hotspotId) {
  const query = `
    mutation LogHotspot($sessionId: ID!, $sceneId: String!, $hotspotId: String!) {
      logHotspot(sessionId: $sessionId, sceneId: $sceneId, hotspotId: $hotspotId) {
        id
        sessionId
        sceneId
        hotspotId
        createdAt
      }
    }
  `;

  const data = await gqlRequest(query, {
    sessionId,
    sceneId,
    hotspotId,
  });

  return data.logHotspot;
}

// Each quiz answer is logged separately so response time and correctness can be analysed later.
export async function submitAnswer(sessionId, questionId, selectedIndex, isCorrect, responseTimeMs) {
  const query = `
    mutation SubmitAnswer(
      $sessionId: ID!,
      $questionId: String!,
      $selectedIndex: Int!,
      $isCorrect: Boolean!,
      $responseTimeMs: Int!
    ) {
      submitAnswer(
        sessionId: $sessionId,
        questionId: $questionId,
        selectedIndex: $selectedIndex,
        isCorrect: $isCorrect,
        responseTimeMs: $responseTimeMs
      ) {
        id
        questionId
        selectedIndex
        isCorrect
        responseTimeMs
        createdAt
      }
    }
  `;

  const data = await gqlRequest(query, {
    sessionId,
    questionId,
    selectedIndex,
    isCorrect,
    responseTimeMs,
  });

  return data.submitAnswer;
}

export async function endSession(sessionId, score) {
  const query = `
    mutation EndSession($sessionId: ID!, $score: Int!) {
      endSession(sessionId: $sessionId, score: $score) {
        id
        score
        endedAt
      }
    }
  `;

  const data = await gqlRequest(query, {
    sessionId,
    score,
  });

  return data.endSession;
}

export async function checkHealth() {
  const query = `
    query Health {
      health
    }
  `;

  const data = await gqlRequest(query);
  return data.health;
}

// Participant details are completed on the quiz page because the lesson can begin before those fields are entered.
export async function updateSessionDetails(sessionId, participantCode, group, audioCondition) {
  const query = `
    mutation UpdateSessionDetails(
      $sessionId: ID!,
      $participantCode: String!,
      $group: String!,
      $audioCondition: String!
    ) {
      updateSessionDetails(
        sessionId: $sessionId,
        participantCode: $participantCode,
        group: $group,
        audioCondition: $audioCondition
      ) {
        id
        participantCode
        group
        audioCondition
      }
    }
  `;

  const data = await gqlRequest(query, {
    sessionId,
    participantCode,
    group,
    audioCondition,
  });

  return data.updateSessionDetails;
}
