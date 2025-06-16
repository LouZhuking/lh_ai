// 游戏常量
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const HOOK_SPEED = 5;
const HOOK_SWING_SPEED = 0.03;
const INITIAL_TIME = 60; // 初始时间(秒)
const BASE_SCORE_REQUIREMENT = 500; // 基础过关分数

// 游戏状态
const gameState = {
    canvas: null,
    ctx: null,
    score: 0,
    level: 1,
    time: INITIAL_TIME,
    highScore: localStorage.getItem('goldMinerHighScore') || 0,
    isPlaying: false,
    isPaused: false,
    isSoundOn: true,
    goldCollected: 0,
    startTime: 0,
    gameTime: 0,
    hook: {
        x: GAME_WIDTH / 2,
        y: 100,
        width: 10,
        height: 30,
        angle: 0,
        speed: HOOK_SPEED,
        isFlying: false,
        direction: 1,
        target: null
    },
    items: [],
    timer: null
};

// 物品类型定义
const ITEM_TYPES = {
    GOLD_SMALL: { value: 100, weight: 1, color: '#ffd700', size: 15 },
    GOLD_MEDIUM: { value: 250, weight: 2, color: '#ffc107', size: 20 },
    GOLD_LARGE: { value: 500, weight: 3, color: '#ffb300', size: 25 },
    DIAMOND: { value: 1000, weight: 0.5, color: '#b3e5fc', size: 15 },
    STONE: { value: 50, weight: 5, color: '#9e9e9e', size: 20 },
    BOMB: { value: -200, weight: 1, color: '#f44336', size: 18 },
    SPEED_BOOST: { value: 0, weight: 0.5, color: '#4caf50', size: 15, type: 'powerup', effect: 'speed' },
    TIME_BOOST: { value: 0, weight: 0.5, color: '#2196f3', size: 15, type: 'powerup', effect: 'time' }
};

// DOM元素
const elements = {
    startMenu: document.getElementById('start-menu'),
    gameScreen: document.getElementById('game-screen'),
    endMenu: document.getElementById('end-menu'),
    startButton: document.getElementById('start-button'),
    restartButton: document.getElementById('restart-button'),
    menuButton: document.getElementById('menu-button'),
    hookButton: document.getElementById('hook-button'),
    pauseButton: document.getElementById('pause-button'),
    soundButton: document.getElementById('sound-button'),
    soundStatus: document.getElementById('sound-status'),
    scoreDisplay: document.getElementById('score'),
    timeDisplay: document.getElementById('time'),
    levelDisplay: document.getElementById('level'),
    endMessage: document.getElementById('end-message'),
    finalScoreDisplay: document.getElementById('final-score'),
    goldCollectedDisplay: document.getElementById('gold-collected'),
    timeUsedDisplay: document.getElementById('time-used'),
    highScoreDisplay: document.getElementById('high-score')
};

