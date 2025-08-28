/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/cjs/scheduler.development.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/cjs/scheduler.development.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("{/**\n * @license React\n * scheduler.development.js\n *\n * Copyright (c) Meta Platforms, Inc. and affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n true &&\n  (function () {\n    function performWorkUntilDeadline() {\n      needsPaint = !1;\n      if (isMessageLoopRunning) {\n        var currentTime = exports.unstable_now();\n        startTime = currentTime;\n        var hasMoreWork = !0;\n        try {\n          a: {\n            isHostCallbackScheduled = !1;\n            isHostTimeoutScheduled &&\n              ((isHostTimeoutScheduled = !1),\n              localClearTimeout(taskTimeoutID),\n              (taskTimeoutID = -1));\n            isPerformingWork = !0;\n            var previousPriorityLevel = currentPriorityLevel;\n            try {\n              b: {\n                advanceTimers(currentTime);\n                for (\n                  currentTask = peek(taskQueue);\n                  null !== currentTask &&\n                  !(\n                    currentTask.expirationTime > currentTime &&\n                    shouldYieldToHost()\n                  );\n\n                ) {\n                  var callback = currentTask.callback;\n                  if (\"function\" === typeof callback) {\n                    currentTask.callback = null;\n                    currentPriorityLevel = currentTask.priorityLevel;\n                    var continuationCallback = callback(\n                      currentTask.expirationTime <= currentTime\n                    );\n                    currentTime = exports.unstable_now();\n                    if (\"function\" === typeof continuationCallback) {\n                      currentTask.callback = continuationCallback;\n                      advanceTimers(currentTime);\n                      hasMoreWork = !0;\n                      break b;\n                    }\n                    currentTask === peek(taskQueue) && pop(taskQueue);\n                    advanceTimers(currentTime);\n                  } else pop(taskQueue);\n                  currentTask = peek(taskQueue);\n                }\n                if (null !== currentTask) hasMoreWork = !0;\n                else {\n                  var firstTimer = peek(timerQueue);\n                  null !== firstTimer &&\n                    requestHostTimeout(\n                      handleTimeout,\n                      firstTimer.startTime - currentTime\n                    );\n                  hasMoreWork = !1;\n                }\n              }\n              break a;\n            } finally {\n              (currentTask = null),\n                (currentPriorityLevel = previousPriorityLevel),\n                (isPerformingWork = !1);\n            }\n            hasMoreWork = void 0;\n          }\n        } finally {\n          hasMoreWork\n            ? schedulePerformWorkUntilDeadline()\n            : (isMessageLoopRunning = !1);\n        }\n      }\n    }\n    function push(heap, node) {\n      var index = heap.length;\n      heap.push(node);\n      a: for (; 0 < index; ) {\n        var parentIndex = (index - 1) >>> 1,\n          parent = heap[parentIndex];\n        if (0 < compare(parent, node))\n          (heap[parentIndex] = node),\n            (heap[index] = parent),\n            (index = parentIndex);\n        else break a;\n      }\n    }\n    function peek(heap) {\n      return 0 === heap.length ? null : heap[0];\n    }\n    function pop(heap) {\n      if (0 === heap.length) return null;\n      var first = heap[0],\n        last = heap.pop();\n      if (last !== first) {\n        heap[0] = last;\n        a: for (\n          var index = 0, length = heap.length, halfLength = length >>> 1;\n          index < halfLength;\n\n        ) {\n          var leftIndex = 2 * (index + 1) - 1,\n            left = heap[leftIndex],\n            rightIndex = leftIndex + 1,\n            right = heap[rightIndex];\n          if (0 > compare(left, last))\n            rightIndex < length && 0 > compare(right, left)\n              ? ((heap[index] = right),\n                (heap[rightIndex] = last),\n                (index = rightIndex))\n              : ((heap[index] = left),\n                (heap[leftIndex] = last),\n                (index = leftIndex));\n          else if (rightIndex < length && 0 > compare(right, last))\n            (heap[index] = right),\n              (heap[rightIndex] = last),\n              (index = rightIndex);\n          else break a;\n        }\n      }\n      return first;\n    }\n    function compare(a, b) {\n      var diff = a.sortIndex - b.sortIndex;\n      return 0 !== diff ? diff : a.id - b.id;\n    }\n    function advanceTimers(currentTime) {\n      for (var timer = peek(timerQueue); null !== timer; ) {\n        if (null === timer.callback) pop(timerQueue);\n        else if (timer.startTime <= currentTime)\n          pop(timerQueue),\n            (timer.sortIndex = timer.expirationTime),\n            push(taskQueue, timer);\n        else break;\n        timer = peek(timerQueue);\n      }\n    }\n    function handleTimeout(currentTime) {\n      isHostTimeoutScheduled = !1;\n      advanceTimers(currentTime);\n      if (!isHostCallbackScheduled)\n        if (null !== peek(taskQueue))\n          (isHostCallbackScheduled = !0),\n            isMessageLoopRunning ||\n              ((isMessageLoopRunning = !0), schedulePerformWorkUntilDeadline());\n        else {\n          var firstTimer = peek(timerQueue);\n          null !== firstTimer &&\n            requestHostTimeout(\n              handleTimeout,\n              firstTimer.startTime - currentTime\n            );\n        }\n    }\n    function shouldYieldToHost() {\n      return needsPaint\n        ? !0\n        : exports.unstable_now() - startTime < frameInterval\n          ? !1\n          : !0;\n    }\n    function requestHostTimeout(callback, ms) {\n      taskTimeoutID = localSetTimeout(function () {\n        callback(exports.unstable_now());\n      }, ms);\n    }\n    \"undefined\" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&\n      \"function\" ===\n        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&\n      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());\n    exports.unstable_now = void 0;\n    if (\n      \"object\" === typeof performance &&\n      \"function\" === typeof performance.now\n    ) {\n      var localPerformance = performance;\n      exports.unstable_now = function () {\n        return localPerformance.now();\n      };\n    } else {\n      var localDate = Date,\n        initialTime = localDate.now();\n      exports.unstable_now = function () {\n        return localDate.now() - initialTime;\n      };\n    }\n    var taskQueue = [],\n      timerQueue = [],\n      taskIdCounter = 1,\n      currentTask = null,\n      currentPriorityLevel = 3,\n      isPerformingWork = !1,\n      isHostCallbackScheduled = !1,\n      isHostTimeoutScheduled = !1,\n      needsPaint = !1,\n      localSetTimeout = \"function\" === typeof setTimeout ? setTimeout : null,\n      localClearTimeout =\n        \"function\" === typeof clearTimeout ? clearTimeout : null,\n      localSetImmediate =\n        \"undefined\" !== typeof setImmediate ? setImmediate : null,\n      isMessageLoopRunning = !1,\n      taskTimeoutID = -1,\n      frameInterval = 5,\n      startTime = -1;\n    if (\"function\" === typeof localSetImmediate)\n      var schedulePerformWorkUntilDeadline = function () {\n        localSetImmediate(performWorkUntilDeadline);\n      };\n    else if (\"undefined\" !== typeof MessageChannel) {\n      var channel = new MessageChannel(),\n        port = channel.port2;\n      channel.port1.onmessage = performWorkUntilDeadline;\n      schedulePerformWorkUntilDeadline = function () {\n        port.postMessage(null);\n      };\n    } else\n      schedulePerformWorkUntilDeadline = function () {\n        localSetTimeout(performWorkUntilDeadline, 0);\n      };\n    exports.unstable_IdlePriority = 5;\n    exports.unstable_ImmediatePriority = 1;\n    exports.unstable_LowPriority = 4;\n    exports.unstable_NormalPriority = 3;\n    exports.unstable_Profiling = null;\n    exports.unstable_UserBlockingPriority = 2;\n    exports.unstable_cancelCallback = function (task) {\n      task.callback = null;\n    };\n    exports.unstable_forceFrameRate = function (fps) {\n      0 > fps || 125 < fps\n        ? console.error(\n            \"forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported\"\n          )\n        : (frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5);\n    };\n    exports.unstable_getCurrentPriorityLevel = function () {\n      return currentPriorityLevel;\n    };\n    exports.unstable_next = function (eventHandler) {\n      switch (currentPriorityLevel) {\n        case 1:\n        case 2:\n        case 3:\n          var priorityLevel = 3;\n          break;\n        default:\n          priorityLevel = currentPriorityLevel;\n      }\n      var previousPriorityLevel = currentPriorityLevel;\n      currentPriorityLevel = priorityLevel;\n      try {\n        return eventHandler();\n      } finally {\n        currentPriorityLevel = previousPriorityLevel;\n      }\n    };\n    exports.unstable_requestPaint = function () {\n      needsPaint = !0;\n    };\n    exports.unstable_runWithPriority = function (priorityLevel, eventHandler) {\n      switch (priorityLevel) {\n        case 1:\n        case 2:\n        case 3:\n        case 4:\n        case 5:\n          break;\n        default:\n          priorityLevel = 3;\n      }\n      var previousPriorityLevel = currentPriorityLevel;\n      currentPriorityLevel = priorityLevel;\n      try {\n        return eventHandler();\n      } finally {\n        currentPriorityLevel = previousPriorityLevel;\n      }\n    };\n    exports.unstable_scheduleCallback = function (\n      priorityLevel,\n      callback,\n      options\n    ) {\n      var currentTime = exports.unstable_now();\n      \"object\" === typeof options && null !== options\n        ? ((options = options.delay),\n          (options =\n            \"number\" === typeof options && 0 < options\n              ? currentTime + options\n              : currentTime))\n        : (options = currentTime);\n      switch (priorityLevel) {\n        case 1:\n          var timeout = -1;\n          break;\n        case 2:\n          timeout = 250;\n          break;\n        case 5:\n          timeout = 1073741823;\n          break;\n        case 4:\n          timeout = 1e4;\n          break;\n        default:\n          timeout = 5e3;\n      }\n      timeout = options + timeout;\n      priorityLevel = {\n        id: taskIdCounter++,\n        callback: callback,\n        priorityLevel: priorityLevel,\n        startTime: options,\n        expirationTime: timeout,\n        sortIndex: -1\n      };\n      options > currentTime\n        ? ((priorityLevel.sortIndex = options),\n          push(timerQueue, priorityLevel),\n          null === peek(taskQueue) &&\n            priorityLevel === peek(timerQueue) &&\n            (isHostTimeoutScheduled\n              ? (localClearTimeout(taskTimeoutID), (taskTimeoutID = -1))\n              : (isHostTimeoutScheduled = !0),\n            requestHostTimeout(handleTimeout, options - currentTime)))\n        : ((priorityLevel.sortIndex = timeout),\n          push(taskQueue, priorityLevel),\n          isHostCallbackScheduled ||\n            isPerformingWork ||\n            ((isHostCallbackScheduled = !0),\n            isMessageLoopRunning ||\n              ((isMessageLoopRunning = !0),\n              schedulePerformWorkUntilDeadline())));\n      return priorityLevel;\n    };\n    exports.unstable_shouldYield = shouldYieldToHost;\n    exports.unstable_wrapCallback = function (callback) {\n      var parentPriorityLevel = currentPriorityLevel;\n      return function () {\n        var previousPriorityLevel = currentPriorityLevel;\n        currentPriorityLevel = parentPriorityLevel;\n        try {\n          return callback.apply(this, arguments);\n        } finally {\n          currentPriorityLevel = previousPriorityLevel;\n        }\n      };\n    };\n    \"undefined\" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&\n      \"function\" ===\n        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&\n      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());\n  })();\n\n\n//# sourceURL=webpack://deep-webpack/./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/cjs/scheduler.development.js?\n}");

