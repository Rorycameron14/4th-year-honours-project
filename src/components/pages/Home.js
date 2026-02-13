import React from 'react';
import '../../App.css';
import Cards from '../Cards';
import HeroSection from '../Herosection';
import Footer from '../footer';

function Home() {
  return (
    <>
      <HeroSection />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;