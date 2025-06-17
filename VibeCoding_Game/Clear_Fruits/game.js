 // 游戏配置
const gameConfig = {
  rows: 10,              // 默认行数
  cols: 10,              // 默认列数
  timeLimit: 180,        // 游戏时间限制（秒）
  fruitTypes: [
      '🍓', '🍉', '🍇', '🍐', '🍌', '🍋', '🍎', '🍊', '🥝', '🍒'
  ],
  fruitImages: [
      './images/strawberry.png',   // 草莓
      './images/watermelon.png',   // 西瓜
      './images/grape.png',        // 葡萄
      './images/pear.png',         // 梨
      './images/banana.png',       // 香蕉
      './images/lemon.png',        // 柠檬
      './images/apple.png',        // 苹果
      './images/orange.png',       // 橙子
      './images/kiwi.png',         // 猕猴桃
      './images/cherry.png'        // 樱桃
  ],
  soundEffects: {
      click: new Audio('click.mp3'),
      match: new Audio('match.mp3'),
      gameOver: new Audio('game-over.mp3'),
      gameWin: new Audio('win.mp3'),
      background: new Audio('background.mp3')
  },
  pointsPerMatch: 10     // 每次匹配获得的分数
};

// 游戏状态
let gameState = {
  board: [],             // 游戏板状态
  score: 0,              // 当前得分
  timeLeft: 0,           // 剩余时间
  timer: null,           // 计时器
  firstSelected: null,   // 第一次选中的方块
  secondSelected: null,  // 第二次选中的方块
  soundEnabled: true,    // 音效是否开启
  isPlaying: false,      // 游戏是否正在进行
  matchedPairs: 0,       // 已匹配的对数
  totalPairs: 0          // 总对数
};

// DOM 元素
const elements = {
  gameBoard: document.getElementById('game-board'),
  scoreDisplay: document.getElementById('score'),
  timeLeftDisplay: document.getElementById('time-left'),
  startBtn: document.getElementById('start-btn'),
  volumeBtn: document.getElementById('volume-btn'),
  volumeSlider: document.getElementById('volume-slider'),
  soundToggle: document.getElementById('sound-toggle'),
  rulesBtn: document.getElementById('rules-btn'),
  rulesModal: document.getElementById('rules-modal'),
  closeRulesBtn: document.querySelector('.close'),
  gameOverModal: document.getElementById('game-over-modal'),
  gameOverTitle: document.getElementById('game-over-title'),
  finalScoreDisplay: document.getElementById('final-score'),
  replayBtn: document.getElementById('replay-btn'),
  progressBar: document.getElementById('progress-bar')
};

// 初始化游戏
function initGame() {
  // 重置游戏状态
  gameState.board = [];
  gameState.score = 0;
  gameState.timeLeft = gameConfig.timeLimit;
  gameState.firstSelected = null;
  gameState.secondSelected = null;
  gameState.isPlaying = false;
  gameState.matchedPairs = 0;
  
  // 更新显示
  elements.scoreDisplay.textContent = '0';
  updateTimeDisplay();
  elements.progressBar.style.width = '0%';
  
  // 设置游戏板大小
  setGameBoardSize();
  
  // 创建游戏板
  createGameBoard();
  
  // 更新按钮状态
  elements.startBtn.textContent = '开始游戏';
}

// 设置游戏板大小
function setGameBoardSize() {
  // 根据屏幕宽度调整游戏板大小
  if (window.innerWidth <= 480) {
      gameConfig.rows = 6;
      gameConfig.cols = 6;
  } else if (window.innerWidth <= 768) {
      gameConfig.rows = 8;
      gameConfig.cols = 8;
  } else {
      gameConfig.rows = 10;
      gameConfig.cols = 10;
  }
  
  // 更新CSS Grid
  elements.gameBoard.style.gridTemplateRows = `repeat(${gameConfig.rows}, 1fr)`;
  elements.gameBoard.style.gridTemplateColumns = `repeat(${gameConfig.cols}, 1fr)`;
}