// 初始化游戏
function initGame() {
    // 设置画布
    gameState.canvas = document.getElementById('game-canvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    gameState.canvas.width = GAME_WIDTH;
    gameState.canvas.height = GAME_HEIGHT;

    // 加载高分
    elements.highScoreDisplay.textContent = gameState.highScore;

    // 设置事件监听器
    elements.startButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', restartGame);
    elements.menuButton.addEventListener('click', showStartMenu);
    elements.hookButton.addEventListener('click', toggleHook);
    elements.pauseButton.addEventListener('click', togglePause);
    elements.soundButton.addEventListener('click', toggleSound);

    // 绘制开始界面
    drawStartScreen();
}

// 开始游戏
function startGame() {
    gameState.score = 0;
    gameState.goldCollected = 0;
    gameState.time = INITIAL_TIME + (gameState.level - 1) * 10;
    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.startTime = Date.now();
    gameState.gameTime = 0;
    gameState.items = [];

    // 更新显示
    updateScore();
    updateTime();
    elements.levelDisplay.textContent = gameState.level;

    // 生成物品
    generateItems();

    // 隐藏菜单，显示游戏界面
    elements.startMenu.classList.add('hidden');
    elements.endMenu.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');

    // 开始计时器
    if (gameState.timer) clearInterval(gameState.timer);
    gameState.timer = setInterval(updateGameTime, 1000);

    // 开始游戏循环
    gameLoop();
}

// 生成游戏物品
function generateItems() {
    gameState.items = [];
    const itemCount = 8 + gameState.level * 2;
    const itemTypes = Object.values(ITEM_TYPES);

    // 确保至少有一个高分值物品
    gameState.items.push(createItem(ITEM_TYPES.GOLD_LARGE));
    gameState.items.push(createItem(ITEM_TYPES.DIAMOND));

    // 随机生成其他物品
    for (let i = 0; i < itemCount - 2; i++) {
        // 随着关卡提升，生成更好的物品
        const randomValue = Math.random();
        let itemType;

        if (randomValue < 0.05 + gameState.level * 0.01) {
            itemType = ITEM_TYPES.DIAMOND; // 钻石 (5-15%)
        } else if (randomValue < 0.15 + gameState.level * 0.01) {
            itemType = ITEM_TYPES.GOLD_LARGE; // 大金块 (10-20%)
        } else if (randomValue < 0.35 + gameState.level * 0.02) {
            itemType = ITEM_TYPES.GOLD_MEDIUM; // 中金块 (20-40%)
        } else if (randomValue < 0.6 + gameState.level * 0.02) {
            itemType = ITEM_TYPES.GOLD_SMALL; // 小金块 (25-45%)
        } else if (randomValue < 0.8) {
            itemType = ITEM_TYPES.STONE; // 石头 (20%)
        } else if (randomValue < 0.9) {
            itemType = Math.random() > 0.5 ? ITEM_TYPES.SPEED_BOOST : ITEM_TYPES.TIME_BOOST; // 道具 (10%)
        } else {
            itemType = ITEM_TYPES.BOMB; // 炸弹 (10%)
        }

        gameState.items.push(createItem(itemType));
    }
}

// 创建物品
function createItem(itemType) {
    // 确保物品不会重叠太多
    let x, y, overlap;
    const padding = itemType.size * 2;

    do {
        overlap = false;
        x = Math.random() * (GAME_WIDTH - 100) + 50;
        y = Math.random() * (GAME_HEIGHT - 300) + 250;

        // 检查与已有物品的重叠
        for (const item of gameState.items) {
            const dx = x - item.x;
            const dy = y - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < padding) {
                overlap = true;
                break;
            }
        }
    } while (overlap);

    return {
        ...itemType,
        x: x,
        y: y,
        collected: false
    };
}

// 游戏主循环
function gameLoop() {
    if (!gameState.isPlaying || gameState.isPaused) return;

    // 清空画布
    gameState.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 绘制背景
    drawBackground();

    // 绘制矿工
    drawMiner();

    // 更新并绘制抓钩
    updateHook();
    drawHook();

    // 绘制物品
    drawItems();

    // 检查游戏是否结束
    checkGameOver();

    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 绘制背景
function drawBackground() {
    // 绘制矿洞顶部
    gameState.ctx.fillStyle = '#5d4037';
    gameState.ctx.fillRect(0, 0, GAME_WIDTH, 100);

    // 绘制矿洞墙壁
    gameState.ctx.fillStyle = '#795548';
    gameState.ctx.fillRect(0, 100, 50, GAME_HEIGHT - 100);
    gameState.ctx.fillRect(GAME_WIDTH - 50, 100, 50, GAME_HEIGHT - 100);

    // 绘制矿洞地面
    gameState.ctx.fillStyle = '#4e342e';
    gameState.ctx.fillRect(0, GAME_HEIGHT - 50, GAME_WIDTH, 50);

    // 添加一些岩石纹理
    gameState.ctx.fillStyle = '#6d4c41';
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * (GAME_WIDTH - 100) + 50;
        const y = Math.random() * (GAME_HEIGHT - 200) + 150;
        const size = Math.random() * 20 + 10;
        gameState.ctx.beginPath();
        gameState.ctx.arc(x, y, size, 0, Math.PI * 2);
        gameState.ctx.fill();
    }
}

// 绘制矿工
function drawMiner() {
    // 矿工头部
    gameState.ctx.fillStyle = '#ffcc80';
    gameState.ctx.beginPath();
    gameState.ctx.arc(GAME_WIDTH / 2, 80, 15, 0, Math.PI * 2);
    gameState.ctx.fill();

    // 矿工身体
    gameState.ctx.fillStyle = '#d35400';
    gameState.ctx.fillRect(GAME_WIDTH / 2 - 10, 95, 20, 30);

    // 矿工手臂
    gameState.ctx.strokeStyle = '#ffcc80';
    gameState.ctx.lineWidth = 8;
    gameState.ctx.beginPath();
    gameState.ctx.moveTo(GAME_WIDTH / 2, 105);
    gameState.ctx.lineTo(gameState.hook.x, gameState.hook.y);
    gameState.ctx.stroke();
}

