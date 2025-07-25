"use strict";

// 游戏配置
var gameConfig = {
  rows: 10,
  // 默认行数
  cols: 10,
  // 默认列数
  timeLimit: 180,
  // 游戏时间限制（秒）
  fruitTypes: ['🍓', '🍉', '🍇', '🍐', '🍌', '🍋', '🍎', '🍊', '🥝', '🍒'],
  fruitImages: ['https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f353.png', // 草莓
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f349.png', // 西瓜
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f347.png', // 葡萄
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f350.png', // 梨
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34c.png', // 香蕉
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34b.png', // 柠檬
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34e.png', // 苹果
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34a.png', // 橙子
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f95d.png', // 猕猴桃
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f352.png' // 樱桃
  ],
  soundEffects: {
    click: new Audio('click.mp3'),
    match: new Audio('match.mp3'),
    error: new Audio('error.mp3'),
    // 新增错误音效
    gameOver: new Audio('game-over.mp3'),
    gameWin: new Audio('win.mp3'),
    background: new Audio('background.mp3')
  },
  pointsPerMatch: 10 // 每次匹配获得的分数

}; // 游戏状态

var gameState = {
  board: [],
  // 游戏板状态
  score: 0,
  // 当前得分
  timeLeft: 0,
  // 剩余时间
  timer: null,
  // 计时器
  firstSelected: null,
  // 第一次选中的方块
  secondSelected: null,
  // 第二次选中的方块
  soundEnabled: true,
  // 音效是否开启
  isPlaying: false,
  // 游戏是否正在进行
  matchedPairs: 0,
  // 已匹配的对数
  totalPairs: 0 // 总对数

}; // DOM 元素

var elements = {
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
}; // 首页弹窗相关

var startModal = document.getElementById('start-modal');
var modeBtns = document.querySelectorAll('.mode-btn');
var startGameBtn = document.getElementById('start-game-btn');
var gameContainer = document.querySelector('.game-container'); // 模式配置

var modeConfig = {
  easy: {
    rows: 8,
    cols: 8,
    timeLimit: 180
  },
  normal: {
    rows: 10,
    cols: 10,
    timeLimit: 150
  },
  hard: {
    rows: 12,
    cols: 12,
    timeLimit: 120
  }
};
var selectedMode = 'easy';

function showStartModal() {
  startModal.style.display = 'flex';
  gameContainer.style.display = 'none';
}

function hideStartModal() {
  startModal.style.display = 'none';
  gameContainer.style.display = '';
} // 模式按钮选中逻辑


modeBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    modeBtns.forEach(function (b) {
      return b.classList.remove('selected');
    });
    btn.classList.add('selected');
    selectedMode = btn.getAttribute('data-mode');
  });
}); // 默认选中简单模式

modeBtns.forEach(function (btn) {
  if (btn.getAttribute('data-mode') === selectedMode) btn.classList.add('selected');
}); // 点击"开始游戏"按钮

startGameBtn.addEventListener('click', function () {
  // 根据模式设置参数
  var config = modeConfig[selectedMode];
  gameConfig.rows = config.rows;
  gameConfig.cols = config.cols;
  gameConfig.timeLimit = config.timeLimit;
  hideStartModal();
  initGame();
  startGame();
}); // 页面加载时只显示首页弹窗

showStartModal(); // 初始化游戏

function initGame() {
  // 重置游戏状态
  gameState.board = [];
  gameState.score = 0;
  gameState.timeLeft = gameConfig.timeLimit;
  gameState.firstSelected = null;
  gameState.secondSelected = null;
  gameState.isPlaying = false;
  gameState.matchedPairs = 0; // 更新显示

  elements.scoreDisplay.textContent = '0';
  updateTimeDisplay();
  elements.progressBar.style.width = '0%'; // 设置游戏板大小

  setGameBoardSize(); // 创建游戏板

  createGameBoardWithBorder(); // 更新按钮状态

  elements.startBtn.textContent = '开始游戏';
} // 设置游戏板大小


