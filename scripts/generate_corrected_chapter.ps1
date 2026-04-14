$OutputPath = 'C:\Users\roryt\Downloads\Chapter4_Revised_Highlighted_Corrected.docx'

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$selection = $word.Selection

function Add-Paragraph {
    param(
        [string]$Text,
        [string]$Style = 'Normal',
        [string]$FontName = 'Calibri',
        [int]$FontSize = 11,
        [int]$Bold = 0
    )

    $selection.Style = $doc.Styles.Item($Style)
    $selection.Font.Name = $FontName
    $selection.Font.Size = $FontSize
    $selection.Font.Bold = $Bold
    $selection.TypeText($Text)
    $selection.TypeParagraph()
}

function Add-CodeBlock {
    param([string]$Text)

    $selection.Style = $doc.Styles.Item('No Spacing')
    $selection.Font.Name = 'Consolas'
    $selection.Font.Size = 9
    $selection.Font.Bold = 0
    $selection.ParagraphFormat.SpaceAfter = 6
    $selection.ParagraphFormat.LeftIndent = 18
    $selection.TypeText($Text)
    $selection.TypeParagraph()
}

Add-Paragraph '4 Implementation' 'Heading 1' 'Calibri' 16 1
Add-Paragraph 'This chapter explains how the dissertation prototype was implemented as an immersive web-based learning application. The implementation had to support lesson delivery across a three-panel layout, hotspot interaction, background audio playback, a follow-on quiz, and GraphQL-based logging of participant activity for later analysis. Rather than describing a generic template architecture, this chapter reflects the actual codebase used in the project, including the real frontend files, backend schema, and JSON-based storage model.'

Add-Paragraph '4.1 Application Structure' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'The application uses React on the frontend and an Express plus Apollo Server backend for data logging. Routing is handled in src/App.js, which mounts the main site pages for Home, About, Lesson, Enquire, and Quiz. The lesson and quiz logic are implemented in dedicated components rather than being split into many small feature modules. This keeps the prototype relatively easy to understand and maintain for dissertation purposes.'
Add-Paragraph 'The actual project structure relevant to the implementation chapter is shown below:'
Add-CodeBlock @'
src/
├── App.js
├── index.js
├── App.css
└── components/
    ├── LessonScene.js
    ├── LessonScene.css
    ├── QuizSection.js
    ├── QuizSection.css
    ├── graphql.js
    ├── navbar.js
    ├── footer.js
    ├── Cards.js
    ├── CardItem.js
    ├── Herosection.js
    └── pages/
        ├── Home.js
        ├── About.js
        ├── Lesson.js
        ├── Quiz.js
        └── Enquire.js

server/
├── index.js
├── db.json
└── package.json
'@
Add-Paragraph 'This structure is simpler than a large production system, but it is suitable for a controlled educational prototype. The lesson content, quiz logic, and GraphQL logging are separated into their own files, while the server handles persistence and export functionality.'

Add-Paragraph '4.2 Lesson Scene and Hotspots' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'The immersive lesson is implemented in src/components/LessonScene.js. Rather than using a carousel and separate hotspot component files, the lesson is defined directly inside a single React component using a walls array. Each entry represents one section of the immersive display: the left wall focuses on the Giza pyramids, the centre wall focuses on the River Nile, and the right wall focuses on temples and gods. Each wall contains an image and a set of hotspots with coordinates, a title, explanatory text, and a short fact.'
Add-CodeBlock @'
const walls = [
  {
    id: 'left',
    name: 'Giza Pyramids',
    image: '/images/egypt-panorama.jpg',
    hotspots: [
      {
        id: 'sphinx',
        x: 22,
        y: 60,
        title: 'The Great Sphinx',
        text: 'The Sphinx has the body of a lion and the head of a person.',
        funFact: 'The face may represent a pharaoh, but no one is completely sure which one.',
      },
      // additional hotspots omitted here for brevity
    ],
  },
  // centre and right wall definitions follow the same pattern
];
'@
Add-Paragraph 'Hotspots are rendered by mapping over each wall and then mapping over the hotspot definitions inside that wall. The implementation uses absolutely positioned buttons so that the hotspot markers can sit on top of the background imagery. When a hotspot is selected, the active hotspot state is updated and a popup is displayed at the same coordinate position.'
Add-CodeBlock @'
{wall.hotspots.map((hotspot) => (
  <button
    key={hotspot.id}
    type="button"
    className={
      'hotspot' +
      (active?.wallId === wall.id && active?.hotspot?.id === hotspot.id
        ? ' hotspot--active'
        : '')
    }
    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    onPointerDown={async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setActive({ wallId: wall.id, hotspot });

      const currentSessionId = sessionId || localStorage.getItem('sessionId');
      if (currentSessionId) {
        await logHotspot(currentSessionId, wall.id, hotspot.id);
      }
    }}
  >
    <div className="hotspot-dot" />
  </button>
))}
'@
Add-Paragraph 'This design keeps the lesson data close to the component that renders it. For a prototype of this scale, this approach is easier to maintain than introducing extra data-loading layers. It also supports the immersive room design because all three panels can be rendered simultaneously in a single layout rather than forcing the participant to move through one scene at a time.'

