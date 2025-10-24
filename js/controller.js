const player = document.getElementById('player');
const platforms = document.querySelectorAll('.platform');
const gameContainer = document.querySelector('.game-container');
const gameOverDiv = document.getElementById('game-over');
const restartBtn = document.getElementById('restart');
const scoreEl = document.getElementById('score');

// Sounds
const jumpSound = new Audio('assets/sounds/jump.wav');
const landSound = new Audio('assets/sounds/land.wav');
const gameOverSound = new Audio('assets/sounds/gameover.wav');

let playerPos = { x: 50, y: 50 };
let velocity = { x: 0, y: 0 };
const gravity = 0.5;
const speed = 5;
const jumpForce = -12;
let keys = {};
let score = 0;
let gameRunning = true;

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

restartBtn.addEventListener('click', () => {
    playerPos = { x: 50, y: 50 };
    velocity = { x: 0, y: 0 };
    score = 0;
    scoreEl.textContent = score;
    gameOverDiv.classList.add('hidden');
    gameRunning = true;
    gameLoop();
});

function gameLoop() {
    if (!gameRunning) return;
    
    if (keys['ArrowLeft'] || keys['KeyA']) velocity.x = -speed;
    else if (keys['ArrowRight'] || keys['KeyD']) velocity.x = speed;
    else velocity.x = 0;
    
    if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && isOnGround()) {
        velocity.y = jumpForce;
        jumpSound.play();
    }
    
    velocity.y += gravity;
    
    playerPos.x += velocity.x;
    playerPos.y += velocity.y;
    
    let onPlatform = false;
    platforms.forEach(platform => {
        const platRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            playerRect.bottom >= platRect.top &&
            playerRect.top < platRect.top &&
            playerRect.right > platRect.left &&
            playerRect.left < platRect.right
        ) {
            playerPos.y = platRect.top - player.offsetHeight - (playerRect.top - playerPos.y);
            velocity.y = 0;
            onPlatform = true;
            landSound.play();
        }
    });
    
    if (playerPos.y + player.offsetHeight > 400) {
        playerPos.y = 400 - player.offsetHeight;
        velocity.y = 0;
        onPlatform = true;
    }
    
    if (playerPos.x < 0) playerPos.x = 0;
    if (playerPos.x + player.offsetWidth > 600) playerPos.x = 600 - player.offsetWidth;
    
    score += 0.1;
    scoreEl.textContent = Math.floor(score);
    
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
    
    if (playerPos.y + player.offsetHeight >= 400) {
        
    }

    requestAnimationFrame(gameLoop);
}

function isOnGround() {
    return [...platforms].some(platform => {
        const platRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        return (
            playerRect.bottom === platRect.top &&
            playerRect.right > platRect.left &&
            playerRect.left < platRect.right
        );
    }) || playerPos.y + player.offsetHeight >= 400;
}

gameLoop();
