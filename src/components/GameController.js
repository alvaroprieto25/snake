// src/components/GameController.js
import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameOverMenu from './GameOverMenu';

const getRandomCoordinates = () => {
  const min = 5;
  const max = 80;
  
  let x = Math.floor(Math.random() * ((max - min) / 5 + 1)) * 5 + min;
  let y = Math.floor(Math.random() * ((max - min) / 5 + 1)) * 5 + min;
  
  return [x, y];
};



const GameController = () => {
  // Estados del juego
  const [snakeDots, setSnakeDots] = useState([[0, 0], [5, 0]]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [rocks, setRocks] =  useState([getRandomCoordinates()]);
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [pause, setPause] = useState(false);
  const [win, setWin] = useState(false);
  const [moveCompleted, setMoveCompleted] = useState(true);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(localStorage.getItem('record'));
  const [isRecord, setIsRecord] = useState(false);

  // Efecto para manejar el movimiento de la serpiente y comer
  useEffect(() => {
    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      // Movimiento de la cabeza de la serpiente basado en la dirección
      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 5, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 5, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 5];
          break;
        case 'UP':
          head = [head[0], head[1] - 5];
          break;
        default:
          break;
      }

      dots.push(head); // Añadimos la nueva cabeza
      dots.shift();    // Quitamos la cola
      setSnakeDots(dots);
      setMoveCompleted(true);
    };
    
    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getNextCoordinates());  // Nueva comida
        growSnake();                      // Crecer
      }
    };
    
    const growSnake = () => {
      let newSnake = [...snakeDots];
      newSnake.unshift([]); // Agregar un nuevo segmento a la serpiente
      if(newSnake.length % 5 === 0){
        if(level + 1 === 11){
          setWin(true);
        } else{
          if(speed > 30){
            setSpeed(speed - 10);
          }
          setLevel(level + 1);
          setScore(score+50);
          let newRocks = [...rocks];
          newRocks.push(getNextCoordinates());
          setRocks(newRocks);
        }
      }
      setSnakeDots(newSnake);
      setScore(score+5);
    };

    // Movimiento y comer solo si el juego no ha terminado
    if (!gameOver && !pause && !win) {
      const gameInterval = setInterval(() => {
        moveSnake();
        checkIfEat();
      }, speed);

      return () => clearInterval(gameInterval);
    }
  }, [snakeDots, direction, speed, food, gameOver, pause, moveCompleted]);

  // Detección de dirección con el teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if(!moveCompleted) return;

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

      setMoveCompleted(false);
    };

    const handlePause = (e) => {
      if(e.keyCode === 80){
        setPause(!pause);
      }
    }

    document.addEventListener('keydown', handlePause);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keydown', handlePause);
    };
  }, [direction, pause, moveCompleted]);

  // Detección de colisiones con los bordes y consigo misma
  useEffect(() => {
    const checkCollision = () => {
      let head = snakeDots[snakeDots.length - 1];

      // Fix malillo hay que cambiar la representacion de cada casilla

      // Si la cabeza toca el borde
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        setGameOver(true);
        if(score > record){
          setRecord(score);
          setIsRecord(true);
          localStorage.setItem('record', score);
        }
      }

      // Futura mejora mabstraer esto a otra funcion

      // Si la cabeza toca su propio cuerpo
      snakeDots.forEach((dot, index) => {
        if (index !== snakeDots.length - 1 && head[0] === dot[0] && head[1] === dot[1]) {
          setGameOver(true);
          if(score > record){
            setRecord(score);
            setIsRecord(true);
            localStorage.setItem('record', score);
          }
        }
      });

      // Miro si choca con alguna roca
      rocks.forEach((rock) => {
        if(head[0] === rock[0] && head[1] === rock[1]) {
          setGameOver(true);
          if(score > record){
            setRecord(score);
            setIsRecord(true);
            localStorage.setItem('record', score);
          }
        }
      });
    };

    checkCollision();
  }, [rocks, snakeDots]);

  const getNextCoordinates = () => {
  
    let isValid = false;
    let x, y;
  
    // Función para comprobar si las coordenadas están ocupadas
    const coordinatesOccupied = (x, y) => {
      // Comprueba si las coordenadas están en la serpiente, rocas o comida
      return (
        snakeDots.some(segment => segment[0] === x && segment[1] === y) ||
        rocks.some(rock => rock[0] === x && rock[1] === y) ||
        (food[0] === x && food[1] === y)
      );
    };
  
    // Genera nuevas coordenadas hasta que sean válidas
    while (!isValid) {
      [x, y] = getRandomCoordinates();
  
      // Verifica si las coordenadas no están ocupadas
      if (!coordinatesOccupied(x, y)) {
        isValid = true;
      }
    }
  
    return [x, y];
  };

  // Reiniciar el juego
  const restartGame = () => {
    setSnakeDots([[0, 0], [5, 0]]);
    setFood(getRandomCoordinates());
    setRocks([getRandomCoordinates()]);
    setDirection('RIGHT');
    setLevel(1);
    setSpeed(100);
    setGameOver(false);
    setPause(false);
    setWin(false);
    setScore(0);
    setIsRecord(false);
  };

  const shareScore = async () => {
    //copiar al portapapeles un mensaje
    try{
      await navigator.clipboard.writeText(`SNAKE GAME\nHas alcanzado el nivel: ${level}.\nTu puntuacion es de ${score}.\nSi tu tambien quieres juegar, hazlo ahora en:\nhttps://alvaroprieto25.github.io/snake`);
      alert('Mensaje copiado!');
    } catch(err) {
      console.error('Error al copiar al portapapeles.');
    }
  };

  return (
    <div>
      <h1>SNAKE GAME</h1>
      { !win && <h2>Level {level}</h2> }
      { !gameOver && <h3>Your Score</h3> }
      { !gameOver && <h3>{score}</h3> }
      { pause && <span>paused</span> }
      {gameOver || win ? (
        <GameOverMenu onRestart={restartGame} onShare={shareScore} win={win} isRecord={isRecord} score={score} />
      ) : (
        <GameBoard snakeDots={snakeDots} food={food} rocks={rocks} />
      )}
    </div>
  );
};

export default GameController;