Add-Paragraph '4.3 Audio Condition Management' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'Audio playback is also managed inside LessonScene.js. At the beginning of the lesson, the participant chooses one of three sound conditions: silence, white noise, or an Egyptian-themed track. The selected condition is stored in component state and also written to localStorage so that it remains associated with the lesson session. The current implementation uses an audio element referenced with useRef, rather than a separate AudioManager component.'
Add-CodeBlock @'
const SOUND_OPTIONS = {
  silence: '',
  white: '/audio/White_noise.mp3',
  egyptian: '/audio/Egyptian_track.mp3',
};

useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  if (!hasStarted || selectedSound === 'silence') {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    return;
  }

  audio.pause();
  audio.src = SOUND_OPTIONS[selectedSound];
  audio.loop = true;
  audio.volume = 0.35;
  audio.load();
  audio.play().catch((err) => {
    console.log('Audio playback blocked:', err);
  });
}, [selectedSound, hasStarted]);
'@
Add-Paragraph 'This approach keeps the audio condition tightly linked to the lesson session. The lesson content itself remains unchanged across conditions, while the selected sound track is the variable being manipulated. That matches the aims of the dissertation, where the educational material should remain stable while the auditory background changes.'

Add-Paragraph '4.4 Quiz Component' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'The quiz is implemented in src/components/QuizSection.js. The questions are not stored in an external JSON file; instead, they are defined directly in a QUESTIONS array at the top of the component file. Each question object contains a string identifier, the question text, four answer options, and the correctIndex used to determine scoring.'
Add-CodeBlock @'
const QUESTIONS = [
  {
    id: "q1_nile_civilisation",
    question:
      "Which explanation best shows why the River Nile was central to the development of Ancient Egyptian civilisation?",
    options: [
      "It prevented any form of drought or food shortage from taking place",
      "It supplied all the stone needed to build pyramids and temples",
      "It created fertile land, supported agriculture, and acted as a major transport route",
      "It provided a natural barrier that completely isolated Egypt from all outside influence",
    ],
    correctIndex: 2,
  },
  // six further questions follow
];
'@
Add-Paragraph 'The quiz flow uses local component state to track the current question index, the selected answer, the participant score, whether the session has finished, and whether a submission is currently being sent to the backend. Before the quiz begins, the participant is prompted to enter or confirm a participant code, group, and audio condition. These details are then written back to the current session using the updateSessionDetails mutation.'
Add-CodeBlock @'
const handleNext = async () => {
  if (isSubmitting) {
    return;
  }

  if (!sessionId) {
    setError("No active session found. Please start the lesson first.");
    return;
  }

  if (selected === null) {
    setError("Please select an answer before continuing.");
    return;
  }

  try {
    setIsSubmitting(true);

    const responseTimeMs = Date.now() - startedAtRef.current;
    const isCorrect = selected === current.correctIndex;
    const newScore = score + (isCorrect ? 1 : 0);

    await submitAnswer(sessionId, current.id, selected, isCorrect, responseTimeMs);

    if (index === QUESTIONS.length - 1) {
      await endSession(sessionId, newScore);
      setFinished(true);
      return;
    }

    setIndex(index + 1);
  } finally {
    setIsSubmitting(false);
  }
};
'@
Add-Paragraph 'The quiz therefore serves two roles within the dissertation system. First, it provides the learning-performance measure used in the evaluation. Second, it acts as the stage at which participant metadata is finalised and written back to the session before completion.'

