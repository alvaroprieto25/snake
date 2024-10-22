// src/components/GameBoard.js
import React from 'react';
import GameBoardImage from '../assets/game/background.jpg';
import useDeviceType from '../utils/Device';

const GameBoard = ({ snakeDots, food, rocks }) => {
  const isMobile = useDeviceType();
  return (
    <div className={isMobile ? 'game-board-mobile' : 'game-board'} style={{
      backgroundImage: `url(${GameBoardImage})`,
      backgroundSize: 'cover',
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

      {rocks.map((dot, i) => 
        <div className="rocks" style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }}></div>
      )}
    </div>
  );
};

export default GameBoard;
