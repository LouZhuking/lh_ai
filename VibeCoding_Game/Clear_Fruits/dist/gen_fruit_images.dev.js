"use strict";

// 需要安装: npm install canvas
var _require = require('canvas'),
    createCanvas = _require.createCanvas,
    registerFont = _require.registerFont;

var fs = require('fs');

var path = require('path'); // 水果emoji和图片文件名


var fruitTypes = ['🍓', '🍉', '🍇', '🍐', '🍌', '🍋', '🍎', '🍊', '🥝', '🍒'];
var fruitImages = ['strawberry.png', // 草莓
'watermelon.png', // 西瓜
'grape.png', // 葡萄
'pear.png', // 梨
'banana.png', // 香蕉
'lemon.png', // 柠檬
'apple.png', // 苹果
'orange.png', // 橙子
'kiwi.png', // 猕猴桃
'cherry.png' // 樱桃
];
var outDir = path.join(__dirname, 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
var size = 128;
var fontSize = 110;
fruitTypes.forEach(function (emoji, idx) {
  var canvas = createCanvas(size, size);
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "".concat(fontSize, "px \"Segoe UI Emoji\", \"Apple Color Emoji\", \"Noto Color Emoji\", sans-serif");
  ctx.fillText(emoji, size / 2, size / 2);
  var outPath = path.join(outDir, fruitImages[idx]);
  var buf = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buf);
  console.log('生成:', outPath);
});