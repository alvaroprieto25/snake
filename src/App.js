// src/App.js
import React from 'react';
import './App.css';
import GameController from './components/GameController';
import backgroundImage from './assets/ui/background.jpg';

function App() {
  return (
    <div className="App" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', // O 'contain' según tu preferencia
      height: '100vh', // Asegúrate de que ocupe toda la altura
      backgroundPosition: 'center',
    }}>
      <GameController />
    </div>
  );
}

export default App;