function setGameBoardSize() {
  // 直接根据当前gameConfig.rows和gameConfig.cols设置，不再根据屏幕宽度覆盖
  elements.gameBoard.style.gridTemplateRows = "repeat(".concat(gameConfig.rows, ", 1fr)");
  elements.gameBoard.style.gridTemplateColumns = "repeat(".concat(gameConfig.cols, ", 1fr)");
} // 辅助：生成带边界的棋盘


function createGameBoardWithBorder() {
  // 清空游戏板
  elements.gameBoard.innerHTML = ''; // 生成带边界的棋盘，外围多一圈空白格

  var rows = gameConfig.rows + 2;
  var cols = gameConfig.cols + 2;
  gameState.board = Array(rows).fill().map(function () {
    return Array(cols).fill(null);
  }); // 创建水果数组（每种水果出现偶数次）

  var fruits = [];
  var totalCells = gameConfig.rows * gameConfig.cols;
  var adjustedTotal = totalCells - totalCells % 2;
  gameState.totalPairs = adjustedTotal / 2;

  for (var i = 0; i < adjustedTotal / 2; i++) {
    var _fruitIndex = i % gameConfig.fruitTypes.length;

    fruits.push(_fruitIndex);
    fruits.push(_fruitIndex);
  } // 随机打乱


  for (var _i = fruits.length - 1; _i > 0; _i--) {
    var j = Math.floor(Math.random() * (_i + 1));
    var _ref = [fruits[j], fruits[_i]];
    fruits[_i] = _ref[0];
    fruits[j] = _ref[1];
  }

  var fruitIndex = 0;

  var _loop = function _loop(row) {
    var _loop2 = function _loop2(_col) {
      if (fruitIndex < fruits.length) {
        var fruitCell = document.createElement('div');
        fruitCell.className = 'fruit-cell';
        fruitCell.dataset.row = row;
        fruitCell.dataset.col = _col;
        var fruitImg = document.createElement('img');
        fruitImg.className = 'fruit-img';
        fruitImg.src = gameConfig.fruitImages[fruits[fruitIndex]];
        fruitImg.alt = gameConfig.fruitTypes[fruits[fruitIndex]];
        gameState.board[row][_col] = {
          type: fruits[fruitIndex],
          matched: false,
          element: fruitCell
        };
        fruitCell.addEventListener('click', function () {
          return handleCellClick(row, _col);
        });
        fruitCell.appendChild(fruitImg);
        elements.gameBoard.appendChild(fruitCell);
        fruitIndex++;
      }
    };

    for (var _col = 1; _col <= gameConfig.cols; _col++) {
      _loop2(_col);
    }
  };

  for (var row = 1; row <= gameConfig.rows; row++) {
    _loop(row);
  } // 边界格子设为已匹配（空格）


  for (var _row = 0; _row < rows; _row++) {
    for (var col = 0; col < cols; col++) {
      if (_row === 0 || _row === rows - 1 || col === 0 || col === cols - 1) {
        gameState.board[_row][col] = {
          matched: true,
          type: null,
          element: null
        };
      }
    }
  }
} // 处理方块点击事件


function handleCellClick(row, col) {
  // 检查游戏是否正在进行
  if (!gameState.isPlaying) return; // 获取点击的方块

  var cell = gameState.board[row][col]; // 如果方块已匹配或者已选中，则忽略

  if (cell.matched || gameState.firstSelected && gameState.firstSelected.row === row && gameState.firstSelected.col === col) {
    return;
  } // 播放点击音效


  playSound('click'); // 如果是第一次选中

  if (!gameState.firstSelected) {
    gameState.firstSelected = {
      row: row,
      col: col,
      type: cell.type
    };
    cell.element.classList.add('selected');
  } // 如果是第二次选中
  else if (!gameState.secondSelected) {
      gameState.secondSelected = {
        row: row,
        col: col,
        type: cell.type
      };
      cell.element.classList.add('selected'); // 检查是否匹配

      checkMatch();
    }
} // 检查两个选中的方块是否匹配


function checkMatch() {
  var first = gameState.firstSelected;
  var second = gameState.secondSelected; // 如果两个方块的类型相同

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
} // 判断两个方块是否可以通过不超过三条直线连接，支持跨界消除


