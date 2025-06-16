"use strict";

// 游戏状态
var gameStarted = false;
var gamePaused = false;
var currentLevel = 1;
var score = 0; // 鼠标事件处理

var isMouseDown = false;
var mouseX = 0;
var mouseY = 0; // 获取DOM元素

var menu = document.getElementById('menu');
var gameCanvas = document.getElementById('game-canvas');
var ctx = gameCanvas.getContext('2d');
var startBtn = document.getElementById('start-btn');
var albumBtn = document.getElementById('album-btn');
var settingsBtn = document.getElementById('settings-btn');
var avatarBtn = document.getElementById('avatar-btn');
var pauseBtn = document.getElementById('pause-btn'); // 游戏对象

var stickman = {
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
var platforms = [];
var targets = []; // 关卡数据

var levelData = {
  1: {
    obstacles: [{
      x: 260,
      y: 300,
      w: 18,
      h: 120
    }, {
      x: 60,
      y: 500,
      w: 18,
      h: 80
    }, {
      x: 320,
      y: 80,
      w: 60,
      h: 18
    }, {
      x: 20,
      y: 650,
      w: 60,
      h: 18
    }],
    anchor: {
      x: 80,
      y: 120
    },
    target: {
      x: 340,
      y: 100,
      r: 22
    }
  }
}; // 添加鼠标事件监听器

gameCanvas.addEventListener('mousedown', handleMouseDown);
gameCanvas.addEventListener('mousemove', handleMouseMove);
gameCanvas.addEventListener('mouseup', handleMouseUp); // 开始按钮点击事件

startBtn.onclick = function () {
  if (!gameStarted) {
    startGame();
  }
}; // 开始游戏


function startGame() {
  console.log('游戏开始'); // 隐藏菜单界面

  menu.style.display = 'none'; // 显示游戏界面

  gameCanvas.style.display = 'block'; // 设置画布尺寸

  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight; // 更新游戏状态

  gameStarted = true;
  gamePaused = false; // 初始化游戏对象

  initGameObjects(); // 更新关卡显示

  updateLevelDisplay(); // 开始游戏循环

  requestAnimationFrame(gameLoop);
} // 鼠标按下事件


function handleMouseDown(e) {
  if (!gameStarted || gamePaused) return;
  isMouseDown = true;
  mouseX = e.clientX;
  mouseY = e.clientY; // 检查是否可以抓取锚点

  if (!stickman.isSwinging) {
    var dx = mouseX - stickman.x;
    var dy = mouseY - stickman.y;
    var distance = Math.sqrt(dx * dx + dy * dy); // 如果鼠标在火柴人附近，开始摆荡

    if (distance < 100) {
      stickman.isSwinging = true;
      stickman.anchorPoint = {
        x: mouseX,
        y: mouseY
      };
      stickman.ropeLength = distance;
    }
  }
} // 鼠标移动事件


function handleMouseMove(e) {
  if (!gameStarted || gamePaused) return;
  mouseX = e.clientX;
  mouseY = e.clientY; // 如果正在摆荡，更新锚点位置

  if (isMouseDown && stickman.isSwinging) {
    stickman.anchorPoint = {
      x: mouseX,
      y: mouseY
    };
  }
} // 鼠标释放事件


function handleMouseUp(e) {
  if (!gameStarted || gamePaused) return;
  isMouseDown = false; // 释放摆荡

  if (stickman.isSwinging) {
    stickman.isSwinging = false;
    stickman.anchorPoint = null; // 给予一个初始速度

    var dx = mouseX - stickman.x;
    var dy = mouseY - stickman.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var speed = 0.5;
    stickman.velocityX = dx / distance * speed;
    stickman.velocityY = dy / distance * speed;
  }
} // 初始化游戏对象


function initGameObjects() {
  // 重置火柴人位置
  stickman.x = 100;
  stickman.y = 300;
  stickman.velocityX = 0;
  stickman.velocityY = 0;
  stickman.isSwinging = false;
  stickman.anchorPoint = null;
  stickman.ropeLength = 0; // 清空并初始化平台

  platforms.length = 0;
  platforms.push({
    x: 50,
    y: 400,
    width: 100,
    height: 20
  }); // 清空并初始化目标点

  targets.length = 0;
  targets.push({
    x: 600,
    y: 200,
    radius: 20,
    isReached: false
  });
} // 游戏主循环


function gameLoop() {
  if (!gameStarted || gamePaused) return; // 清空画布

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // 更新游戏状态

  updateGame(); // 绘制游戏元素

  drawGame(); // 继续游戏循环

  requestAnimationFrame(gameLoop);
} // 更新游戏状态


function updateGame() {
  updateStickman();
  checkCollisions();
  checkWinCondition();
} // 更新火柴人状态


function updateStickman() {
  if (stickman.isSwinging) {
    // 计算摆荡物理
    var dx = stickman.x - stickman.anchorPoint.x;
    var dy = stickman.y - stickman.anchorPoint.y;
    var distance = Math.sqrt(dx * dx + dy * dy); // 计算摆荡角度和速度

    var angle = Math.atan2(dy, dx);
    var gravity = 0.5;
    var tension = 0.1; // 更新速度

    stickman.velocityX += Math.cos(angle) * tension;
    stickman.velocityY += gravity; // 更新位置

    stickman.x += stickman.velocityX;
    stickman.y += stickman.velocityY; // 限制摆荡范围

    if (distance > stickman.ropeLength) {
      var ratio = stickman.ropeLength / distance;
      stickman.x = stickman.anchorPoint.x + dx * ratio;
      stickman.y = stickman.anchorPoint.y + dy * ratio;
    }
  } else {
    // 自由落体
    stickman.velocityY += 0.5;
    stickman.y += stickman.velocityY;
  }
} // 检查碰撞


function checkCollisions() {
  // 检查平台碰撞
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = platforms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var platform = _step.value;

      if (stickman.y + stickman.height > platform.y && stickman.y < platform.y + platform.height && stickman.x + stickman.width > platform.x && stickman.x < platform.x + platform.width) {
        stickman.y = platform.y - stickman.height;
        stickman.velocityY = 0;
        stickman.isSwinging = false;
      }
    } // 检查目标点碰撞

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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var target = _step2.value;

      if (!target.isReached) {
        var dx = stickman.x - target.x;
        var dy = stickman.y - target.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < target.radius + stickman.width / 2) {
          target.isReached = true; // 处理目标达成逻辑
        }
      }
    }
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
} // 检查胜利条件


