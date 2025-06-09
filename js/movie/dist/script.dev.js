"use strict";

// 配置
// 电影接口地址
var API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
var IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
var SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'; // DOM 编程 原生JS
// 返回的DOM 节点对象

var oForm = document.querySelector('#form');
var oInput = document.querySelector('#search');
console.log(oForm); // 获取电影

var getMovies = function getMovies(keyword) {
  // console.log(keyword);
  var reqUrl = '';

  if (keyword) {
    //搜索
    reqUrl = SEARCH_API + keyword;
  } else {
    reqUrl = API_URL;
  }

  fetch(reqUrl) // 二进制流
  .then(function (res) {
    return res.json();
  }).then(function (data) {
    // console.log(data);
    showMovies(data.results);
  });
}; // movie list render


var showMovies = function showMovies(movies) {
  main.innerHTML = '';
  main.innerHTML = movies.map(function (movie) {
    // es6 解构
    // 右边{ } 解给左侧 {} es6 优雅快捷
    // 立马成为长两个或变量
    var poster_path = movie.poster_path,
        title = movie.title,
        vote_average = movie.vote_average,
        overview = movie.overview;
    return "\n    <div class =\"movie\">\n      <img src = \"".concat(IMG_PATH + poster_path, "\" alt=\"").concat(title, "\">\n      <div class = \"movie-info\">\n        <h3>").concat(title, "</h3>\n        <span>").concat(vote_average, "</span>\n      </div>\n      <div class = \"overview\">\n        <h3>Overview</h3>\n        ").concat(overview, "\n      </div>\n    </div>\n    ");
  }).join('');
}; // 页面加载完成后执行


window.onload = function () {
  getMovies();
};

oForm.addEventListener('submit', function (event) {
  // 事件对象
  console.log(event, '////'); // 输入回车键的时候会默认触发表单的提交

  event.preventDefault();
  var search = oInput.value.trim();

  if (search) {
    // 如何 搜索电影 ？？？ 封装成一个函数 分离调用
    getMovies(search);
  } // 要写搜索类组件  trim 会去除空格 并且将左右空格去除
  //   if(search.trim()){
  //     console.log(search.trim());
  //   }else{
  //     console.log('请输入search');
  //   }
  // }

});