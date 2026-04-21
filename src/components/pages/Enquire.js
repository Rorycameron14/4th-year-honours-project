import React from 'react';
import '../../App.css';
import Footer from '../footer';

export default function Enquire() {
  return (
    <>
      <main className='info-page'>
        <div className='info-page__shell'>
          <section className='info-page__hero'>
            <div className='info-page__eyebrow'>Contact</div>
            <h1 className='info-page__title'>Enquire About the Project</h1>
            <p className='info-page__lead'>
              If you have questions about the dissertation project, the
              immersive lesson, or the study setup, you can get in touch using
              the email addresses below. Keeping contact simple through direct
              email is a sensible option here and avoids adding extra form
              handling or mail-delivery infrastructure to the site.
            </p>
          </section>

          <section className='info-page__contact'>
            <h2>Project contacts</h2>
            <p>
              Use these addresses for general questions, academic enquiries, or
              follow-up about the study.
            </p>

            <div className='info-page__contact-grid'>
              <div className='info-page__contact-card'>
                <p className='info-page__contact-label'>Student</p>
                <h3 className='info-page__contact-name'>Rory Cameron</h3>
                <a
                  className='info-page__contact-link'
                  href='mailto:u09rc22@abdn.ac.uk'
                >
                  u09rc22@abdn.ac.uk
                </a>
              </div>

              <div className='info-page__contact-card'>
                <p className='info-page__contact-label'>Supervisor</p>
                <h3 className='info-page__contact-name'>Dr N. Beacham</h3>
                <a
                  className='info-page__contact-link'
                  href='mailto:n.beacham@abdn.ac.uk'
                >
                  n.beacham@abdn.ac.uk
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
