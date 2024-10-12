// src/components/GameOverMenu.js
import React from 'react';

const GameOverMenu = ({ onRestart }) => {
  return (
    <div className="game-over-menu">
      <h2>Game Over</h2>
      <button onClick={onRestart}>Reiniciar</button>
    </div>
  );
};

export default GameOverMenu;
