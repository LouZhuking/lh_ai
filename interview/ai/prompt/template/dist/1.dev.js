"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PromptTemplate =
/*#__PURE__*/
function () {
  function PromptTemplate(template) {
    _classCallCheck(this, PromptTemplate);

    this.template = template;
  }

  _createClass(PromptTemplate, [{
    key: "format",
    value: function format(variables) {
      var result = this.template;

      for (var _i = 0, _Object$entries = Object.entries(variables); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        result = result.replace(new RegExp("{".concat(key, "}"), "g"), value);
      }

      return result;
    }
  }]);

  return PromptTemplate;
}();

var tourismTemplate = new PromptTemplate("\n    \u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u65C5\u6E38\u987E\u95EE\u3002\n    \u8BF7\u5E2E\u7528\u6237\u89C4\u5212\u5728{city}\u7684{days}\u5929\u65C5\u6E38\u884C\u7A0B\u3002\n    \u8981\u6C42\uFF1A\u7A81\u51FA{preference},\u5E76\u7ED9\u51FA\u6BCF\u5929\u7684\u8BE6\u7EC6\u5B89\u6392\u3002\n");
var userInput = {
  city: "西安",
  days: "3",
  preference: "历史文化"
};
var finalPrompt = tourismTemplate.format(userInput);
console.log(finalPrompt);