const player = document.getElementById('player');
let isImage1 = true; // Variable para alternar entre las imágenes
let lives = 3; // Vidas del jugador
let score = 0; // Puntuación del jugador
let speed = 2; // Velocidad inicial
let gameInterval; // Intervalo para aumentar la velocidad
let obstacleInterval = 1000; // Intervalo de aparición inicial de obstáculos
let obstacleCreationLoop; // Intervalo para la creación de obstáculos
let gameLoops = []; // Array para almacenar los intervalos del juego

// Variables para controlar el movimiento del jugador en dispositivos móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('mousemove', movePlayer);
document.addEventListener('touchstart', touchStart);
document.addEventListener('touchend', touchEnd);

function touchStart(event) {
    touchStartX = event.changedTouches[0].clientX;
}

function touchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    movePlayer();
}

function movePlayer(event) {
    let x;
    if (event && event.clientX) {
        // Si el evento tiene coordenadas de clic (para dispositivos de escritorio)
        x = event.clientX;
    } else if (event && event.changedTouches) {
        // Si el evento es un evento táctil (para dispositivos móviles)
        x = event.changedTouches[0].clientX;
    }
    if (x !== undefined) {
        player.style.left = `${x}px`;
    }
}


// Cambiar la imagen cada 500 milisegundos
setInterval(() => {
    if (isImage1) {
        player.src = 'img/axolotl1.png';
    } else {
        player.src = 'img/axolotl21.png';
    }
    isImage1 = !isImage1; // Cambiamos el estado de la variable para la próxima vez
}, 500);

const gameArea = document.querySelector('.game-area');

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    // Posición aleatoria en el eje X
    obstacle.style.left = `${Math.random() * 95}%`;
    
    // Posición aleatoria arriba o abajo del área de juego
    obstacle.style.top = `${Math.random() < 0.5 ? -Math.random() * 200 : window.innerHeight + Math.random() * 200}px`;
    
    // Rotación aleatoria
    obstacle.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Alternar entre dos imágenes diferentes para los obstáculos
    if (Math.random() < 0.5) {
        obstacle.style.backgroundImage = 'url("img/basura1.png")';
    } else {
        obstacle.style.backgroundImage = 'url("img/basura21.png")';
    }
    
    obstacle.style.backgroundSize = 'contain';
    obstacle.style.backgroundRepeat = 'no-repeat';
    obstacle.style.width = '7vh'; // Cambiado a unidades vh
    obstacle.style.height = '7vh'; // Cambiado a unidades vh
    
    gameArea.appendChild(obstacle);
}

function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        let top = parseFloat(getComputedStyle(obstacle).top);
        if (top >= window.innerHeight) {
            obstacle.remove();
        } else {
            obstacle.style.top = `${top + speed}px`; // Usamos la variable de velocidad
        }
    });
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        const bugRect = bug.getBoundingClientRect();
        if (
            playerRect.left < bugRect.left + bugRect.width &&
            playerRect.left + playerRect.width > bugRect.left &&
            playerRect.top < bugRect.top + bugRect.height &&
            playerRect.height + playerRect.top > bugRect.top
        ) {
            bug.remove();
            increaseScore();
        }
    });

    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            playerRect.left < obstacleRect.left + obstacleRect.width &&
            playerRect.left + playerRect.width > obstacleRect.left &&
            playerRect.top < obstacleRect.top + obstacleRect.height &&
            playerRect.height + playerRect.top > obstacleRect.top
        ) {
            obstacle.remove();
            loseLife();
        }
    });
}

function loseLife() {
    lives--;
    updateLivesCounter(); // Actualizar el contador de vidas
    if (lives <= 0) {
        endGame();
        showGameOverPopup();
    }
}

function resetGame() {
    lives = 3;
    score = 0;
    speed = 2; // Reiniciar la velocidad
    obstacleInterval = 1000; // Reiniciar el intervalo de aparición de obstáculos
    updateLivesCounter();
    updateScoreCounter();
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
    document.querySelectorAll('.bug').forEach(bug => bug.remove());
    clearInterval(gameInterval); // Detener el aumento de la velocidad
    clearInterval(obstacleCreationLoop); // Detener la creación de obstáculos
    clearGameLoops();
    startSpeedIncrease(); // Reiniciar el aumento de la velocidad
    startObstacleCreation(); // Reiniciar la creación de obstáculos
    console.log('Game reset');
}

const livesCounter = document.getElementById('lives-counter');