function checkWinCondition() {
  var allTargetsReached = targets.every(function (target) {
    return target.isReached;
  });

  if (allTargetsReached) {
    // 处理胜利逻辑
    currentLevel++;
    updateLevelDisplay();
    resetLevel();
  }
} // 重置关卡


function resetLevel() {
  stickman.x = 100;
  stickman.y = 300;
  stickman.velocityX = 0;
  stickman.velocityY = 0;
  stickman.isSwinging = false;
  stickman.anchorPoint = null; // 重置目标点

  targets.forEach(function (target) {
    target.isReached = false;
  });
} // 绘制平台


function drawPlatforms() {
  ctx.save();
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = platforms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var platform = _step3.value;
      // 绘制平台主体
      ctx.fillStyle = '#fff';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height); // 绘制平台边框

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height); // 绘制棋盘格

      var gridSize = 10;

      for (var x = platform.x; x < platform.x + platform.width; x += gridSize) {
        for (var y = platform.y; y < platform.y + platform.height; y += gridSize) {
          ctx.fillStyle = (x + y) / gridSize % 2 === 0 ? '#fff' : '#000';
          ctx.fillRect(x, y, gridSize, gridSize);
        }
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

  ctx.restore();
} // 绘制目标点


function drawTargets() {
  ctx.save();
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var target = _step4.value;
      // 绘制目标点
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fillStyle = target.isReached ? '#4CAF50' : '#2196F3';
      ctx.fill(); // 绘制光晕效果

      if (!target.isReached) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
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

  ctx.restore();
} // 四角按钮事件


albumBtn.onclick = function () {
  return alert('相册功能暂未开放');
};

settingsBtn.onclick = function () {
  return alert('设置功能暂未开放');
};

