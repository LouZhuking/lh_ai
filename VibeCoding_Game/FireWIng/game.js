// 游戏常量
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended'
};

const GRAVITY = 0.2;
const ROPE_LENGTH = 150;
const PLAYER_SIZE = 20;
const ANCHOR_RADIUS = 10;
const TARGET_SIZE = 30;
const GAME_DURATION = 50; // 50秒

// 游戏状态
let gameState = GAME_STATE.MENU;
let currentLevel = 1;
let canvas, ctx;
let player = {
    x: 150,
    y: 450,
    velocityX: 0,
    velocityY: 0,
    onGround: true,
    isSwinging: false,
    ropeAnchor: null
};
let anchors = [];
let platforms = [];
let obstacles = [];
let target = {};
let gameTimer = GAME_DURATION;
let timerInterval;
let lastTime = 0;

// DOM元素
const startMenu = document.getElementById('start-menu');
const levelClearedMenu = document.getElementById('level-cleared');
const nextLevelButton = document.getElementById('next-level-button');
const settingsButton = document.querySelector('.settings-btn');
const pauseButton = document.getElementById('pause-button');
const levelProgress = document.getElementById('level-progress');
const currentLevelDisplay = document.getElementById('current-level');
const gameScreen = document.getElementById('game-screen');
const endMenu = document.getElementById('game-over');
const startBtn = document.getElementById('start-button');
const restartBtn = document.getElementById('restart-button');
const menuBtn = document.getElementById('menu-button');
const endMessage = document.getElementById('game-over-title');
const timerDisplay = document.getElementById('timer');

// 初始化游戏
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // 设置画布尺寸
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 事件监听
    startBtn.addEventListener('click', startGame);
    nextLevelButton.addEventListener('click', nextLevel);
    settingsButton.addEventListener('click', toggleSettings);
    restartBtn.addEventListener('click', restartGame);
    menuBtn.addEventListener('click', () => {
        endMenu.classList.add('hidden');
        startMenu.classList.remove('hidden');
    });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    pauseButton.addEventListener('click', togglePause);

    // 加载初始关卡
    createLevel();

    // 开始游戏循环
    requestAnimationFrame(gameLoop);
}

// 调整画布尺寸
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = Math.min(800, container.clientWidth * 0.9);
    canvas.height = Math.min(600, container.clientHeight * 0.8);
}

// 创建关卡
function createLevel() {
    // 更新关卡显示
    currentLevelDisplay.textContent = currentLevel;
    
    // 清空现有元素
    anchors = [];
    platforms = [];
    obstacles = [];

    // 根据当前关卡调整难度
    const difficulty = Math.min(5, currentLevel); // 最大难度为5
    const obstacleCount = 3 + Math.floor(difficulty / 2);
    const anchorCount = 3 + difficulty;

    // 创建平台（黑白相间，倾斜30°的初始平台）
    platforms.push({
        x1: 50, y1: 500,
        x2: 250, y2: 450,
        width: 10,
        color: 'black',
        isGround: true
    });

    // 创建目标平台
    platforms.push({
        x1: canvas.width - 200, y1: 200,
        x2: canvas.width - 100, y2: 180,
        width: 10,
        color: 'gold'
    });

    // 创建锚点
    anchors = [];
    for (let i = 0; i < anchorCount; i++) {
        anchors.push({
            x: 200 + (i * 150),
            y: 150 + Math.sin(i * 0.5) * 100 * (1 - difficulty * 0.1)
        });
    }

    // 创建障碍物
    obstacles = [];
    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push({
            x: 250 + (i * 120),
            y: 250 + Math.random() * 150 * (1 - difficulty * 0.1),
            width: 60 + Math.random() * 80,
            height: 20
        });
    }

    // 设置目标
    target = {
        x: canvas.width - 150,
        y: 170,
        size: TARGET_SIZE
    };

    // 重置玩家位置
    resetPlayer();
}

// 重置玩家
function resetPlayer() {
    player = {
        x: 150,
        y: 450,
        velocityX: 0,
        velocityY: 0,
        onGround: true,
        isSwinging: false,
        ropeAnchor: null
    };
}

