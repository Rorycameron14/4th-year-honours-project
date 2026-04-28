import React from 'react';
import '../../App.css';
import Footer from '../footer';

export default function About() {
  return (
    <>
      <main className='info-page'>
        <div className='info-page__shell'>
          <section className='info-page__hero'>
            <div className='info-page__eyebrow'>Project Overview</div>
            <h1 className='info-page__title'>About FOCUSED</h1>
            <p className='info-page__lead'>
              FOCUSED is a fourth-year dissertation project investigating how
              different background audio conditions affect learning performance
              and concentration in an immersive multi-touch environment, with a
              particular interest in neurodivergent learners, especially those
              with ADHD and dyslexia. The application delivers an interactive
              Ancient Egypt lesson followed by a quiz, while the lesson content
              remains consistent across all audio conditions.
            </p>
          </section>

          <div className='info-page__grid'>
            <section className='info-page__card'>
              <h2>Research background</h2>
              <p>
                Immersive learning spaces are increasingly used in schools and
                higher education because they can create more engaging,
                multisensory learning experiences than standard desktop or
                classroom setups. At the same time, research on background audio
                shows mixed results: some sounds may support attention and
                memory, while others may interfere with comprehension and
                cognitive performance.
              </p>
            </section>

            <section className='info-page__card'>
              <h2>Why this study matters</h2>
              <p>
                Much of the existing evidence on audio and learning comes from
                conventional settings such as laptops, headphones, and standard
                classrooms, and often focuses on neurotypical participants. This
                project looks at that question in an immersive room environment
                instead, where learners interact with large displays, touch
                input, and room-based audio.
              </p>
            </section>

            <section className='info-page__card'>
              <h2>Research focus</h2>
              <p>
                The core research question asks how different background audio
                conditions, including silence, white noise, and ambient thematic
                audio, affect learning performance and concentration for
                neurodivergent learners during an interactive task in an
                immersive multi-touch environment. The work is grounded in
                human-computer interaction and inclusive educational technology.
              </p>
            </section>

            <section className='info-page__card'>
              <h2>How the application supports the dissertation</h2>
              <ul className='info-page__list'>
                <li>Interactive three-panel lesson scene designed for the immersive studio</li>
                <li>Three controlled audio conditions: silence, white noise, and themed ambient audio</li>
                <li>Hotspot-based exploration so participants actively engage with lesson content</li>
                <li>Seven-question quiz to capture measurable learning performance</li>
                <li>GraphQL logging pipeline for recording interaction events, answers, and scores</li>
                <li>Exportable data for later analysis and visualisation</li>
              </ul>
            </section>

            <section className='info-page__card info-page__card--wide'>
              <h2>Study data</h2>
              <p>
                The application records participant sessions, hotspot
                interactions, quiz responses, response times, audio conditions,
                and final scores. The combined dataset is available as an Excel
                spreadsheet to support analysis of how background audio affected
                learning performance and concentration during the interactive
                lesson.
              </p>
              <a
                className='info-page__download'
                href='/data/combined_data.xlsx'
                download
              >
                Download combined study data
              </a>
            </section>

            <section className='info-page__card info-page__card--wide'>
              <h2>Immersive room footage</h2>
              <p>
                These short clips show the physical immersive room environment
                used to deliver the learning activity. They provide context for
                the multi-display setup, room-scale presentation, and
                interaction space discussed in the dissertation.
              </p>
              <div className='info-page__video-grid'>
                <figure className='info-page__video-item'>
                  <video controls preload='metadata'>
                    <source src='/videos/immersive-room-1.mp4' type='video/mp4' />
                    Your browser does not support this video.
                  </video>
                  <figcaption>Immersive room setup view 1</figcaption>
                </figure>
                <figure className='info-page__video-item'>
                  <video controls preload='metadata'>
                    <source src='/videos/immersive-room-2.mp4' type='video/mp4' />
                    Your browser does not support this video.
                  </video>
                  <figcaption>Immersive room setup view 2</figcaption>
                </figure>
                <figure className='info-page__video-item'>
                  <video controls preload='metadata'>
                    <source src='/videos/immersive-room-3.mp4' type='video/mp4' />
                    Your browser does not support this video.
                  </video>
                  <figcaption>Immersive room setup view 3</figcaption>
                </figure>
              </div>
            </section>

            <section className='info-page__card'>
              <h2>Project objectives</h2>
              <ul className='info-page__list'>
                <li>Design and develop an immersive multi-touch learning task that can be delivered under different audio conditions</li>
                <li>Implement a quiz-based evaluation that captures participant performance and responses</li>
                <li>Compare the effects of different audio conditions on learning performance and concentration</li>
                <li>Identify design implications for inclusive immersive educational technology, particularly for learners with ADHD and dyslexia</li>
              </ul>
            </section>

            <section className='info-page__card'>
              <h2>Why Ancient Egypt was chosen</h2>
              <p>
                Ancient Egypt offers strong visual material, recognisable
                cultural references, and factual content that works well in an
                immersive display environment. Using one stable topic helps keep
                the educational material consistent across conditions, which is
                important when the study is specifically testing the effect of
                background audio rather than changing the lesson itself.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