// 更新抓钩状态
function updateHook() {
    if (!gameState.hook.isFlying) {
        // 抓钩摆动
        gameState.hook.angle += HOOK_SWING_SPEED * gameState.hook.direction;
        gameState.hook.x = GAME_WIDTH / 2 + Math.sin(gameState.hook.angle) * 100;

        // 到达摆动极限时反向
        if (gameState.hook.angle > Math.PI / 3 || gameState.hook.angle < -Math.PI / 3) {
            gameState.hook.direction *= -1;
        }
    } else {
        // 抓钩正在移动
        if (!gameState.hook.target) {
            // 向下移动
            gameState.hook.y += gameState.hook.speed;

            // 检查是否碰到地面或物品
            if (gameState.hook.y + gameState.hook.height > GAME_HEIGHT - 50) {
                // 碰到地面，开始回收
                gameState.hook.target = null;
                gameState.hook.isFlying = false;
                gameState.hook.speed = HOOK_SPEED;
            } else {
                // 检查是否碰到物品
                checkItemCollision();
            }
        } else {
            // 回收物品
            const dx = GAME_WIDTH / 2 - gameState.hook.x;
            const dy = gameState.hook.y - 100;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 根据物品重量调整速度
            const speedFactor = gameState.hook.target.weight || 1;
            const moveSpeed = HOOK_SPEED / speedFactor;

            if (distance < moveSpeed) {
                // 回到顶部，处理物品
                collectItem(gameState.hook.target);
                gameState.hook.target = null;
                gameState.hook.isFlying = false;
                gameState.hook.speed = HOOK_SPEED;
                gameState.hook.y = 100;
            } else {
                // 向矿工移动
                const ratio = moveSpeed / distance;
                gameState.hook.x += dx * ratio;
                gameState.hook.y -= dy * ratio;
            }
        }
    }
}

// 绘制抓钩
function drawHook() {
    gameState.ctx.save();
    gameState.ctx.translate(gameState.hook.x, gameState.hook.y);
    gameState.ctx.rotate(Math.atan2(
        gameState.hook.y - 100,
        gameState.hook.x - GAME_WIDTH / 2
    ));

    // 绘制抓钩
    gameState.ctx.fillStyle = '#795548';
    gameState.ctx.fillRect(-gameState.hook.width / 2, 0, gameState.hook.width, gameState.hook.height);

    // 绘制钩子
    gameState.ctx.fillStyle = '#9e9e9e';
    gameState.ctx.beginPath();
    gameState.ctx.moveTo(-gameState.hook.width, gameState.hook.height);
    gameState.ctx.lineTo(0, gameState.hook.height + 10);
    gameState.ctx.lineTo(gameState.hook.width, gameState.hook.height);
    gameState.ctx.closePath();
    gameState.ctx.fill();

    gameState.ctx.restore();
}

// 绘制物品
function drawItems() {
    for (const item of gameState.items) {
        if (!item.collected) {
            gameState.ctx.fillStyle = item.color;
            gameState.ctx.beginPath();
            gameState.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            gameState.ctx.fill();

            // 如果是特殊道具，添加标记
            if (item.type === 'powerup') {
                gameState.ctx.strokeStyle = 'white';
                gameState.ctx.lineWidth = 2;
                gameState.ctx.beginPath();
                gameState.ctx.arc(item.x, item.y, item.size + 5, 0, Math.PI * 2);
                gameState.ctx.stroke();
            }
        }
    }
}

// 检查抓钩与物品碰撞
function checkItemCollision() {
    const hookTipX = gameState.hook.x;
    const hookTipY = gameState.hook.y + gameState.hook.height;

    for (const item of gameState.items) {
        if (!item.collected) {
            const dx = hookTipX - item.x;
            const dy = hookTipY - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < item.size) {
                // 勾到物品
                gameState.hook.target = item;
                item.collected = true;
                playSound('hook');
                break;
            }
        }
    }
}