avatarBtn.onclick = function () {
  return alert('头像功能暂未开放');
};

pauseBtn.onclick = function () {
  return alert('暂停功能暂未开放');
}; // 只在菜单界面显示LOGO、关卡、火柴人、操场、主按钮


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
} // 修改绘制游戏元素函数


function drawGame() {
  // 绘制背景
  drawBackground(); // 绘制平台

  drawPlatforms(); // 绘制目标点

  drawTargets(); // 绘制火柴人

  drawStickman(); // 如果正在摆荡，绘制绳索

  if (stickman.isSwinging && stickman.anchorPoint) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(stickman.anchorPoint.x, stickman.anchorPoint.y);
    ctx.lineTo(stickman.x, stickman.y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
} // 绘制背景


function drawBackground() {
  // 创建渐变背景
  var gradient = ctx.createLinearGradient(0, 0, 0, gameCanvas.height);
  gradient.addColorStop(0, '#FFABAE');
  gradient.addColorStop(1, '#FEE884'); // 填充背景

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
} // 更新关卡显示


function updateLevelDisplay() {
  var levelDisplay = document.getElementById('level-box');

  if (levelDisplay) {
    levelDisplay.textContent = "LEVEL ".concat(currentLevel);
  }
} // 暂停按钮点击事件


pauseBtn.onclick = function () {
  if (gameStarted) {
    gamePaused = !gamePaused;

    if (!gamePaused) {
      requestAnimationFrame(gameLoop);
    }
  }
};

function drawStickman() {
  ctx.save();
  ctx.translate(stickman.x, stickman.y); // 身体

  ctx.strokeStyle = '#3A8DFF';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 44);
  ctx.stroke(); // 头

  ctx.beginPath();
  ctx.arc(0, -18, 16, 0, 2 * Math.PI);
  ctx.fillStyle = '#3A8DFF';
  ctx.fill(); // 手臂

  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(-22, 32);
  ctx.moveTo(0, 14);
  ctx.lineTo(22, 32);
  ctx.stroke(); // 腿（分开）

  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 44);
  ctx.lineTo(-14, 72);
  ctx.moveTo(0, 44);
  ctx.lineTo(14, 72);
  ctx.stroke();
  ctx.restore();
}

function updatePhysics() {
  // 摆荡物理
  if (stickman.swinging && stickman.anchor) {
    // 角度物理
    var g = 0.25;
    stickman.angularVelocity += -g / stickman.ropeLength * Math.sin(stickman.angle);
    stickman.angularVelocity *= 0.995;
    stickman.angle += stickman.angularVelocity; // 计算新位置

    stickman.x = stickman.anchor.x + stickman.ropeLength * Math.cos(stickman.angle - Math.PI / 2);
    stickman.y = stickman.anchor.y + stickman.ropeLength * Math.sin(stickman.angle - Math.PI / 2); // 释放后惯性

    if (!stickman.swinging) {
      stickman.vx = stickman.ropeLength * stickman.angularVelocity * Math.cos(stickman.angle);
      stickman.vy = stickman.ropeLength * stickman.angularVelocity * Math.sin(stickman.angle);
    }
  } else {
    // 自由落体
    stickman.vy += 0.5;
    stickman.x += stickman.vx;
    stickman.y += stickman.vy;
  } // 边界检测


  if (stickman.x < stickman.radius) stickman.x = stickman.radius;
  if (stickman.x > gameCanvas.width - stickman.radius) stickman.x = gameCanvas.width - stickman.radius;

  if (stickman.y > gameCanvas.height - stickman.radius) {
    stickman.y = gameCanvas.height - stickman.radius;
    stickman.vy = 0;
    failGame();
  } // 障碍物碰撞


  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = levelData[level].obstacles[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var obs = _step5.value;

      if (stickman.x + stickman.radius > obs.x && stickman.x - stickman.radius < obs.x + obs.w && stickman.y + stickman.radius > obs.y && stickman.y - stickman.radius < obs.y + obs.h) {
        failGame();
      }
    } // 目标物判定

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

  var target = levelData[level].target;
  var dx = stickman.x - target.x;
  var dy = stickman.y - target.y;

  if (Math.sqrt(dx * dx + dy * dy) < stickman.radius + target.r) {
    stickman.cleared = true;
    progress = 1;
    clearGame();
  } else {
    // 进度条
    progress = Math.max(progress, 1 - (stickman.y - target.y) / (gameCanvas.height - target.y));
  }
} // 绘制火柴人和平台