// 创建游戏板
function createGameBoard() {
  // 清空游戏板
  elements.gameBoard.innerHTML = '';
  
  // 创建水果数组（每种水果出现偶数次）
  const fruits = [];
  const totalCells = gameConfig.rows * gameConfig.cols;
  
  // 确保总数是偶数
  const adjustedTotal = totalCells - (totalCells % 2);
  gameState.totalPairs = adjustedTotal / 2;
  
  // 创建成对的水果
  for (let i = 0; i < adjustedTotal / 2; i++) {
      const fruitIndex = i % gameConfig.fruitTypes.length;
      fruits.push(fruitIndex);
      fruits.push(fruitIndex);
  }
  
  // 随机打乱水果数组
  for (let i = fruits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fruits[i], fruits[j]] = [fruits[j], fruits[i]];
  }
  
  // 创建游戏板
  gameState.board = Array(gameConfig.rows).fill().map(() => Array(gameConfig.cols).fill(null));
  let fruitIndex = 0;
  
  // 填充游戏板并创建 DOM 元素
  for (let row = 0; row < gameConfig.rows; row++) {
      for (let col = 0; col < gameConfig.cols; col++) {
          if (fruitIndex < fruits.length) {
              // 创建水果元素
              const fruitCell = document.createElement('div');
              fruitCell.className = 'fruit-cell';
              fruitCell.dataset.row = row;
              fruitCell.dataset.col = col;
              
              // 创建水果图片
              const fruitImg = document.createElement('img');
              fruitImg.className = 'fruit-img';
              fruitImg.src = gameConfig.fruitImages[fruits[fruitIndex]];
              fruitImg.alt = gameConfig.fruitTypes[fruits[fruitIndex]];
              
              // 设置游戏板状态
              gameState.board[row][col] = {
                  type: fruits[fruitIndex],
                  matched: false,
                  element: fruitCell
              };
              
              // 添加点击事件
              fruitCell.addEventListener('click', () => handleCellClick(row, col));
              
              // 将图片添加到方块中
              fruitCell.appendChild(fruitImg);
              
              // 将方块添加到游戏板
              elements.gameBoard.appendChild(fruitCell);
              
              fruitIndex++;
          }
      }
  }
}

// 处理方块点击事件
function handleCellClick(row, col) {
  // 检查游戏是否正在进行
  if (!gameState.isPlaying) return;
  
  // 获取点击的方块
  const cell = gameState.board[row][col];
  
  // 如果方块已匹配或者已选中，则忽略
  if (cell.matched || 
      (gameState.firstSelected && gameState.firstSelected.row === row && gameState.firstSelected.col === col)) {
      return;
  }
  
  // 播放点击音效
  playSound('click');
  
  // 如果是第一次选中
  if (!gameState.firstSelected) {
      gameState.firstSelected = { row, col, type: cell.type };
      cell.element.classList.add('selected');
  } 
  // 如果是第二次选中
  else if (!gameState.secondSelected) {
      gameState.secondSelected = { row, col, type: cell.type };
      cell.element.classList.add('selected');
      
      // 检查是否匹配
      checkMatch();
  }
}

// 检查两个选中的方块是否匹配
function checkMatch() {
  const first = gameState.firstSelected;
  const second = gameState.secondSelected;
  
  // 如果两个方块的类型相同
  if (first.type === second.type) {
      // 检查是否可以连接
      if (canConnect(first.row, first.col, second.row, second.col)) {
          // 匹配成功
          matchCells();
      } else {
          // 不能连接，重置选择
          resetSelection();
      }
  } else {
      // 类型不同，重置选择
      resetSelection();
  }
}

// 判断两个方块是否可以通过不超过三条直线连接
function canConnect(row1, col1, row2, col2) {
  // 如果是同一个方块，不能连接
  if (row1 === row2 && col1 === col2) return false;
  
  // 直接连接（水平或垂直直线）
  if (directConnect(row1, col1, row2, col2)) {
      return true;
  }
  
  // 一次转弯连接
  if (oneCornerConnect(row1, col1, row2, col2)) {
      return true;
  }
  
  // 两次转弯连接
  if (twoCornerConnect(row1, col1, row2, col2)) {
      return true;
  }
  
  return false;
}

