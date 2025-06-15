"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
// 定义求两个Set交集的函数
var set_intersection = function set_intersection(set1, set2) {
  // 优化：总是遍历较小的Set以提高性能
  if (set1.size > set2.size) {
    return set_intersection(set2, set1);
  } // 创建新Set存储交集结果


  var intersection = new Set(); // 遍历set1中的每个元素

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = set1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var num = _step.value;

      // 检查当前元素是否存在于set2中
      if (set2.has(num)) {
        // 如果存在则添加到交集Set中
        intersection.add(num);
      }
    } // 将Set转为数组返回

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

  return _toConsumableArray(intersection);
}; // 主函数：求两个数组的交集


var intersection = function intersection(nums1, nums2) {
  // 将数组转为Set去重
  var set1 = new Set(nums1);
  var set2 = new Set(nums2); // 调用set_intersection函数求交集

  return set_intersection(set1, set2);
};