// 收集物品
function collectItem(item) {
    if (item.value > 0) {
        gameState.score += item.value;
        updateScore();
        playSound('collect');

        // 如果是金块，增加金币计数
        if (item.value > 0 && !item.type) {
            gameState.goldCollected++;
        }

        // 处理特殊道具
        if (item.type === 'powerup') {
            applyPowerup(item.effect);
        }
    } else if (item.value < 0) {
        // 炸弹惩罚
        gameState.score += item.value;
        if (gameState.score < 0) gameState.score = 0;
        updateScore();
        playSound('bomb');
    }

    // 检查是否过关
    checkLevelUp();
}

// 应用道具效果
function applyPowerup(effect) {
    switch (effect) {
        case 'speed':
            gameState.hook.speed *= 1.5;
            setTimeout(() => {
                gameState.hook.speed = HOOK_SPEED;
            }, 10000);
            showMessage('速度提升!', '#4caf50');
            break;
        case 'time':
            gameState.time += 10;
            updateTime();
            showMessage('时间+10秒!', '#2196f3');
            break;
    }
}

// 显示临时消息
function showMessage(text, color) {
    const messageEl = document.createElement('div');
    messageEl.textContent = text;
    messageEl.style.position = 'absolute';
    messageEl.style.top = '120px';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translateX(-50%)';
    messageEl.style.color = color;
    messageEl.style.fontSize = '24px';
    messageEl.style.fontWeight = 'bold';
    messageEl.style.textShadow = '0 0 5px black';
    messageEl.style.zIndex = '10';

    document.querySelector('.game-container').appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 2000);
}

// 检查是否过关
function checkLevelUp() {
    const requiredScore = BASE_SCORE_REQUIREMENT * gameState.level;
    if (gameState.score >= requiredScore) {
        gameState.level++;
        elements.levelDisplay.textContent = gameState.level;
        showMessage(`进入第${gameState.level}关!`, '#ffd700');
        startGame(); // 重新开始游戏，但保留关卡
    }
}

// 检查游戏是否结束
function checkGameOver() {
    if (gameState.time <= 0) {
        endGame(false);
    }
}

// 更新游戏时间
function updateGameTime() {
    if (!gameState.isPlaying || gameState.isPaused) return;

    gameState.time--;
    gameState.gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    updateTime();
}

// 更新分数显示
function updateScore() {
    elements.scoreDisplay.textContent = gameState.score;
}

// 更新时间显示
function updateTime() {
    elements.timeDisplay.textContent = gameState.time;
}

// 结束游戏
function endGame(isWin) {
    gameState.isPlaying = false;
    clearInterval(gameState.timer);

    // 更新最高分
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('goldMinerHighScore', gameState.highScore);
    }

    // 更新结束界面
    elements.endMessage.textContent = isWin ? '恭喜过关!' : '游戏结束';
    elements.finalScoreDisplay.textContent = gameState.score;
    elements.goldCollectedDisplay.textContent = gameState.goldCollected;
    elements.timeUsedDisplay.textContent = gameState.gameTime;
    elements.highScoreDisplay.textContent = gameState.highScore;

    // 显示结束界面
    elements.endMenu.classList.remove('hidden');
}

// 切换抓钩状态
function toggleHook() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.hook.isFlying) return;

    gameState.hook.isFlying = true;
    playSound('throw');
}

// 切换暂停状态
function togglePause() {
    if (!gameState.isPlaying) return;

    gameState.isPaused = !gameState.isPaused;
    elements.pauseButton.textContent = gameState.isPaused ? '继续' : '暂停';

    if (!gameState.isPaused) {
        gameLoop();
    }
}

// 切换音效
function toggleSound() {
    gameState.isSoundOn = !gameState.isSoundOn;
    elements.soundStatus.textContent = gameState.isSoundOn ? '开' : '关';
}

// 重新开始游戏
function restartGame() {
    gameState.level = 1;
    startGame();
}

// 显示开始菜单
function showStartMenu() {
    elements.endMenu.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.startMenu.classList.remove('hidden');
}

// 绘制开始界面
function drawStartScreen() {
    // 可以添加一些动画效果
}

// 播放音效 (简化版)
function playSound(type) {
    if (!gameState.isSoundOn) return;

    // 在实际项目中这里会播放真实音效
    console.log(`播放音效: ${type}`);
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', initGame);