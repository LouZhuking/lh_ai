import {
  createWriteStream,
} from 'fs'
import {
  join,
  resolve
} from 'path'
import { EventEmitter } from 'stream';

const target = join(process.cwd(), 'a.txt')
console.log(target);
const ws = createWriteStream(target)
console.log(ws instanceof EventEmitter);
// 自定义事件 流程，  模仿的就是 EventEmitter
//