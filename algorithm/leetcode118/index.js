/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const ret = []
    for(let i = 0; i < numRows; i++){
      // 定义好了行
      let row = new Array(i+1).fill(1);
      // 对于列上进行处理
      for(let j = 1; j < row.length-1;j++){
        row[j] = ret[i-1][j-1]+ret[i-1][j];
      }
      ret.push(row)
    }
    return ret;
};

console.log(generate(6))