import React from 'react';
import './App.css';

function Home() {
  return (
    <div>
      <h1>Welcosme to My Website</h1>
      <p>Thank you for visiting my website. Here, you can learn more about me and my work.</p>
      <p style={{color: 'white'}}>As little about me</p>
      <p>Hi, my name is [your name] and I am a [your profession/occupation]. In my free time, I enjoy [hobbies/interests].</p>
      <img src="/images/profile.jpg" alt="My Profile Picture" />
    </div>
  );
}

export default Home;