function canConnect(row1, col1, row2, col2) {
  // 处理跨界连接
  if (isCrossingRightBoundary(row1, col1, row2, col2) || isCrossingBottomBoundary(row1, col1, row2, col2) || isCrossingRightWithGap(row1, col1, row2, col2) || isCrossingBottomWithGap(row1, col1, row2, col2) || isSameRightBoundary(row1, col1, row2, col2) || isSameBottomBoundary(row1, col1, row2, col2)) {
    return true;
  } // 如果是同一个方块，不能连接


  if (row1 === row2 && col1 === col2) return false; // 直接连接（水平或垂直直线）

  if (directConnect(row1, col1, row2, col2)) {
    return true;
  } // 一次转弯连接


  if (oneCornerConnect(row1, col1, row2, col2)) {
    return true;
  } // 两次转弯连接


  if (twoCornerConnect(row1, col1, row2, col2)) {
    return true;
  }

  return false;
} // 检查是否可以直接连接（水平或垂直直线）


function directConnect(row1, col1, row2, col2) {
  // 检查水平连接
  if (row1 === row2) {
    var minCol = Math.min(col1, col2);
    var maxCol = Math.max(col1, col2); // 检查中间是否有障碍

    for (var col = minCol + 1; col < maxCol; col++) {
      if (!gameState.board[row1][col].matched) {
        return false;
      }
    }

    return true;
  } // 检查垂直连接


  if (col1 === col2) {
    var minRow = Math.min(row1, row2);
    var maxRow = Math.max(row1, row2); // 检查中间是否有障碍

    for (var row = minRow + 1; row < maxRow; row++) {
      if (!gameState.board[row][col1].matched) {
        return false;
      }
    }

    return true;
  }

  return false;
} // 检查是否可以通过一次转弯连接


function oneCornerConnect(row1, col1, row2, col2) {
  // 检查 (row1, col1) -> (row1, col2) -> (row2, col2) 的连接
  if (isEmptyCell(row1, col2) && directConnect(row1, col1, row1, col2) && directConnect(row1, col2, row2, col2)) {
    return true;
  } // 检查 (row1, col1) -> (row2, col1) -> (row2, col2) 的连接


  if (isEmptyCell(row2, col1) && directConnect(row1, col1, row2, col1) && directConnect(row2, col1, row2, col2)) {
    return true;
  }

  return false;
} // 检查是否跨界右边界连接


function isCrossingRightBoundary(row1, col1, row2, col2) {
  // 检查两个点是否在同一行
  if (row1 === row2) {
    // 确保类型相同
    if (gameState.board[row1][col1] && gameState.board[row2][col2] && gameState.board[row1][col1].type === gameState.board[row2][col2].type) {
      // 检查一个是最右列，一个是最左列
      var isCol1Right = col1 === gameConfig.cols;
      var isCol2Right = col2 === gameConfig.cols;
      var isCol1Left = col1 === 1;
      var isCol2Left = col2 === 1; // 一个在最右，一个在最左

      return isCol1Right && isCol2Left || isCol1Left && isCol2Right;
    }
  }

  return false;
} // 检查是否跨界下边界连接


function isCrossingBottomBoundary(row1, col1, row2, col2) {
  // 检查两个点是否在同一列
  if (col1 === col2) {
    // 确保类型相同
    if (gameState.board[row1][col1] && gameState.board[row2][col2] && gameState.board[row1][col1].type === gameState.board[row2][col2].type) {
      // 检查一个是最下行，一个是最上行
      var isRow1Bottom = row1 === gameConfig.rows;
      var isRow2Bottom = row2 === gameConfig.rows;
      var isRow1Top = row1 === 1;
      var isRow2Top = row2 === 1; // 一个在最下，一个在最上

      return isRow1Bottom && isRow2Top || isRow1Top && isRow2Bottom;
    }
  }

  return false;
} // 检查是否可以通过两次转弯连接


