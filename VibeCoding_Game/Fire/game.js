// 游戏状态
let gameStarted = false;
let gamePaused = false;
let currentLevel = 1;
let score = 0;

// 鼠标事件处理
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

// 获取DOM元素
const menu = document.getElementById('menu');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const albumBtn = document.getElementById('album-btn');
const settingsBtn = document.getElementById('settings-btn');
const avatarBtn = document.getElementById('avatar-btn');
const pauseBtn = document.getElementById('pause-btn');

// 游戏对象
const stickman = {
    x: 100,
    y: 300,
    width: 20,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    isSwinging: false,
    anchorPoint: null,
    ropeLength: 0
};

const platforms = [];
const targets = [];

// 关卡参数
const OBSTACLE_GROUPS = 5;
const OBSTACLE_PER_GROUP = 3;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 80;
const OBSTACLE_GAP_X = 220;
const OBSTACLE_GAP_Y = 10;
const NODE_RADIUS = 16;
const NODE_GAP_X = 220;
const FINISH_LINE_WIDTH = 30;
const FINISH_LINE_HEIGHT = 200;
const FINISH_LINE_GAP = 80;

// 顶部只声明一次
let obstacles = [];
let nodes = [];
let finishLine = null;
let cameraX = 0;

// 添加鼠标事件监听器
gameCanvas.addEventListener('mousedown', handleMouseDown);
gameCanvas.addEventListener('mousemove', handleMouseMove);
gameCanvas.addEventListener('mouseup', handleMouseUp);

// 开始按钮点击事件
startBtn.onclick = () => {
    if (!gameStarted) {
        startGame();
    }
};

// 开始游戏
function startGame() {
    console.log('游戏开始');
    
    // 隐藏菜单界面
    menu.style.display = 'none';
    
    // 显示游戏界面
    gameCanvas.style.display = 'block';
    
    // 设置画布尺寸
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    
    // 更新游戏状态
    gameStarted = true;
    gamePaused = false;
    
    // 初始化游戏对象
    initGameObjects();
    
    // 更新关卡显示
    updateLevelDisplay();
    
    // 开始游戏循环
    requestAnimationFrame(gameLoop);
}

// 鼠标按下事件
function handleMouseDown(e) {
    if (!gameStarted || gamePaused) return;
    
    isMouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 找到最近的节点
    let minDist = 99999;
    let nearest = null;
    for (const node of nodes) {
        const dx = node.x - cameraX - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist && dist < 40) {
            minDist = dist;
            nearest = node;
        }
    }
    if (nearest) {
        stickman.isSwinging = true;
        stickman.anchorPoint = { x: nearest.x, y: nearest.y };
        stickman.ropeLength = Math.sqrt((stickman.x - nearest.x) ** 2 + (stickman.y - nearest.y) ** 2);
    }
}

// 鼠标移动事件
function handleMouseMove(e) {
    if (!gameStarted || gamePaused) return;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 如果正在摆荡，更新锚点位置
    if (isMouseDown && stickman.isSwinging) {
        stickman.anchorPoint = { x: mouseX, y: mouseY };
    }
}

// 鼠标释放事件
function handleMouseUp(e) {
    if (!gameStarted || gamePaused) return;
    
    isMouseDown = false;
    
    // 释放摆荡
    if (stickman.isSwinging) {
        stickman.isSwinging = false;
        stickman.anchorPoint = null;
        
        // 给予一个初始速度
        const dx = mouseX - stickman.x;
        const dy = mouseY - stickman.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 0.5;
        
        stickman.velocityX = (dx / distance) * speed;
        stickman.velocityY = (dy / distance) * speed;
    }
}

// 初始化游戏对象
function initGameObjects() {
    stickman.x = 100;
    stickman.y = 300;
    stickman.velocityX = 0;
    stickman.velocityY = 0;
    stickman.isSwinging = false;
    stickman.anchorPoint = null;
    stickman.ropeLength = 0;
    generateLevel();
}