Add-Paragraph '4.5 GraphQL Logging Pipeline' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'Logging is implemented using a GraphQL API provided by the backend in server/index.js and consumed by helper functions in src/components/graphql.js. The backend uses Apollo Server with Express middleware. The GraphQL schema defines session, event, and answer types, along with the mutations required to start a session, update participant metadata, log hotspot interactions, submit quiz answers, and end a session.'
Add-CodeBlock @'
type Mutation {
  startSession(participantCode: String!, group: String!, audioCondition: String!): Session!
  updateSessionDetails(sessionId: ID!, participantCode: String!, group: String!, audioCondition: String!): Session!
  logHotspot(sessionId: ID!, sceneId: String!, hotspotId: String!): Event!
  submitAnswer(sessionId: ID!, questionId: String!, selectedIndex: Int!, isCorrect: Boolean!, responseTimeMs: Int!): Answer!
  endSession(sessionId: ID!, score: Int!): Session!
}
'@
Add-Paragraph 'On the frontend, the lesson and quiz components do not call Apollo hooks directly. Instead, they import explicit asynchronous functions from src/components/graphql.js. Those functions send POST requests to the GraphQL endpoint using fetch and return the resulting data object. This is an important implementation detail because the project includes an ApolloProvider in src/index.js, but the logging operations used by the lesson and quiz are implemented manually through helper functions.'
Add-CodeBlock @'
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
'@
Add-Paragraph 'This pipeline allows the system to log multiple categories of behaviour. A session begins when the lesson starts, hotspot interactions are recorded during lesson exploration, each quiz answer is saved with a correctness flag and response time, and the session is closed with a final score when the participant finishes the quiz.'

Add-Paragraph '4.6 Data Storage and Export' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'The backend persists data to a lightweight JSON file rather than a relational database. The file is located at server/db.json and is read and written using the Node.js fs/promises API. The stored structure is not a single session object containing nested answers. Instead, the file contains three top-level arrays: sessions, events, and answers. This design mirrors the GraphQL types used by the backend and makes it straightforward to export each dataset separately.'
Add-CodeBlock @'
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
'@
Add-Paragraph 'A representative example of the stored structure is shown below:'
Add-CodeBlock @'
{
  "sessions": [
    {
      "id": "f6484e8b-aea2-4046-92aa-32c2dcd71122",
      "participantCode": "1",
      "group": "ADHD",
      "audioCondition": "white",
      "createdAt": "2026-04-12T16:02:47.471Z",
      "endedAt": "2026-04-12T16:03:18.995Z",
      "score": 3
    }
  ],
  "events": [
    {
      "id": "52e8933e-145b-463d-b0dc-92c140800306",
      "sessionId": "f6484e8b-aea2-4046-92aa-32c2dcd71122",
      "sceneId": "left",
      "hotspotId": "desert-edge",
      "createdAt": "2026-04-12T16:02:48.936Z"
    }
  ],
  "answers": [
    {
      "id": "30605982-42b0-4f2e-a75b-964779af806a",
      "sessionId": "f6484e8b-aea2-4046-92aa-32c2dcd71122",
      "questionId": "q1_nile_civilisation",
      "selectedIndex": 0,
      "isCorrect": false,
      "responseTimeMs": 8349,
      "createdAt": "2026-04-12T16:03:09.447Z"
    }
  ]
}
'@
Add-Paragraph 'To support later analysis, the backend also exposes CSV export routes. These are implemented as ordinary Express GET endpoints and return sessions, events, or answers as downloadable files. This export step is particularly useful for dissertation evaluation because the resulting CSV files can be imported into tools such as Tableau for filtering and comparison by participant group, audio condition, and performance outcome.'
Add-CodeBlock @'
app.get("/export/sessions.csv", async (req, res) => {
  const db = await readDB();
  const csv = toCSV(db.sessions);
  res.header("Content-Type", "text/csv");
  res.attachment("sessions.csv");
  res.send(csv);
});
'@

Add-Paragraph '4.7 Summary' 'Heading 2' 'Calibri' 13 1
Add-Paragraph 'The implemented system combines an immersive three-panel lesson, selectable audio conditions, interactive hotspots, a seven-question quiz, and a GraphQL logging backend. The implementation is intentionally lightweight, using React for the interface, Express and Apollo Server for the API, and JSON-based persistence for prototype data capture. This combination is appropriate for a dissertation prototype because it keeps the architecture understandable while still supporting the key experimental requirements: controlled audio conditions, stable lesson delivery, measurable quiz performance, and exportable session data for later analysis.'

$doc.SaveAs([ref]$OutputPath)
$doc.Close()
$word.Quit()

Write-Output $OutputPath