function twoCornerConnect(row1, col1, row2, col2) {
  // 水平方向检查
  for (var col = 0; col < gameConfig.cols; col++) {
    // 跳过原始列
    if (col === col1 || col === col2) continue; // 检查两个拐点是否为空

    if (isEmptyCell(row1, col) && isEmptyCell(row2, col)) {
      // 检查连接
      if (directConnect(row1, col1, row1, col) && directConnect(row1, col, row2, col) && directConnect(row2, col, row2, col2)) {
        return true;
      }
    }
  } // 垂直方向检查


  for (var row = 0; row < gameConfig.rows; row++) {
    // 跳过原始行
    if (row === row1 || row === row2) continue; // 检查两个拐点是否为空

    if (isEmptyCell(row, col1) && isEmptyCell(row, col2)) {
      // 检查连接
      if (directConnect(row1, col1, row, col1) && directConnect(row, col1, row, col2) && directConnect(row, col2, row2, col2)) {
        return true;
      }
    }
  }

  return false;
} // 检查单元格是否为空（已匹配或超出边界）


function isEmptyCell(row, col) {
  if (!gameState.board[row] || !gameState.board[row][col]) return true;
  return gameState.board[row][col].matched;
} // 匹配成功的处理


function matchCells() {
  var first = gameState.firstSelected;
  var second = gameState.secondSelected; // 标记为已匹配

  gameState.board[first.row][first.col].matched = true;
  gameState.board[second.row][second.col].matched = true; // 添加匹配效果

  gameState.board[first.row][first.col].element.classList.add('matched');
  gameState.board[second.row][second.col].element.classList.add('matched'); // 更新分数

  gameState.score += gameConfig.pointsPerMatch;
  elements.scoreDisplay.textContent = gameState.score; // 更新匹配对数和进度条

  gameState.matchedPairs++;
  updateProgressBar(); // 播放匹配音效

  playSound('match'); // 重置选择

  gameState.firstSelected = null;
  gameState.secondSelected = null; // 检查游戏是否完成

  checkGameCompletion();
} // 重置选择


function resetSelection() {
  // 如果有两个选中的水果但无法消除，扣除2秒时间
  if (gameState.firstSelected && gameState.secondSelected) {
    // 扣除时间
    gameState.timeLeft = Math.max(0, gameState.timeLeft - 2);
    updateTimeDisplay(); // 闪烁效果提示玩家

    var firstCell = gameState.board[gameState.firstSelected.row][gameState.firstSelected.col].element;
    var secondCell = gameState.board[gameState.secondSelected.row][gameState.secondSelected.col].element; // 添加错误提示类

    firstCell.classList.add('mismatch');
    secondCell.classList.add('mismatch'); // 播放错误音效（如果有）

    if (gameConfig.soundEffects.error) {
      playSound('error');
    } // 0.5秒后移除错误提示类


    setTimeout(function () {
      firstCell.classList.remove('mismatch');
      secondCell.classList.remove('mismatch');
    }, 500);
  }

  if (gameState.firstSelected) {
    gameState.board[gameState.firstSelected.row][gameState.firstSelected.col].element.classList.remove('selected');
  }

  if (gameState.secondSelected) {
    gameState.board[gameState.secondSelected.row][gameState.secondSelected.col].element.classList.remove('selected');
  } // 重置选择


  gameState.firstSelected = null;
  gameState.secondSelected = null;
} // 更新进度条


function updateProgressBar() {
  var progress = gameState.matchedPairs / gameState.totalPairs * 100;
  elements.progressBar.style.width = "".concat(progress, "%");
} // 检查游戏是否完成


function checkGameCompletion() {
  if (gameState.matchedPairs >= gameState.totalPairs) {
    // 游戏胜利
    endGame(true);
  }
} // 开始游戏


function startGame() {
  // 设置游戏状态
  gameState.isPlaying = true;
  gameState.timeLeft = gameConfig.timeLimit;
  gameState.score = 0;
  gameState.matchedPairs = 0; // 更新显示

  elements.scoreDisplay.textContent = '0';
  updateTimeDisplay();
  elements.progressBar.style.width = '0%'; // 开始计时

  gameState.timer = setInterval(function () {
    gameState.timeLeft--;
    updateTimeDisplay(); // 检查时间是否用完

    if (gameState.timeLeft <= 0) {
      endGame(false);
    }
  }, 1000); // 更新按钮状态

  elements.startBtn.textContent = '重新开始'; // 播放背景音乐

  if (gameState.soundEnabled) {
    gameConfig.soundEffects.background.loop = true;
    gameConfig.soundEffects.background.play();
  }
} // 结束游戏


