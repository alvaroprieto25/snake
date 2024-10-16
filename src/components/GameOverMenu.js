// src/components/GameOverMenu.js
import React from 'react';

const GameOverMenu = ({ onRestart, win }) => {
  return (
    <div className="game-over-menu">
      <h2>{win ? 'Winner' : 'Game Over'}</h2>
      <button autoFocus className="restart-button" onClick={onRestart}>Reiniciar</button>
    </div>
  );
};

export default GameOverMenu;