// 开始游戏
function startGame() {
    // 添加开始菜单淡出动画
    startMenu.style.opacity = '0';
    setTimeout(() => {
        startMenu.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        // 添加游戏界面淡入动画
        gameScreen.style.opacity = '1';
        gameState = GAME_STATE.PLAYING;
        gameTimer = GAME_DURATION;
        timerDisplay.textContent = gameTimer;
    }, 500);

    // 启动计时器
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameState === GAME_STATE.PLAYING) {
            gameTimer--;
            timerDisplay.textContent = gameTimer;
            if (gameTimer <= 0) {
                endGame(false);
            }
        }
    }, 1000);
}

// 重新开始游戏
function restartGame() {
    endMenu.classList.add('hidden');
    createLevel();
    startGame();
}

// 暂停/继续游戏
function togglePause() {
    if (gameState === GAME_STATE.PLAYING) {
        gameState = GAME_STATE.PAUSED;
    } else if (gameState === GAME_STATE.PAUSED) {
        gameState = GAME_STATE.PLAYING;
    }
}

// 结束游戏
function endGame(isWin) {
    gameState = GAME_STATE.ENDED;
    clearInterval(timerInterval);
    gameScreen.classList.add('hidden');
    if (isWin) {
        levelClearedMenu.classList.remove('hidden');
    } else {
        endMenu.classList.remove('hidden');
        endMessage.textContent = '游戏结束';
    }
}

function nextLevel() {
    currentLevel++;
    levelClearedMenu.classList.add('hidden');
    createLevel();
    startGame();
}

function toggleSettings() {
    alert('设置功能即将推出');
}

// 处理鼠标按下（抓取钩锁）
function handleMouseDown(e) {
    if (gameState !== GAME_STATE.PLAYING) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 检测是否点击到锚点
    for (const anchor of anchors) {
        const dx = mouseX - anchor.x;
        const dy = mouseY - anchor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= ANCHOR_RADIUS) {
            player.isSwinging = true;
            player.ropeAnchor = { ...anchor };
            player.onGround = false;
            break;
        }
    }
}

// 处理鼠标释放（释放秋千）
function handleMouseUp(e) {
    if (gameState !== GAME_STATE.PLAYING) return;
    player.isSwinging = false;
    player.ropeAnchor = null;
}

// 检测碰撞
function checkCollision() {
    // 检测是否到达目标
    const dx = player.x - target.x;
    const dy = player.y - target.y;
    if (Math.sqrt(dx * dx + dy * dy) < target.size + PLAYER_SIZE) {
        endGame(true);
    }

    // 检测是否掉落
    if (player.y > canvas.height + PLAYER_SIZE) {
        endGame(false);
    }

    // 检测平台碰撞
    for (const platform of platforms) {
        // 简化的线段碰撞检测
        const onPlatform = checkLinePointCollision(
            platform.x1, platform.y1, platform.x2, platform.y2,
            player.x, player.y, platform.width
        );

        if (onPlatform && player.velocityY > 0) {
            player.onGround = true;
            player.velocityY = 0;
            // 设置玩家在平台上的位置
            player.y = platform.y1 - PLAYER_SIZE;
        }
    }

    // 检测障碍物碰撞
    for (const obstacle of obstacles) {
        if (
            player.x + PLAYER_SIZE > obstacle.x &&
            player.x - PLAYER_SIZE < obstacle.x + obstacle.width &&
            player.y + PLAYER_SIZE > obstacle.y &&
            player.y - PLAYER_SIZE < obstacle.y + obstacle.height
        ) {
            endGame(false);
        }
    }
}

// 线段与点碰撞检测
function checkLinePointCollision(x1, y1, x2, y2, px, py, lineWidth) {
    // 实现简化的线段碰撞检测
    const lineLength = Math.hypot(x2 - x1, y2 - y1);
    const dotProduct = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLength * lineLength);
    const closestX = x1 + dotProduct * (x2 - x1);
    const closestY = y1 + dotProduct * (y2 - y1);
    const distance = Math.hypot(px - closestX, py - closestY);

    return distance <= lineWidth / 2 && dotProduct >= 0 && dotProduct <= 1;
}

