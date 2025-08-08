"use strict";

self.onmessage = function _callee(e) {
  var _e$data, imgData, quality, bitmap, canvas, ctx, compressedBlob, reader;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _e$data = e.data, imgData = _e$data.imgData, quality = _e$data.quality; // console.log(imgData, quality,'/////');

          _context.prev = 1;
          _context.t0 = regeneratorRuntime;
          _context.t1 = createImageBitmap;
          _context.t2 = regeneratorRuntime;
          _context.next = 7;
          return regeneratorRuntime.awrap(fetch(imgData));

        case 7:
          _context.t3 = _context.sent.blob();
          _context.next = 10;
          return _context.t2.awrap.call(_context.t2, _context.t3);

        case 10:
          _context.t4 = _context.sent;
          _context.t5 = (0, _context.t1)(_context.t4);
          _context.next = 14;
          return _context.t0.awrap.call(_context.t0, _context.t5);

        case 14:
          bitmap = _context.sent;
          // 压缩前, base64 -> fetch -> blob -> bitmap
          // console.log(bitmap,'/////');
          // html5 canvas 画布   位图时少取一些像素
          // 可以画
          canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
          ctx = canvas.getContext('2d'); // 从左上角开始画出来

          ctx.drawImage(bitmap, 0, 0); // canvas -> blob

          _context.next = 20;
          return regeneratorRuntime.awrap(canvas.convertToBlob({
            type: 'image/jpeg',
            quality: quality
          }));

        case 20:
          compressedBlob = _context.sent;
          reader = new FileReader();

          reader.onloadend = function () {
            // console.log(reader.result);
            self.postMessage({
              success: true,
              data: reader.result
            });
          };

          reader.readAsDataURL(compressedBlob);
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t6 = _context["catch"](1);
          self.postMessage({
            success: false,
            error: _context.t6
          });

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 26]]);
};