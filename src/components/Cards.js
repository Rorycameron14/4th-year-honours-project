import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Explore the Learning Experience</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-1.jpg'
              text='Read more about the immersive environment, audio conditions, and the purpose of the project.'
              label='Relax'
              path='/about'
            />
            <CardItem
              src='images/img-2.jpg'
              text='Start the Ancient Egypt lesson and explore the interactive three-panel immersive scene.'
              label='Lesson'
              path='/lesson'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='See how the quiz, learning task, and participant journey support the dissertation evaluation.'
              label='Study'
              path='/about'
            />
            <CardItem
              src='images/img-4.jpg'
              text='Learn more about how the immersive setup is intended to support concentration and engagement.'
              label='Adventure'
              path='/about'
            />
            <CardItem
              src='images/img-5.jpg'
              text='Explore the wider project aims, research context, and how the site fits the experiment.'
              label='Explore'
              path='/about'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
