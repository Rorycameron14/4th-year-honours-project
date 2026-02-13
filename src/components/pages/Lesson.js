import React from 'react';

function Lesson() {
  return (
    <div className="immersive-layout">
      <div className="panel panel-left">
        <h2>Sections</h2>
        <ul>
          <li>Intro</li>
          <li>Scene 1</li>
          <li>Scene 2</li>
        </ul>
      </div>

      <div className="panel panel-center">
        <h2>Main Scene</h2>
        <p>This is where the main history content will go.</p>
      </div>

      <div className="panel panel-right">
        <h2>Did you know?</h2>
        <p>Fun facts, extra info, or progress will go here.</p>
      </div>
    </div>
  );
}

export default Lesson;
