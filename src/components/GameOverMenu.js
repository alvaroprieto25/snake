// src/components/GameOverMenu.js
import React from 'react';

const GameOverMenu = ({ onRestart, onShare, win, isRecord, score }) => {
  return (
    <div className="game-over-menu">
      <h2>{win ? 'Winner' : 'Game Over'}</h2>
      <h2>{ isRecord ? '¡Nuevo Record!' : 'Tu puntuacion ha sido'}</h2>
      <h2>{score}</h2>
      <button className="share-button" onClick={onShare}>Compartir</button>
      <button autoFocus className="restart-button" onClick={onRestart}>Reiniciar</button>
    </div>
  );
};

export default GameOverMenu;