// 游戏主循环
function gameLoop() {
    if (!gameStarted || gamePaused) return;
    
    // 清空画布
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // 更新游戏状态
    updateGame();
    
    // 绘制游戏元素
    drawGame();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 更新游戏状态
function updateGame() {
    cameraX = Math.max(0, stickman.x - 120);
    updateStickman();
    checkCollisions();
    checkWinCondition();
}

// 更新火柴人状态
function updateStickman() {
    if (stickman.isSwinging) {
        // 计算摆荡物理
        const dx = stickman.x - stickman.anchorPoint.x;
        const dy = stickman.y - stickman.anchorPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算摆荡角度和速度
        const angle = Math.atan2(dy, dx);
        const gravity = 0.5;
        const tension = 0.1;
        
        // 更新速度
        stickman.velocityX += Math.cos(angle) * tension;
        stickman.velocityY += gravity;
        
        // 更新位置
        stickman.x += stickman.velocityX;
        stickman.y += stickman.velocityY;
        
        // 限制摆荡范围
        if (distance > stickman.ropeLength) {
            const ratio = stickman.ropeLength / distance;
            stickman.x = stickman.anchorPoint.x + dx * ratio;
            stickman.y = stickman.anchorPoint.y + dy * ratio;
        }
    } else {
        // 自由落体
        stickman.velocityY += 0.5;
        stickman.y += stickman.velocityY;
    }
}

// 检查碰撞
function checkCollisions() {
    // 检查平台碰撞
    for (const platform of platforms) {
        if (stickman.y + stickman.height > platform.y &&
            stickman.y < platform.y + platform.height &&
            stickman.x + stickman.width > platform.x &&
            stickman.x < platform.x + platform.width) {
            stickman.y = platform.y - stickman.height;
            stickman.velocityY = 0;
            stickman.isSwinging = false;
        }
    }
    
    // 检查目标点碰撞
    for (const target of targets) {
        if (!target.isReached) {
            const dx = stickman.x - target.x;
            const dy = stickman.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < target.radius + stickman.width / 2) {
                target.isReached = true;
                // 处理目标达成逻辑
            }
        }
    }
}

// 检查胜利条件
function checkWinCondition() {
    if (stickman.x > finishLine.x + finishLine.width / 2) {
        gamePaused = true;
        setTimeout(() => {
            alert('恭喜通关！');
            window.location.reload();
        }, 1000);
    }
}

// 重置关卡
function resetLevel() {
    stickman.x = 100;
    stickman.y = 300;
    stickman.velocityX = 0;
    stickman.velocityY = 0;
    stickman.isSwinging = false;
    stickman.anchorPoint = null;
    
    // 重置目标点
    targets.forEach(target => {
        target.isReached = false;
    });
}

// 绘制平台
function drawPlatforms() {
    ctx.save();
    for (const platform of platforms) {
        // 绘制平台主体
        ctx.fillStyle = '#fff';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // 绘制平台边框
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // 绘制棋盘格
        const gridSize = 10;
        for (let x = platform.x; x < platform.x + platform.width; x += gridSize) {
            for (let y = platform.y; y < platform.y + platform.height; y += gridSize) {
                ctx.fillStyle = ((x + y) / gridSize) % 2 === 0 ? '#fff' : '#000';
                ctx.fillRect(x, y, gridSize, gridSize);
            }
        }
    }
    ctx.restore();
}

