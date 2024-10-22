// src/App.js
import React from 'react';
import './App.css';
import GameController from './components/GameController';
import backgroundImage from './assets/ui/background.jpg';
import useDeviceType from './utils/Device';

function App() {
  const isMobile = useDeviceType();

  return (
    <div className={isMobile ? 'App-mobile' : 'App'} style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      height: '100vh', // Asegúrate de que ocupe toda la altura
      backgroundPosition: 'center',
    }}>
    <GameController />
    {/* {isMobile ? <div><h1>Coming Soon</h1><h2>Mobile Version</h2></div> : <GameController />} */}
    </div>
  );
}

export default App;
