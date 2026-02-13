import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check Out Our Amazing Product!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-1.jpg'
              text='Experience the relaxing atmosphere'
              label='Relax'
              path='/services'
            />
            <CardItem
              src='images/img-2.jpg'
              text='Expand your knowledge with our learning resources'
              label='Learn'
              path='/Lesson'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Send us an enquiry and we will get back to you with the best options'
              label='Enquire'
              path='/Enquire'
            />
            <CardItem
              src='images/img-4.jpg'
              text='Take in the atmosphere of underwater life with an immersive experience'
              label='Adventure'
              path='/products'
            />
            <CardItem
              src='images/img-5.jpg'
              text='Experience life on the other planets in our solar system'
              label='Explore'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;