function endGame(isWin) {
  // 停止计时
  clearInterval(gameState.timer); // 更新游戏状态

  gameState.isPlaying = false; // 停止背景音乐

  gameConfig.soundEffects.background.pause();
  gameConfig.soundEffects.background.currentTime = 0; // 播放游戏结束音效

  playSound(isWin ? 'gameWin' : 'gameOver'); // 显示游戏结束模态框

  elements.gameOverTitle.textContent = isWin ? '恭喜你赢了！' : '游戏结束';
  elements.finalScoreDisplay.textContent = gameState.score;
  elements.gameOverModal.style.display = 'flex';
} // 更新时间显示


function updateTimeDisplay() {
  var minutes = Math.floor(gameState.timeLeft / 60);
  var seconds = gameState.timeLeft % 60;
  elements.timeLeftDisplay.textContent = "".concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
} // 播放音效


function playSound(soundName) {
  if (gameState.soundEnabled && gameConfig.soundEffects[soundName]) {
    gameConfig.soundEffects[soundName].currentTime = 0;
    gameConfig.soundEffects[soundName].play()["catch"](function (error) {
      console.log("Sound play error: ".concat(error));
    });
  }
} // 调整音量


function adjustVolume(volume) {
  Object.values(gameConfig.soundEffects).forEach(function (sound) {
    sound.volume = volume / 100;
  });
} // 调整窗口大小时重设游戏板


window.addEventListener('resize', function () {
  if (!gameState.isPlaying) {
    setGameBoardSize();
    createGameBoardWithBorder();
  }
}); // 事件监听器

function setupEventListeners() {
  // 开始/重新开始按钮
  elements.startBtn.addEventListener('click', function () {
    if (gameState.isPlaying) {
      // 如果正在游戏，则重新开始
      clearInterval(gameState.timer);
      initGame();
      startGame();
    } else {
      // 如果没有游戏，则开始游戏
      startGame();
    }
  }); // 音量滑块

  elements.volumeSlider.addEventListener('input', function (e) {
    var volume = e.target.value;
    adjustVolume(volume);
  }); // 音效开关

  elements.soundToggle.addEventListener('click', function () {
    gameState.soundEnabled = !gameState.soundEnabled;
    elements.soundToggle.textContent = gameState.soundEnabled ? '音效开关' : '音效关闭';

    if (gameState.soundEnabled && gameState.isPlaying) {
      gameConfig.soundEffects.background.play();
    } else {
      gameConfig.soundEffects.background.pause();
    }
  }); // 游戏规则按钮

  elements.rulesBtn.addEventListener('click', function () {
    elements.rulesModal.style.display = 'flex';
  }); // 关闭规则模态框

  elements.closeRulesBtn.addEventListener('click', function () {
    elements.rulesModal.style.display = 'none';
  }); // 再玩一次按钮

  elements.replayBtn.addEventListener('click', function () {
    elements.gameOverModal.style.display = 'none';
    showStartModal(); // 显示开始模态框，让玩家重新选择难度
  }); // 点击模态框外部关闭

  window.addEventListener('click', function (e) {
    if (e.target === elements.rulesModal) {
      elements.rulesModal.style.display = 'none';
    }

    if (e.target === elements.gameOverModal) {
      elements.gameOverModal.style.display = 'none';
    }
  });
} // 检查是否跨界右边界连接（间隔一个水果）