// 检查是否可以直接连接（水平或垂直直线）
function directConnect(row1, col1, row2, col2) {
  // 检查水平连接
  if (row1 === row2) {
      const minCol = Math.min(col1, col2);
      const maxCol = Math.max(col1, col2);
      
      // 检查中间是否有障碍
      for (let col = minCol + 1; col < maxCol; col++) {
          if (!gameState.board[row1][col].matched) {
              return false;
          }
      }
      return true;
  }
  
  // 检查垂直连接
  if (col1 === col2) {
      const minRow = Math.min(row1, row2);
      const maxRow = Math.max(row1, row2);
      
      // 检查中间是否有障碍
      for (let row = minRow + 1; row < maxRow; row++) {
          if (!gameState.board[row][col1].matched) {
              return false;
          }
      }
      return true;
  }
  
  return false;
}

// 检查是否可以通过一次转弯连接
function oneCornerConnect(row1, col1, row2, col2) {
  // 检查 (row1, col1) -> (row1, col2) -> (row2, col2) 的连接
  if (isEmptyCell(row1, col2) && 
      directConnect(row1, col1, row1, col2) && 
      directConnect(row1, col2, row2, col2)) {
      return true;
  }
  
  // 检查 (row1, col1) -> (row2, col1) -> (row2, col2) 的连接
  if (isEmptyCell(row2, col1) && 
      directConnect(row1, col1, row2, col1) && 
      directConnect(row2, col1, row2, col2)) {
      return true;
  }
  
  return false;
}

// 检查是否可以通过两次转弯连接
function twoCornerConnect(row1, col1, row2, col2) {
  // 水平方向检查
  for (let col = 0; col < gameConfig.cols; col++) {
      // 跳过原始列
      if (col === col1 || col === col2) continue;
      
      // 检查两个拐点是否为空
      if (isEmptyCell(row1, col) && isEmptyCell(row2, col)) {
          // 检查连接
          if (directConnect(row1, col1, row1, col) && 
              directConnect(row1, col, row2, col) && 
              directConnect(row2, col, row2, col2)) {
              return true;
          }
      }
  }
  
  // 垂直方向检查
  for (let row = 0; row < gameConfig.rows; row++) {
      // 跳过原始行
      if (row === row1 || row === row2) continue;
      
      // 检查两个拐点是否为空
      if (isEmptyCell(row, col1) && isEmptyCell(row, col2)) {
          // 检查连接
          if (directConnect(row1, col1, row, col1) && 
              directConnect(row, col1, row, col2) && 
              directConnect(row, col2, row2, col2)) {
              return true;
          }
      }
  }
  
  return false;
}

// 检查单元格是否为空（已匹配或超出边界）
function isEmptyCell(row, col) {
  // 检查是否超出边界
  if (row < 0 || row >= gameConfig.rows || col < 0 || col >= gameConfig.cols) {
      return true;
  }
  
  // 检查是否已匹配
  return gameState.board[row][col].matched;
}

// 匹配成功的处理
function matchCells() {
  const first = gameState.firstSelected;
  const second = gameState.secondSelected;
  
  // 标记为已匹配
  gameState.board[first.row][first.col].matched = true;
  gameState.board[second.row][second.col].matched = true;
  
  // 添加匹配效果
  gameState.board[first.row][first.col].element.classList.add('matched');
  gameState.board[second.row][second.col].element.classList.add('matched');
  
  // 更新分数
  gameState.score += gameConfig.pointsPerMatch;
  elements.scoreDisplay.textContent = gameState.score;
  
  // 更新匹配对数和进度条
  gameState.matchedPairs++;
  updateProgressBar();
  
  // 播放匹配音效
  playSound('match');
  
  // 重置选择
  gameState.firstSelected = null;
  gameState.secondSelected = null;
  
  // 检查游戏是否完成
  checkGameCompletion();
}

// 重置选择
function resetSelection() {
  if (gameState.firstSelected) {
      gameState.board[gameState.firstSelected.row][gameState.firstSelected.col].element.classList.remove('selected');
  }
  
  if (gameState.secondSelected) {
      gameState.board[gameState.secondSelected.row][gameState.secondSelected.col].element.classList.remove('selected');
  }
  
  // 重置选择
  gameState.firstSelected = null;
  gameState.secondSelected = null;
}

// 更新进度条
function updateProgressBar() {
  const progress = (gameState.matchedPairs / gameState.totalPairs) * 100;
  elements.progressBar.style.width = `${progress}%`;
}

// 检查游戏是否完成
function checkGameCompletion() {
  if (gameState.matchedPairs >= gameState.totalPairs) {
      // 游戏胜利
      endGame(true);
  }
}

