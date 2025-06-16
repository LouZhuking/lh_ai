"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 游戏常量
var GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended'
};
var GRAVITY = 0.2;
var ROPE_LENGTH = 150;
var PLAYER_SIZE = 20;
var ANCHOR_RADIUS = 10;
var TARGET_SIZE = 30;
var GAME_DURATION = 50; // 50秒
// 游戏状态

var gameState = GAME_STATE.MENU;
var currentLevel = 1;
var canvas, ctx;
var player = {
  x: 150,
  y: 450,
  velocityX: 0,
  velocityY: 0,
  onGround: true,
  isSwinging: false,
  ropeAnchor: null
};
var anchors = [];
var platforms = [];
var obstacles = [];
var target = {};
var gameTimer = GAME_DURATION;
var timerInterval;
var lastTime = 0; // DOM元素

var startMenu = document.getElementById('start-menu');
var levelClearedMenu = document.getElementById('level-cleared');
var nextLevelButton = document.getElementById('next-level-button');
var settingsButton = document.querySelector('.settings-btn');
var pauseButton = document.getElementById('pause-button');
var levelProgress = document.getElementById('level-progress');
var currentLevelDisplay = document.getElementById('current-level');
var gameScreen = document.getElementById('game-screen');
var endMenu = document.getElementById('game-over');
var startBtn = document.getElementById('start-button');
var restartBtn = document.getElementById('restart-button');
var menuBtn = document.getElementById('menu-button');
var endMessage = document.getElementById('game-over-title');
var timerDisplay = document.getElementById('timer'); // 初始化游戏

function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d'); // 设置画布尺寸

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas); // 事件监听

  startBtn.addEventListener('click', startGame);
  nextLevelButton.addEventListener('click', nextLevel);
  settingsButton.addEventListener('click', toggleSettings);
  restartBtn.addEventListener('click', restartGame);
  menuBtn.addEventListener('click', function () {
    endMenu.classList.add('hidden');
    startMenu.classList.remove('hidden');
  });
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  pauseButton.addEventListener('click', togglePause); // 加载初始关卡

  createLevel(); // 开始游戏循环

  requestAnimationFrame(gameLoop);
} // 调整画布尺寸


function resizeCanvas() {
  var container = canvas.parentElement;
  canvas.width = Math.min(800, container.clientWidth * 0.9);
  canvas.height = Math.min(600, container.clientHeight * 0.8);
} // 创建关卡


function createLevel() {
  // 更新关卡显示
  currentLevelDisplay.textContent = currentLevel; // 清空现有元素

  anchors = [];
  platforms = [];
  obstacles = []; // 根据当前关卡调整难度

  var difficulty = Math.min(5, currentLevel); // 最大难度为5

  var obstacleCount = 3 + Math.floor(difficulty / 2);
  var anchorCount = 3 + difficulty; // 创建平台（黑白相间，倾斜30°的初始平台）

  platforms.push({
    x1: 50,
    y1: 500,
    x2: 250,
    y2: 450,
    width: 10,
    color: 'black',
    isGround: true
  }); // 创建目标平台

  platforms.push({
    x1: canvas.width - 200,
    y1: 200,
    x2: canvas.width - 100,
    y2: 180,
    width: 10,
    color: 'gold'
  }); // 创建锚点

  anchors = [];

  for (var i = 0; i < anchorCount; i++) {
    anchors.push({
      x: 200 + i * 150,
      y: 150 + Math.sin(i * 0.5) * 100 * (1 - difficulty * 0.1)
    });
  } // 创建障碍物


  obstacles = [];

  for (var _i = 0; _i < obstacleCount; _i++) {
    obstacles.push({
      x: 250 + _i * 120,
      y: 250 + Math.random() * 150 * (1 - difficulty * 0.1),
      width: 60 + Math.random() * 80,
      height: 20
    });
  } // 设置目标


  target = {
    x: canvas.width - 150,
    y: 170,
    size: TARGET_SIZE
  }; // 重置玩家位置

  resetPlayer();
} // 重置玩家


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
} // 开始游戏