// Función para actualizar el contador de vidas
function updateLivesCounter() {
    livesCounter.textContent = `Vidas: ${lives}`;
}

// Llamar a la función para inicializar el contador de vidas
updateLivesCounter();

function createBug() {
    const bug = document.createElement('div');
    bug.classList.add('bug');
    bug.style.left = `${Math.random() * 95}%`;
    bug.style.top = `${Math.random() < 0.5 ? -Math.random() * 200 : window.innerHeight + Math.random() * 200}px`;
    bug.style.transform = `rotate(${Math.random() * 360}deg)`;
    bug.style.backgroundImage = 'url("img/bicho1.png")';
    bug.style.backgroundSize = 'contain';
    bug.style.backgroundRepeat = 'no-repeat';
    bug.style.width = '8vh'; // Cambiado a unidades vh
    bug.style.height = '8vh'; // Cambiado a unidades vh
    gameArea.appendChild(bug);
}

function moveBugs() {
    const bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        let top = parseFloat(getComputedStyle(bug).top);
        if (top >= window.innerHeight) {
            bug.remove();
        } else {
            bug.style.top = `${top + speed}px`; // Usamos la variable de velocidad
        }
    });
}

// Función para alternar las imágenes de los bichos
function animateBugs() {
    const bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        if (bug.style.backgroundImage.includes('bicho1.png')) {
            bug.style.backgroundImage = 'url("img/bicho21.png")';
        } else {
            bug.style.backgroundImage = 'url("img/bicho1.png")';
        }
    });
}

const scoreCounter = document.getElementById('score-counter');

function updateScoreCounter() {
    scoreCounter.textContent = `Puntos: ${score}`;
}

function increaseScore() {
    score += 10;
    updateScoreCounter();
}

function startSpeedIncrease() {
    gameInterval = setInterval(() => {
        speed += 0.1; // Aumenta la velocidad cada segundo
    }, 1000);
}

function startObstacleCreation() {
    obstacleCreationLoop = setInterval(() => {
        createObstacle(); // Crear un obstáculo
    }, obstacleInterval);
}

function adjustObstacleInterval() {
    obstacleInterval -= 100; // Reducir el intervalo en 100 milisegundos
    if (obstacleInterval < 200) {
        obstacleInterval = 200; // Establecer un límite mínimo para el intervalo
    }
    clearInterval(obstacleCreationLoop);
    startObstacleCreation();
}

const startPopup = document.getElementById('start-popup');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', startGame);

function startGame() {
    startPopup.style.display = 'none';
    gameLoops.push(setInterval(moveObstacles, 50));
    gameLoops.push(setInterval(checkCollision, 50));
    gameLoops.push(setInterval(createBug, 2000));
    gameLoops.push(setInterval(moveBugs, 50));
    gameLoops.push(setInterval(animateBugs, 500));
    gameLoops.push(setInterval(adjustObstacleInterval, 10000));
    startSpeedIncrease();
    startObstacleCreation();
}

const restartButton = document.getElementById('restart-button');
const restartPopup = document.getElementById('restart-popup');

restartPopup.style.display = 'none';

restartButton.addEventListener('click', restartGame);

function restartGame() {
    restartPopup.style.display = 'none';
    resetGame();
    startGame();
}

function showGameOverPopup() {
    document.getElementById('final-score').textContent = score;
    restartPopup.style.display = 'flex';
    saveScore(score);
    displayHighScores();
}

function endGame() {
    clearGameLoops();
    clearInterval(gameInterval);
    clearInterval(obstacleCreationLoop);
}

function clearGameLoops() {
    gameLoops.forEach(loop => clearInterval(loop));
    gameLoops = [];
}

// Funciones para manejar la tabla de puntuaciones
function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('highScores')) || [];
    scores.push(score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 3); // Mantén solo las 3 mejores puntuaciones
    localStorage.setItem('highScores', JSON.stringify(scores));
}

function displayHighScores() {
    const scores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoresTable = document.getElementById('high-scores-table').getElementsByTagName('tbody')[0];
    highScoresTable.innerHTML = '';
    scores.forEach((score, index) => {
        const row = highScoresTable.insertRow();
        const positionCell = row.insertCell(0);
        const scoreCell = row.insertCell(1);
        positionCell.textContent = index + 1;
        scoreCell.textContent = score;
    });
}

// Llamar a la función para mostrar las puntuaciones altas al cargar la página
displayHighScores();