// 绘制目标点
function drawTargets() {
    ctx.save();
    for (const target of targets) {
        // 绘制目标点
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = target.isReached ? '#4CAF50' : '#2196F3';
        ctx.fill();
        
        // 绘制光晕效果
        if (!target.isReached) {
            ctx.beginPath();
            ctx.arc(target.x, target.y, target.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    ctx.restore();
}

// 四角按钮事件
albumBtn.onclick = () => alert('相册功能暂未开放');
settingsBtn.onclick = () => alert('设置功能暂未开放');
avatarBtn.onclick = () => alert('头像功能暂未开放');
pauseBtn.onclick = () => alert('暂停功能暂未开放');

// 只在菜单界面显示LOGO、关卡、火柴人、操场、主按钮
function showMenu() {
    document.getElementById('logo').style.display = '';
    levelBox.style.display = '';
    mainStickmanArea.style.display = '';
    startBtn.style.display = '';
}
function hideMenu() {
    document.getElementById('logo').style.display = 'none';
    levelBox.style.display = 'none';
    mainStickmanArea.style.display = 'none';
    startBtn.style.display = 'none';
}

// 修改绘制游戏元素函数
function drawGame() {
    drawBackground();
    drawObstacles();
    drawNodes();
    drawFinishLine();
    drawStickman();
    // 绳索
    if (stickman.isSwinging && stickman.anchorPoint) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(stickman.anchorPoint.x - cameraX, stickman.anchorPoint.y);
        ctx.lineTo(stickman.x - cameraX, stickman.y);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}

// 绘制背景
function drawBackground() {
    // 创建渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, gameCanvas.height);
    gradient.addColorStop(0, '#FFABAE');
    gradient.addColorStop(1, '#FEE884');
    
    // 填充背景
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// 更新关卡显示
function updateLevelDisplay() {
    const levelDisplay = document.getElementById('level-box');
    if (levelDisplay) {
        levelDisplay.textContent = `LEVEL ${currentLevel}`;
    }
}

// 暂停按钮点击事件
pauseBtn.onclick = () => {
    if (gameStarted) {
        gamePaused = !gamePaused;
        if (!gamePaused) {
            requestAnimationFrame(gameLoop);
        }
    }
};

function drawStickman() {
    ctx.save();
    ctx.translate(stickman.x - cameraX, stickman.y);
    // 头
    ctx.beginPath();
    ctx.arc(0, -18, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#3A8DFF';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();
    // 身体
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 32);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8;
    ctx.stroke();
    // 手臂
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(-18, 24);
    ctx.moveTo(0, 8);
    ctx.lineTo(18, 24);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.stroke();
    // 腿
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(-14, 54);
    ctx.moveTo(0, 32);
    ctx.lineTo(14, 54);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
}

function generateLevel() {
    obstacles = [];
    nodes = [];
    // 生成节点和障碍物
    for (let g = 0; g < OBSTACLE_GROUPS; g++) {
        // 节点
        nodes.push({
            x: 200 + g * NODE_GAP_X,
            y: 140 + (g % 2 === 0 ? 0 : 40)
        });
        // 竖直障碍块
        for (let i = 0; i < OBSTACLE_PER_GROUP; i++) {
            obstacles.push({
                x: 320 + g * OBSTACLE_GAP_X,
                y: 200 + i * (OBSTACLE_HEIGHT + OBSTACLE_GAP_Y),
                width: OBSTACLE_WIDTH,
                height: OBSTACLE_HEIGHT,
                color: (i % 2 === 0) ? '#000' : '#fff'
            });
        }
    }
    // 终点
    finishLine = {
        x: 320 + OBSTACLE_GROUPS * OBSTACLE_GAP_X + FINISH_LINE_GAP,
        y: 180,
        width: FINISH_LINE_WIDTH,
        height: FINISH_LINE_HEIGHT
    };
}

// 绘制障碍物
function drawObstacles() {
    ctx.save();
    for (const obs of obstacles) {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x - cameraX, obs.y, obs.width, obs.height);
        // 边框
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x - cameraX, obs.y, obs.width, obs.height);
    }
    ctx.restore();
}

// 绘制节点
function drawNodes() {
    ctx.save();
    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x - cameraX, node.y, NODE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = '#3A8DFF';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        // 黄色光圈
        ctx.beginPath();
        ctx.arc(node.x - cameraX, node.y, NODE_RADIUS + 6, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255,220,0,0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    ctx.restore();
}

// 绘制终点
function drawFinishLine() {
    ctx.save();
    for (let i = 0; i < finishLine.height / 20; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
        ctx.fillRect(finishLine.x - cameraX, finishLine.y + i * 20, finishLine.width, 20);
    }
    ctx.restore();
}

function updatePhysics() {
    // 摆荡物理
    if (stickman.swinging && stickman.anchor) {
        // 角度物理
        const g = 0.25;
        stickman.angularVelocity += -g / stickman.ropeLength * Math.sin(stickman.angle);
        stickman.angularVelocity *= 0.995;
        stickman.angle += stickman.angularVelocity;
        // 计算新位置
        stickman.x = stickman.anchor.x + stickman.ropeLength * Math.cos(stickman.angle - Math.PI / 2);
        stickman.y = stickman.anchor.y + stickman.ropeLength * Math.sin(stickman.angle - Math.PI / 2);
        // 释放后惯性
        if (!stickman.swinging) {
            stickman.vx = stickman.ropeLength * stickman.angularVelocity * Math.cos(stickman.angle);
            stickman.vy = stickman.ropeLength * stickman.angularVelocity * Math.sin(stickman.angle);
        }
    } else {
        // 自由落体
        stickman.vy += 0.5;
        stickman.x += stickman.vx;
        stickman.y += stickman.vy;
    }
    // 边界检测
    if (stickman.x < stickman.radius) stickman.x = stickman.radius;
    if (stickman.x > gameCanvas.width - stickman.radius) stickman.x = gameCanvas.width - stickman.radius;
    if (stickman.y > gameCanvas.height - stickman.radius) {
        stickman.y = gameCanvas.height - stickman.radius;
        stickman.vy = 0;
        failGame();
    }
    // 障碍物碰撞
    for (const obs of levelData[level].obstacles) {
        if (stickman.x + stickman.radius > obs.x && stickman.x - stickman.radius < obs.x + obs.w &&
            stickman.y + stickman.radius > obs.y && stickman.y - stickman.radius < obs.y + obs.h) {
            failGame();
        }
    }
    // 目标物判定
    const target = levelData[level].target;
    const dx = stickman.x - target.x;
    const dy = stickman.y - target.y;
    if (Math.sqrt(dx * dx + dy * dy) < stickman.radius + target.r) {
        stickman.cleared = true;
        progress = 1;
        clearGame();
    } else {
        // 进度条
        progress = Math.max(progress, 1 - (stickman.y - target.y) / (gameCanvas.height - target.y));
    }
}

// 绘制火柴人和平台
function drawCharacterDemo() {
    const demoDiv = document.getElementById('character-demo');
    demoDiv.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 120;
    demoDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    // 平台
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.lineTo(120, 100);
    ctx.arc(120, 112, 12, -Math.PI/2, Math.PI/2, false);
    ctx.lineTo(20, 112);
    ctx.arc(20, 112, 12, Math.PI/2, -Math.PI/2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    // 棋盘格
    for(let i=0;i<10;i++){
        ctx.fillStyle = i%2===0?'#fff':'#000';
        ctx.fillRect(20+i*10,100,10,12);
    }
    ctx.restore();
    // 平台外描边
    ctx.save();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.lineTo(120, 100);
    ctx.arc(120, 112, 12, -Math.PI/2, Math.PI/2, false);
    ctx.lineTo(20, 112);
    ctx.arc(20, 112, 12, Math.PI/2, -Math.PI/2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    // 火柴人
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#2196F3';
    // 身体
    ctx.beginPath();
    ctx.moveTo(70, 60);
    ctx.lineTo(70, 90);
    ctx.stroke();
    // 头
    ctx.beginPath();
    ctx.arc(70, 48, 18, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
    // 高光
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(78, 42, 5, 0, 2*Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    // 手臂
    ctx.beginPath();
    ctx.moveTo(70, 65);
    ctx.lineTo(40, 40);
    ctx.moveTo(70, 65);
    ctx.lineTo(100, 40);
    ctx.stroke();
    // 腿
    ctx.beginPath();
    ctx.moveTo(70, 90);
    ctx.lineTo(45, 110);
    ctx.moveTo(70, 90);
    ctx.lineTo(95, 110);
    ctx.stroke();
    ctx.restore();
}
drawCharacterDemo();

function failGame() {
    gameState = 'failed';
    cancelAnimationFrame(animationId);
    setTimeout(() => {
        alert('失败了，再试一次！');
        window.location.reload();
    }, 1200);
}
function clearGame() {
    gameState = 'cleared';
    cancelAnimationFrame(animationId);
    setTimeout(() => {
        alert('恭喜通关！');
        window.location.reload();
    }, 1200);
} 

/* 
// 以下是示例代码，已注释掉以避免变量重复声明
// 1. 定义障碍物和节点数据
const obstacles = [
  { x: 400, y: 200, width: 20, height: 120, color: 'black' },
  { x: 400, y: 340, width: 20, height: 120, color: 'white' },
  // ... 依次生成5组，每组2-3根竖条，交替黑白
];
const nodes = [
  { x: 200, y: 120 }, // 第一锚点
  { x: 600, y: 120 }, // 第二锚点
  // ... 共5个节点
];
const finishLine = { x: 1200, y: 100, width: 30, height: 200 };

// 2. 绘制障碍物、节点、终点
function drawObstacles(ctx, cameraX) {
  for (let obs of obstacles) {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x - cameraX, obs.y, obs.width, obs.height);
    // 可加圆角和阴影
  }
}
function drawNodes(ctx, cameraX) {
  for (let node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x - cameraX, node.y, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#3A8DFF';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    // 可加黄色光圈
  }
}
function drawFinishLine(ctx, cameraX) {
  // 画黑白格子竖条
  for (let i = 0; i < finishLine.height / 20; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
    ctx.fillRect(finishLine.x - cameraX, finishLine.y + i * 20, finishLine.width, 20);
  }
}

// 3. 相机跟随
let cameraX = Math.max(0, stickman.x - 100);

// 4. 绳索发射与摆动
// 鼠标点击节点时，stickman.anchorPoint = node; stickman.isSwinging = true;
// 绳索绘制：ctx.moveTo(node.x - cameraX, node.y); ctx.lineTo(stickman.x - cameraX, stickman.y); 
*/ 