// 更新游戏状态
function update(deltaTime) {
    // 更新进度条
    if (target && player) {
        const progress = Math.min(100, 100 - (Math.abs(player.x - target.x) / canvas.width * 100));
        levelProgress.style.width = progress + '%';
    }
    if (gameState !== GAME_STATE.PLAYING) return;

    // 应用重力
    player.velocityY += GRAVITY;

    // 处理摆动逻辑
    if (player.isSwinging && player.ropeAnchor) {
        const dx = player.x - player.ropeAnchor.x;
        const dy = player.y - player.ropeAnchor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 绳子张力
        if (distance > ROPE_LENGTH) {
            const ratio = ROPE_LENGTH / distance;
            player.x = player.ropeAnchor.x + dx * ratio;
            player.y = player.ropeAnchor.y + dy * ratio;

            // 计算向心力
            const tensionX = (player.ropeAnchor.x - player.x) / distance;
            const tensionY = (player.ropeAnchor.y - player.y) / distance;
            player.velocityX += tensionX * 0.5;
            player.velocityY += tensionY * 0.5;
        }
    } else if (!player.onGround) {
        // 在空中自由落体
        player.x += player.velocityX;
        player.y += player.velocityY;
    } else {
        // 在地面上，速度逐渐减小
        player.velocityX *= 0.9;
        if (Math.abs(player.velocityX) < 0.1) player.velocityX = 0;
    }

    // 边界检测
    if (player.x < PLAYER_SIZE) player.x = PLAYER_SIZE;
    if (player.x > canvas.width - PLAYER_SIZE) player.x = canvas.width - PLAYER_SIZE;

    // 碰撞检测
    checkCollision();
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制平台
    for (const platform of platforms) {
        ctx.beginPath();
        ctx.moveTo(platform.x1, platform.y1);
        ctx.lineTo(platform.x2, platform.y2);
        ctx.lineWidth = platform.width;
        ctx.strokeStyle = platform.color;
        ctx.stroke();
    }

    // 绘制锚点
    for (const anchor of anchors) {
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, ANCHOR_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#FF5252';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 绘制障碍物
    for (const obstacle of obstacles) {
        ctx.fillStyle = '#333';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // 绘制目标光晕
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.size + 15, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(target.x, target.y, target.size, target.x, target.y, target.size + 15);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制目标
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
    ctx.fillStyle = 'gold';
    ctx.fill();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制轨迹线
    if (player.isSwinging && player.ropeAnchor) {
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // 绘制绳子
    if (player.isSwinging && player.ropeAnchor) {
        ctx.beginPath();
        ctx.moveTo(player.ropeAnchor.x, player.ropeAnchor.y);
        ctx.lineTo(player.x, player.y);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // 绘制火柴人
    ctx.save();
    ctx.translate(player.x, player.y);

    // 头部
    ctx.beginPath();
    ctx.arc(0, -PLAYER_SIZE / 2, PLAYER_SIZE / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    // 身体
    ctx.beginPath();
    ctx.moveTo(0, -PLAYER_SIZE / 6);
    ctx.lineTo(0, PLAYER_SIZE / 3);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // 手臂
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-PLAYER_SIZE / 3, -PLAYER_SIZE / 6);
    ctx.lineTo(-PLAYER_SIZE / 2, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(PLAYER_SIZE / 3, -PLAYER_SIZE / 6);
    ctx.lineTo(PLAYER_SIZE / 2, 0);
    ctx.stroke();

    // 腿
    ctx.beginPath();
    ctx.moveTo(0, PLAYER_SIZE / 3);
    ctx.lineTo(-PLAYER_SIZE / 3, PLAYER_SIZE);
    ctx.moveTo(0, PLAYER_SIZE / 3);
    ctx.lineTo(PLAYER_SIZE / 3, PLAYER_SIZE);
    ctx.stroke();

    ctx.restore();

    // 如果游戏暂停，显示暂停文本
    if (gameState === GAME_STATE.PAUSED) {
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
    }
}

// 游戏主循环
function gameLoop(timestamp) {
    // 计算时间增量
    const deltaTime = timestamp - lastTime || 0;
    lastTime = timestamp;

    // 更新和绘制游戏
    update(deltaTime);
    draw();

    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', init);