"use strict";

var fs = require('fs'); // fs 帮助我们读取文件


var path = require('path');

var _require = require('openai'),
    OpenAI = _require.OpenAI;

var _require2 = require('console'),
    error = _require2.error;

require('dotenv').config(); // 模型 ollama
// 给它喂私有的知识库, 不怕私有被外界大模型训练了
// 安全


var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

function readCourseInfo() {
  try {
    var filePath = path.join(__dirname, "lesson.txt");
    console.log(filePath);
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error("读取课程文件失败:", error);
    return "";
  }
}

var testQuestion = "有多少门课程?";

function answerQuestion(question) {
  var courseInfo, prompt, response;
  return regeneratorRuntime.async(function answerQuestion$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 检索
          courseInfo = readCourseInfo();
          console.log(courseInfo);

          if (courseInfo) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", '无法读取课程信息，请确保lesson.txt文件纯在且有内容');

        case 4:
          _context.prev = 4;
          prompt = "\n          \u4F60\u662F\u4E00\u4E2A\u8BFE\u7A0B\u52A9\u624B\uFF0C\u8BF7\u6839\u636E\u4EE5\u4E0B\u8BFE\u7A0B\u4FE1\u606F\u56DE\u7B54\u95EE\u9898\u3002\n          \u53EA\u56DE\u7B54\u4E0E\u8BFE\u7A0B\u4FE1\u606F\u76F8\u5173\u7684\u5185\u5BB9\u3002\u5982\u679C\u5185\u5BB9\u4E0E\u8BFE\u7A0B\u65E0\u5173\uFF0C\n          \u8BF7\u793C\u8C8C\u5730\u8BF4\u660E\u4F60\u53EA\u80FD\u56DE\u7B54\u4E0E\u8BFE\u7A0B\u76F8\u5173\u7684\u95EE\u9898\u3002\n\n          \u8BFE\u7A0B\u4FE1\u606F:\n          ".concat(courseInfo, "\n\n          \u95EE\u9898: ").concat(question, "\n      ");
          _context.next = 8;
          return regeneratorRuntime.awrap(openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
              role: "system",
              content: "你是一个专业的课程助手,请根据课程信息回答问题。"
            }, {
              role: "user",
              content: prompt
            }],
            temperature: 0.1
          }));

        case 8:
          response = _context.sent;
          return _context.abrupt("return", response.choices[0].message.content);

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](4);
          console.error('调用OpenAI API 失败:', error);
          return _context.abrupt("return", "抱歉，处理您的问题时出现错误");

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 12]]);
}

answerQuestion(testQuestion).then(function (answer) {
  console.log("问题：", testQuestion);
  console.log("回答：", answer);
});