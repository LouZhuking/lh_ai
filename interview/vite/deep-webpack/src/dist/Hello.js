"use strict";
exports.__esModule = true;
var react_1 = require("react");
var avatar_webp_1 = require("./images/avatar.webp");
var book_webp_1 = require("./images/book.webp");
var Hello = function () {
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        "\u6765\u54AF\u6765\u54AF",
        react_1["default"].createElement("img", { src: avatar_webp_1["default"], alt: "" }),
        react_1["default"].createElement("img", { src: book_webp_1["default"], alt: "" })));
};
exports["default"] = Hello;
