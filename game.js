/**
 * 游戏配置
 * @type {Object}
 */
const config = {
    gridSize: 20,
    gameSpeed: 100,
    canvasSize: 400
};

/**
 * 游戏状态
 * @type {Object}
 */
const gameState = {
    snake: [],
    food: null,
    direction: 'right',
    score: 0,
    gameLoop: null,
    isGameOver: false
};

/**
 * 获取画布和上下文
 */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

/**
 * 初始化蛇的位置
 */
function initSnake() {
    gameState.snake = [
        { x: 6, y: 10 },
        { x: 5, y: 10 },
        { x: 4, y: 10 }
    ];
}

/**
 * 生成随机食物位置
 */
function generateFood() {
    while (true) {
        const food = {
            x: Math.floor(Math.random() * (config.canvasSize / config.gridSize)),
            y: Math.floor(Math.random() * (config.canvasSize / config.gridSize))
        };
        
        // 确保食物不会生成在蛇身上
        if (!gameState.snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            gameState.food = food;
            break;
        }
    }
}

/**
 * 绘制游戏元素
 */
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    gameState.snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#388E3C'; // 蛇头颜色
        } else {
            ctx.fillStyle = '#4CAF50'; // 蛇身颜色
        }
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
    });
    
    // 绘制食物
    ctx.fillStyle = '#F44336';
    ctx.fillRect(
        gameState.food.x * config.gridSize,
        gameState.food.y * config.gridSize,
        config.gridSize - 1,
        config.gridSize - 1
    );
}

/**
 * 移动蛇
 */
function moveSnake() {
    const head = { ...gameState.snake[0] };
    
    switch (gameState.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 检查碰撞
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    gameState.snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        gameState.score += 10;
        document.getElementById('score').textContent = gameState.score;
        generateFood();
    } else {
        gameState.snake.pop();
    }
}

/**
 * 检查碰撞
 * @param {Object} head - 蛇头位置
 * @returns {boolean} 是否发生碰撞
 */
function isCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= config.canvasSize / config.gridSize ||
        head.y < 0 || head.y >= config.canvasSize / config.gridSize) {
        return true;
    }
    
    // 检查自身碰撞
    return gameState.snake.some(segment => segment.x === head.x && segment.y === head.y);
}

/**
 * 游戏结束处理
 */
function gameOver() {
    clearInterval(gameState.gameLoop);
    gameState.isGameOver = true;
    alert('游戏结束！得分：' + gameState.score);
}

/**
 * 重新开始游戏
 */
function restartGame() {
    clearInterval(gameState.gameLoop);
    gameState.score = 0;
    gameState.direction = 'right';
    gameState.isGameOver = false;
    document.getElementById('score').textContent = '0';
    initSnake();
    generateFood();
    gameState.gameLoop = setInterval(gameLoop, config.gameSpeed);
}

/**
 * 游戏主循环
 */
function gameLoop() {
    moveSnake();
    draw();
}

/**
 * 键盘事件处理
 */
document.addEventListener('keydown', (event) => {
    if (gameState.isGameOver) return;
    
    const keyActions = {
        'ArrowUp': () => gameState.direction !== 'down' && (gameState.direction = 'up'),
        'ArrowDown': () => gameState.direction !== 'up' && (gameState.direction = 'down'),
        'ArrowLeft': () => gameState.direction !== 'right' && (gameState.direction = 'left'),
        'ArrowRight': () => gameState.direction !== 'left' && (gameState.direction = 'right')
    };
    
    if (keyActions[event.key]) {
        keyActions[event.key]();
    }
});

// 初始化游戏
initSnake();
generateFood();
gameState.gameLoop = setInterval(gameLoop, config.gameSpeed); 