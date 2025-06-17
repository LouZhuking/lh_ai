"use strict";

var addItems = document.querySelector('.add-items'); // form

var itemsList = document.querySelector('.plates'); // 列表

function addItem(e) {
  e.preventDefault();
}

addItems.addEventListener('submit', addItem);