function drawCharacterDemo() {
  var demoDiv = document.getElementById('character-demo');
  demoDiv.innerHTML = '';
  var canvas = document.createElement('canvas');
  canvas.width = 140;
  canvas.height = 120;
  demoDiv.appendChild(canvas);
  var ctx = canvas.getContext('2d'); // 平台

  ctx.save();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(20, 100);
  ctx.lineTo(120, 100);
  ctx.arc(120, 112, 12, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(20, 112);
  ctx.arc(20, 112, 12, Math.PI / 2, -Math.PI / 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.clip(); // 棋盘格

  for (var i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
    ctx.fillRect(20 + i * 10, 100, 10, 12);
  }

  ctx.restore(); // 平台外描边

  ctx.save();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(20, 100);
  ctx.lineTo(120, 100);
  ctx.arc(120, 112, 12, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(20, 112);
  ctx.arc(20, 112, 12, Math.PI / 2, -Math.PI / 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.restore(); // 火柴人

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#2196F3'; // 身体

  ctx.beginPath();
  ctx.moveTo(70, 60);
  ctx.lineTo(70, 90);
  ctx.stroke(); // 头

  ctx.beginPath();
  ctx.arc(70, 48, 18, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke(); // 高光

  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(78, 42, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore(); // 手臂

  ctx.beginPath();
  ctx.moveTo(70, 65);
  ctx.lineTo(40, 40);
  ctx.moveTo(70, 65);
  ctx.lineTo(100, 40);
  ctx.stroke(); // 腿

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
  setTimeout(function () {
    alert('失败了，再试一次！');
    window.location.reload();
  }, 1200);
}

function clearGame() {
  gameState = 'cleared';
  cancelAnimationFrame(animationId);
  setTimeout(function () {
    alert('恭喜通关！');
    window.location.reload();
  }, 1200);
} // 1. 定义障碍物和节点数据


var obstacles = [{
  x: 400,
  y: 200,
  width: 20,
  height: 120,
  color: 'black'
}, {
  x: 400,
  y: 340,
  width: 20,
  height: 120,
  color: 'white'
} // ... 依次生成5组，每组2-3根竖条，交替黑白
];
var nodes = [{
  x: 200,
  y: 120
}, // 第一锚点
{
  x: 600,
  y: 120
} // 第二锚点
// ... 共5个节点
];
var finishLine = {
  x: 1200,
  y: 100,
  width: 30,
  height: 200
}; // 2. 绘制障碍物、节点、终点

function drawObstacles(ctx, cameraX) {
  for (var _i = 0, _obstacles = obstacles; _i < _obstacles.length; _i++) {
    var obs = _obstacles[_i];
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x - cameraX, obs.y, obs.width, obs.height); // 可加圆角和阴影
  }
}

function drawNodes(ctx, cameraX) {
  for (var _i2 = 0, _nodes = nodes; _i2 < _nodes.length; _i2++) {
    var node = _nodes[_i2];
    ctx.beginPath();
    ctx.arc(node.x - cameraX, node.y, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#3A8DFF';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0; // 可加黄色光圈
  }
}

function drawFinishLine(ctx, cameraX) {
  // 画黑白格子竖条
  for (var i = 0; i < finishLine.height / 20; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
    ctx.fillRect(finishLine.x - cameraX, finishLine.y + i * 20, finishLine.width, 20);
  }
} // 3. 相机跟随


var cameraX = Math.max(0, stickman.x - 100); // 4. 绳索发射与摆动
// 鼠标点击节点时，stickman.anchorPoint = node; stickman.isSwinging = true;
// 绳索绘制：ctx.moveTo(node.x - cameraX, node.y); ctx.lineTo(stickman.x - cameraX, stickman.y);