// 开始游戏
function startGame() {
  // 设置游戏状态
  gameState.isPlaying = true;
  gameState.timeLeft = gameConfig.timeLimit;
  gameState.score = 0;
  gameState.matchedPairs = 0;
  
  // 更新显示
  elements.scoreDisplay.textContent = '0';
  updateTimeDisplay();
  elements.progressBar.style.width = '0%';
  
  // 开始计时
  gameState.timer = setInterval(() => {
      gameState.timeLeft--;
      updateTimeDisplay();
      
      // 检查时间是否用完
      if (gameState.timeLeft <= 0) {
          endGame(false);
      }
  }, 1000);
  
  // 更新按钮状态
  elements.startBtn.textContent = '重新开始';
  
  // 播放背景音乐
  if (gameState.soundEnabled) {
      gameConfig.soundEffects.background.loop = true;
      gameConfig.soundEffects.background.play();
  }
}

// 结束游戏
function endGame(isWin) {
  // 停止计时
  clearInterval(gameState.timer);
  
  // 更新游戏状态
  gameState.isPlaying = false;
  
  // 停止背景音乐
  gameConfig.soundEffects.background.pause();
  gameConfig.soundEffects.background.currentTime = 0;
  
  // 播放游戏结束音效
  playSound(isWin ? 'gameWin' : 'gameOver');
  
  // 显示游戏结束模态框
  elements.gameOverTitle.textContent = isWin ? '恭喜你赢了！' : '游戏结束';
  elements.finalScoreDisplay.textContent = gameState.score;
  elements.gameOverModal.style.display = 'flex';
}

// 更新时间显示
function updateTimeDisplay() {
  const minutes = Math.floor(gameState.timeLeft / 60);
  const seconds = gameState.timeLeft % 60;
  elements.timeLeftDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 播放音效
function playSound(soundName) {
  if (gameState.soundEnabled && gameConfig.soundEffects[soundName]) {
      gameConfig.soundEffects[soundName].currentTime = 0;
      gameConfig.soundEffects[soundName].play().catch(error => {
          console.log(`Sound play error: ${error}`);
      });
  }
}

// 调整音量
function adjustVolume(volume) {
  Object.values(gameConfig.soundEffects).forEach(sound => {
      sound.volume = volume / 100;
  });
}

// 调整窗口大小时重设游戏板
window.addEventListener('resize', () => {
  if (!gameState.isPlaying) {
      setGameBoardSize();
      createGameBoard();
  }
});

// 事件监听器
function setupEventListeners() {
  // 开始/重新开始按钮
  elements.startBtn.addEventListener('click', () => {
      if (gameState.isPlaying) {
          // 如果正在游戏，则重新开始
          clearInterval(gameState.timer);
          initGame();
          startGame();
      } else {
          // 如果没有游戏，则开始游戏
          startGame();
      }
  });
  
  // 音量滑块
  elements.volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value;
      adjustVolume(volume);
  });
  
  // 音效开关
  elements.soundToggle.addEventListener('click', () => {
      gameState.soundEnabled = !gameState.soundEnabled;
      elements.soundToggle.textContent = gameState.soundEnabled ? '音效开关' : '音效关闭';
      
      if (gameState.soundEnabled && gameState.isPlaying) {
          gameConfig.soundEffects.background.play();
      } else {
          gameConfig.soundEffects.background.pause();
      }
  });
  
  // 游戏规则按钮
  elements.rulesBtn.addEventListener('click', () => {
      elements.rulesModal.style.display = 'flex';
  });
  
  // 关闭规则模态框
  elements.closeRulesBtn.addEventListener('click', () => {
      elements.rulesModal.style.display = 'none';
  });
  
  // 再玩一次按钮
  elements.replayBtn.addEventListener('click', () => {
      elements.gameOverModal.style.display = 'none';
      initGame();
      startGame();
  });
  
  // 点击模态框外部关闭
  window.addEventListener('click', (e) => {
      if (e.target === elements.rulesModal) {
          elements.rulesModal.style.display = 'none';
      }
      if (e.target === elements.gameOverModal) {
          elements.gameOverModal.style.display = 'none';
      }
  });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化游戏
  initGame();
  
  // 设置事件监听器
  setupEventListeners();
});