function startGame() {
  // 添加开始菜单淡出动画
  startMenu.style.opacity = '0';
  setTimeout(function () {
    startMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden'); // 添加游戏界面淡入动画

    gameScreen.style.opacity = '1';
    gameState = GAME_STATE.PLAYING;
    gameTimer = GAME_DURATION;
    timerDisplay.textContent = gameTimer;
  }, 500); // 启动计时器

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    if (gameState === GAME_STATE.PLAYING) {
      gameTimer--;
      timerDisplay.textContent = gameTimer;

      if (gameTimer <= 0) {
        endGame(false);
      }
    }
  }, 1000);
} // 重新开始游戏


function restartGame() {
  endMenu.classList.add('hidden');
  createLevel();
  startGame();
} // 暂停/继续游戏


function togglePause() {
  if (gameState === GAME_STATE.PLAYING) {
    gameState = GAME_STATE.PAUSED;
  } else if (gameState === GAME_STATE.PAUSED) {
    gameState = GAME_STATE.PLAYING;
  }
} // 结束游戏


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
} // 处理鼠标按下（抓取钩锁）


function handleMouseDown(e) {
  if (gameState !== GAME_STATE.PLAYING) return;
  var rect = canvas.getBoundingClientRect();
  var mouseX = e.clientX - rect.left;
  var mouseY = e.clientY - rect.top; // 检测是否点击到锚点

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = anchors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var anchor = _step.value;
      var dx = mouseX - anchor.x;
      var dy = mouseY - anchor.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ANCHOR_RADIUS) {
        player.isSwinging = true;
        player.ropeAnchor = _objectSpread({}, anchor);
        player.onGround = false;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
} // 处理鼠标释放（释放秋千）


function handleMouseUp(e) {
  if (gameState !== GAME_STATE.PLAYING) return;
  player.isSwinging = false;
  player.ropeAnchor = null;
} // 检测碰撞


function checkCollision() {
  // 检测是否到达目标
  var dx = player.x - target.x;
  var dy = player.y - target.y;

  if (Math.sqrt(dx * dx + dy * dy) < target.size + PLAYER_SIZE) {
    endGame(true);
  } // 检测是否掉落


  if (player.y > canvas.height + PLAYER_SIZE) {
    endGame(false);
  } // 检测平台碰撞


  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = platforms[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var platform = _step2.value;
      // 简化的线段碰撞检测
      var onPlatform = checkLinePointCollision(platform.x1, platform.y1, platform.x2, platform.y2, player.x, player.y, platform.width);

      if (onPlatform && player.velocityY > 0) {
        player.onGround = true;
        player.velocityY = 0; // 设置玩家在平台上的位置

        player.y = platform.y1 - PLAYER_SIZE;
      }
    } // 检测障碍物碰撞

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = obstacles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var obstacle = _step3.value;

      if (player.x + PLAYER_SIZE > obstacle.x && player.x - PLAYER_SIZE < obstacle.x + obstacle.width && player.y + PLAYER_SIZE > obstacle.y && player.y - PLAYER_SIZE < obstacle.y + obstacle.height) {
        endGame(false);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
} // 线段与点碰撞检测


function checkLinePointCollision(x1, y1, x2, y2, px, py, lineWidth) {
  // 实现简化的线段碰撞检测
  var lineLength = Math.hypot(x2 - x1, y2 - y1);
  var dotProduct = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLength * lineLength);
  var closestX = x1 + dotProduct * (x2 - x1);
  var closestY = y1 + dotProduct * (y2 - y1);
  var distance = Math.hypot(px - closestX, py - closestY);
  return distance <= lineWidth / 2 && dotProduct >= 0 && dotProduct <= 1;
} // 更新游戏状态


