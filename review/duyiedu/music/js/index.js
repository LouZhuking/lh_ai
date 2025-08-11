/**
 * 解析歌词字符串 
 * 得到一个歌词对象的数组
 * 每个歌词对象：
 * {time:开始时间，words: 歌词内容}
 */
function parseLrc(){
  let lines = lrc.split('\n')
  let result = []   // 歌词对象数组
  // console.log(lines);
  for(let i =0; i < lines.length;i++){
    let str = lines[i]
    let parts = str.split(']')
    // console.log(parts);
    let timeStr = parts[0].substring(1);
    // console.log(timeStr);
    let obj = {
      time: parseTime(timeStr),
      words: parts[1],
    }
    // console.log(obj);
    result.push(obj)
    // console.log(str);
  }
  return result
}

/**
 * 将一个时间字符串解析为数字(秒)
 * @param {*} timeStr  时间字符串
 * @returns 
 */


function parseTime(timeStr){
  let parts = timeStr.split(':')
  // console.log(+parts[0] * 60 + +parts[1]);
  return +parts[0] * 60 + +parts[1]  
}

let lrcData = parseLrc()

// 获取需要的 dom
let doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container')
}


// console.log(lrcData);
/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到-1
 */
function findIndex(){
  let curTime = doms.audio.currentTime;
  for(let i = 0; i < lrcData.length; i++){
    if(curTime < lrcData[i].time){
      return i - 1
    }
  }
  // 找遍了都没找到(说明播放到最后一句了) 找到最后一句
  return lrcData.length - 1
}

// 界面


/**
 * 创建歌词元素 li
 */
function createLrcElements(){
  for(let i = 0; i < lrcData.length; i++){
    let li = document.createElement('li')
    li.textContent = lrcData[i].words
    doms.ul.appendChild(li) // 改动了 dom 树
  }
}

createLrcElements()

// 获取容器的高度
let containerHeight = doms.container.clientHeight
// 每个容器的高度
let liHeight = doms.ul.children[0].clientHeight
// 最大偏移量
let maxHeight = doms.ul.clientHeight - containerHeight




/**
 * 设置 ul 元素的偏移量
 */

function setOffset(){
  let index = findIndex();
  let offset = liHeight * index + liHeight / 2 - containerHeight /2;
  if(offset < 0){
    offset = 0;
  }
  if(offset > maxHeight){
    offset = maxHeight
  }
  doms.ul.style.transform = `translateY(-${offset}px)`
  // 去掉之前的 active 样式
  let li = doms.ul.querySelector('.active')?.classList.remove('active')
  li = doms.ul.children[index]
  if(li){
    li.classList.add('active')
  }
}

// 监听播放器播放时间的变化
doms.audio.addEventListener('timeupdate', setOffset)