"use strict";

1 + '23'; // '123'

1 + false; // 1 

1 + Symbol(); // Uncaught TypeError: Cannot convert a Symbol value to a number

'1' + false; // '1false'

false + true; // 1