function update(deltaTime) {
  // 更新进度条
  if (target && player) {
    var progress = Math.min(100, 100 - Math.abs(player.x - target.x) / canvas.width * 100);
    levelProgress.style.width = progress + '%';
  }

  if (gameState !== GAME_STATE.PLAYING) return; // 应用重力

  player.velocityY += GRAVITY; // 处理摆动逻辑

  if (player.isSwinging && player.ropeAnchor) {
    var dx = player.x - player.ropeAnchor.x;
    var dy = player.y - player.ropeAnchor.y;
    var distance = Math.sqrt(dx * dx + dy * dy); // 绳子张力

    if (distance > ROPE_LENGTH) {
      var ratio = ROPE_LENGTH / distance;
      player.x = player.ropeAnchor.x + dx * ratio;
      player.y = player.ropeAnchor.y + dy * ratio; // 计算向心力

      var tensionX = (player.ropeAnchor.x - player.x) / distance;
      var tensionY = (player.ropeAnchor.y - player.y) / distance;
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
  } // 边界检测


  if (player.x < PLAYER_SIZE) player.x = PLAYER_SIZE;
  if (player.x > canvas.width - PLAYER_SIZE) player.x = canvas.width - PLAYER_SIZE; // 碰撞检测

  checkCollision();
} // 绘制游戏


function draw() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 绘制平台

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = platforms[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var platform = _step4.value;
      ctx.beginPath();
      ctx.moveTo(platform.x1, platform.y1);
      ctx.lineTo(platform.x2, platform.y2);
      ctx.lineWidth = platform.width;
      ctx.strokeStyle = platform.color;
      ctx.stroke();
    } // 绘制锚点

  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = anchors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var anchor = _step5.value;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, ANCHOR_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#FF5252';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    } // 绘制障碍物

  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
        _iterator5["return"]();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = obstacles[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var obstacle = _step6.value;
      ctx.fillStyle = '#333';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } // 绘制目标光晕

  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
        _iterator6["return"]();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  ctx.beginPath();
  ctx.arc(target.x, target.y, target.size + 15, 0, Math.PI * 2);
  var gradient = ctx.createRadialGradient(target.x, target.y, target.size, target.x, target.y, target.size + 15);
  gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fill(); // 绘制目标

  ctx.beginPath();
  ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
  ctx.fillStyle = 'gold';
  ctx.fill();
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 3;
  ctx.stroke(); // 绘制轨迹线

  if (player.isSwinging && player.ropeAnchor) {
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  } // 绘制绳子


  if (player.isSwinging && player.ropeAnchor) {
    ctx.beginPath();
    ctx.moveTo(player.ropeAnchor.x, player.ropeAnchor.y);
    ctx.lineTo(player.x, player.y);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.stroke();
  } // 绘制火柴人


  ctx.save();
  ctx.translate(player.x, player.y); // 头部

  ctx.beginPath();
  ctx.arc(0, -PLAYER_SIZE / 2, PLAYER_SIZE / 3, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill(); // 身体

  ctx.beginPath();
  ctx.moveTo(0, -PLAYER_SIZE / 6);
  ctx.lineTo(0, PLAYER_SIZE / 3);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.stroke(); // 手臂

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-PLAYER_SIZE / 3, -PLAYER_SIZE / 6);
  ctx.lineTo(-PLAYER_SIZE / 2, 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(PLAYER_SIZE / 3, -PLAYER_SIZE / 6);
  ctx.lineTo(PLAYER_SIZE / 2, 0);
  ctx.stroke(); // 腿

  ctx.beginPath();
  ctx.moveTo(0, PLAYER_SIZE / 3);
  ctx.lineTo(-PLAYER_SIZE / 3, PLAYER_SIZE);
  ctx.moveTo(0, PLAYER_SIZE / 3);
  ctx.lineTo(PLAYER_SIZE / 3, PLAYER_SIZE);
  ctx.stroke();
  ctx.restore(); // 如果游戏暂停，显示暂停文本

  if (gameState === GAME_STATE.PAUSED) {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
  }
} // 游戏主循环


function gameLoop(timestamp) {
  // 计算时间增量
  var deltaTime = timestamp - lastTime || 0;
  lastTime = timestamp; // 更新和绘制游戏

  update(deltaTime);
  draw(); // 继续游戏循环

  requestAnimationFrame(gameLoop);
} // 当页面加载完成后初始化游戏


window.addEventListener('load', init);