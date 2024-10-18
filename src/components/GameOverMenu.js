// src/components/GameOverMenu.js
import React from 'react';

const GameOverMenu = ({ onRestart, win, isRecord, score }) => {
  return (
    <div className="game-over-menu">
      <h2>{win ? 'Winner' : 'Game Over'}</h2>
      <h2>{ isRecord ? '¡Nuevo Record!' : 'Tu puntuacion ha sido'}</h2>
      <h2>{score}</h2>
      <button autoFocus className="restart-button" onClick={onRestart}>Reiniciar</button>
    </div>
  );
};

export default GameOverMenu;