/***/ }),

/***/ "./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/index.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("{\n\nif (false) // removed by dead control flow\n{} else {\n  module.exports = __webpack_require__(/*! ./cjs/scheduler.development.js */ \"./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/cjs/scheduler.development.js\");\n}\n\n\n//# sourceURL=webpack://deep-webpack/./node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/index.js?\n}");

/***/ }),

/***/ "./src/Hello.tsx":
/*!***********************!*\
  !*** ./src/Hello.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/.pnpm/react@19.1.1/node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _images_avatar_webp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/avatar.webp */ \"./src/images/avatar.webp\");\n/* harmony import */ var _images_book_webp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/book.webp */ \"./src/images/book.webp\");\n\n\n\nconst Hello = () => {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, \"\\u6765\\u54AF\\u6765\\u54AF\", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"img\", {\n    src: _images_avatar_webp__WEBPACK_IMPORTED_MODULE_1__,\n    alt: \"\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"img\", {\n    src: _images_book_webp__WEBPACK_IMPORTED_MODULE_2__,\n    alt: \"\"\n  }));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hello);\n\n//# sourceURL=webpack://deep-webpack/./src/Hello.tsx?\n}");

/***/ }),

/***/ "./src/images/avatar.webp":
/*!********************************!*\
  !*** ./src/images/avatar.webp ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("{module.exports = __webpack_require__.p + \"assets/images/avatar.1c3bdacf9bb66e470115.webp\";\n\n//# sourceURL=webpack://deep-webpack/./src/images/avatar.webp?\n}");

/***/ }),

/***/ "./src/images/book.webp":
/*!******************************!*\
  !*** ./src/images/book.webp ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("{module.exports = __webpack_require__.p + \"assets/images/book.cc74d6b580be46709ae4.webp\";\n\n//# sourceURL=webpack://deep-webpack/./src/images/book.webp?\n}");

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://deep-webpack/./src/main.css?\n}");

/***/ }),

/***/ "./src/main.tsx":
/*!**********************!*\
  !*** ./src/main.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/.pnpm/react@19.1.1/node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ \"./node_modules/.pnpm/react-dom@19.1.1_react@19.1.1/node_modules/react-dom/client.js\");\n/* harmony import */ var _Hello_tsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Hello.tsx */ \"./src/Hello.tsx\");\n/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./main.css */ \"./src/main.css\");\n\n\n\n\n(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById('app')).render(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Hello_tsx__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null));\n\n//# sourceURL=webpack://deep-webpack/./src/main.tsx?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkdeep_webpack"] = self["webpackChunkdeep_webpack"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/main.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;