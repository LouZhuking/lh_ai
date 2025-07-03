"use strict";

// console.log('智能前端，智能后端，笑傲秋招');
var loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function _callee(event) {
  var username, password, response, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          event.preventDefault();
          username = document.getElementById('username').value.trim();
          password = document.getElementById('password').value.trim(); // console.log(username,password);

          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          }));

        case 6:
          response = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          data = _context.sent;
          console.log(data);
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          console.log('出错了');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 13]]);
});
document.getElementById('DOMContentLoaded', function _callee2() {
  var response, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch('/check-login'));

        case 3:
          response = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          data = _context2.sent;
          console.log(data);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.log('出错了');

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});