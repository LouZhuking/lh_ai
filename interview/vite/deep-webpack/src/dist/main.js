"use strict";
exports.__esModule = true;
var react_1 = require("react");
var client_1 = require("react-dom/client");
var Hello_tsx_1 = require("./Hello.tsx");
require("./main.css");
client_1.createRoot(document.getElementById('app')).render(react_1["default"].createElement(Hello_tsx_1["default"], null));
