// src/components/GameController.js
import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameOverMenu from './GameOverMenu';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 99;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const GameController = () => {
  // Estados del juego
  const [snakeDots, setSnakeDots] = useState([[0, 0], [2, 0]]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [rocks, setRocks] =  useState([getRandomCoordinates()]);
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  // Efecto para manejar el movimiento de la serpiente y comer
  useEffect(() => {
    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      // Movimiento de la cabeza de la serpiente basado en la dirección
      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }

      dots.push(head); // Añadimos la nueva cabeza
      dots.shift();    // Quitamos la cola
      setSnakeDots(dots);
    };
    
    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomCoordinates());  // Nueva comida
        growSnake();                      // Crecer
      }
    };
    
    const growSnake = () => {
      let newSnake = [...snakeDots];
      newSnake.unshift([]); // Agregar un nuevo segmento a la serpiente
      if(newSnake.length % 5 === 0){
        setSpeed(speed - 10);
        setLevel(level + 1);
      }
      setSnakeDots(newSnake);
    };

    // Movimiento y comer solo si el juego no ha terminado
    if (!gameOver) {
      const gameInterval = setInterval(() => {
        moveSnake();
        checkIfEat();
      }, speed);

      return () => clearInterval(gameInterval);
    }
  }, [snakeDots, direction, speed, food, gameOver]);

  // Detección de dirección con el teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.keyCode) {
        case 38:
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 40:
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 37:
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 39:
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    const handleTouchStart = (e) => {
      const touchStartX = e.touches[0].clientX;
      const touchStartY = e.touches[0].clientY;

      const handleTouchMove = (e) => {
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Movimiento horizontal
          if (deltaX > 0 && direction !== 'LEFT') {
            setDirection('RIGHT');
          } else if (deltaX < 0 && direction !== 'RIGHT') {
            setDirection('LEFT');
          }
        } else {
          // Movimiento vertical
          if (deltaY > 0 && direction !== 'UP') {
            setDirection('DOWN');
          } else if (deltaY < 0 && direction !== 'DOWN') {
            setDirection('UP');
          }
        }

        // Remover el evento para evitar múltiples llamadas
        document.removeEventListener('touchmove', handleTouchMove);
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: true });
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [direction]);

  // Detección de colisiones con los bordes y consigo misma
  useEffect(() => {
    const checkCollision = () => {
      let head = snakeDots[snakeDots.length - 1];

      // Fix malillo hay que cambiar la representacion de cada casilla

      // Si la cabeza toca el borde
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        setGameOver(true);
      }

      // Futura mejora mabstraer esto a otra funcion

      // Si la cabeza toca su propio cuerpo
      snakeDots.forEach((dot, index) => {
        if (index !== snakeDots.length - 1 && head[0] === dot[0] && head[1] === dot[1]) {
          setGameOver(true);
        }
      });

      // Miro si choca con alguna roca
      rocks.forEach((dot, index) => {
        if(head[0] === dot[0] && head[1] === dot[1]) {
          setGameOver(true);
        }
      });
    };

    checkCollision();
  }, [rocks, snakeDots]);

  // Reiniciar el juego
  const restartGame = () => {
    setSnakeDots([[0, 0], [2, 0]]);
    setFood(getRandomCoordinates());
    setRocks([getRandomCoordinates()]);
    setDirection('RIGHT');
    setLevel(1);
    setSpeed(100);
    setGameOver(false);
  };

  return (
    <div>
      <h1>SNAKE GAME</h1>
      <h2>Level {level}</h2>
      {gameOver ? (
        <GameOverMenu onRestart={restartGame} />
      ) : (
        <GameBoard snakeDots={snakeDots} food={food} rocks={rocks} />
      )}
    </div>
  );
};

export default GameController;