function isCrossingRightWithGap(row1, col1, row2, col2) {
  // 检查两个点是否在同一行
  if (row1 === row2) {
    // 确保类型相同
    if (gameState.board[row1][col1] && gameState.board[row2][col2] && gameState.board[row1][col1].type === gameState.board[row2][col2].type) {
      // 右边界的情况：一个在右边，一个在左边
      var isRightSide = col1 >= gameConfig.cols - 1 || col2 >= gameConfig.cols - 1;
      var isLeftSide = col1 <= 2 || col2 <= 2; // 如果一个在右边，一个在左边

      if (isRightSide && isLeftSide) {
        // 检查中间的格子是否都已匹配
        var allPathClear = true; // 检查右侧路径

        if (col1 >= gameConfig.cols - 1) {
          // 从col1到右边界
          for (var c = col1 + 1; c <= gameConfig.cols; c++) {
            if (!isEmptyCell(row1, c)) {
              allPathClear = false;
              break;
            }
          } // 从左边界到col2


          for (var _c = 1; _c < col2; _c++) {
            if (!isEmptyCell(row2, _c)) {
              allPathClear = false;
              break;
            }
          }
        } else {
          // 从col2到右边界
          for (var _c2 = col2 + 1; _c2 <= gameConfig.cols; _c2++) {
            if (!isEmptyCell(row2, _c2)) {
              allPathClear = false;
              break;
            }
          } // 从左边界到col1


          for (var _c3 = 1; _c3 < col1; _c3++) {
            if (!isEmptyCell(row1, _c3)) {
              allPathClear = false;
              break;
            }
          }
        }

        return allPathClear;
      }
    }
  }

  return false;
} // 检查是否跨界下边界连接（间隔一个水果）


function isCrossingBottomWithGap(row1, col1, row2, col2) {
  // 检查两个点是否在同一列
  if (col1 === col2) {
    // 确保类型相同
    if (gameState.board[row1][col1] && gameState.board[row2][col2] && gameState.board[row1][col1].type === gameState.board[row2][col2].type) {
      // 下边界的情况：一个在下边，一个在上边
      var isBottomSide = row1 >= gameConfig.rows - 1 || row2 >= gameConfig.rows - 1;
      var isTopSide = row1 <= 2 || row2 <= 2; // 如果一个在下边，一个在上边

      if (isBottomSide && isTopSide) {
        // 检查中间的格子是否都已匹配
        var allPathClear = true; // 检查下侧路径

        if (row1 >= gameConfig.rows - 1) {
          // 从row1到下边界
          for (var r = row1 + 1; r <= gameConfig.rows; r++) {
            if (!isEmptyCell(r, col1)) {
              allPathClear = false;
              break;
            }
          } // 从上边界到row2


          for (var _r = 1; _r < row2; _r++) {
            if (!isEmptyCell(_r, col2)) {
              allPathClear = false;
              break;
            }
          }
        } else {
          // 从row2到下边界
          for (var _r2 = row2 + 1; _r2 <= gameConfig.rows; _r2++) {
            if (!isEmptyCell(_r2, col2)) {
              allPathClear = false;
              break;
            }
          } // 从上边界到row1


          for (var _r3 = 1; _r3 < row1; _r3++) {
            if (!isEmptyCell(_r3, col1)) {
              allPathClear = false;
              break;
            }
          }
        }

        return allPathClear;
      }
    }
  }

  return false;
} // 检查是否同在右侧边界


function isSameRightBoundary(row1, col1, row2, col2) {
  // 检查两个水果是否都在最右列
  var bothOnRightEdge = col1 === gameConfig.cols && col2 === gameConfig.cols; // 确保类型相同

  if (bothOnRightEdge && gameState.board[row1][col1] && gameState.board[row2][col2] && gameState.board[row1][col1].type === gameState.board[row2][col2].type) {
    return true;
  }

  return false;
} // 检查是否同在下侧边界


function isSameBottomBoundary(row1, col1, row2, col2) {
  // 检查两个水果是否都在最下行
  var bothOnBottomEdge = row1 === gameConfig.rows && row2 === gameConfig.rows; // 确保类型相同

  if (bothOnBottomEdge && gameState.board[row1][col1] && gameState.board[row2][col2] && gameState.board[row1][col1].type === gameState.board[row2][col2].type) {
    return true;
  }

  return false;
} // 初始化


document.addEventListener('DOMContentLoaded', function () {
  // 初始化游戏
  initGame(); // 设置事件监听器

  setupEventListeners();
});