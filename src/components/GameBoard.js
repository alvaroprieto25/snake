// src/components/GameBoard.js
import React from 'react';
import GameBoardImage from '../assets/game/background.jpg';

const GameBoard = ({ snakeDots, food }) => {
  return (
    <div className="game-board" style={{
      backgroundImage: `url(${GameBoardImage})`,
      backgroundSize: 'cover', // O 'contain' según tu preferencia
      backgroundPosition: 'center',
    }}>
      {snakeDots.map((dot, i) => {
        let style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        };

        // Identificar la cabeza (último bloque) y la cola (primer bloque)
        if (i === snakeDots.length - 1) {
          return <div className="snake-dot snake-head" key={i} style={style}></div>; // Cabeza
        } else if (i === 0) {
          return <div className="snake-dot snake-tail" key={i} style={style}></div>; // Cola
        } else {
          return <div className="snake-dot" key={i} style={style}></div>; // Bloques intermedios
        }
      })}

      <div className="snake-food" style={{ left: `${food[0]}%`, top: `${food[1]}%` }}></div>
    </div>
  );
};

export default GameBoard;
