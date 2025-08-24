/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicates = function(s) {
    const stack = [];
    for(const i of s){
      if(i === stack[stack.length-1]){
        stack.pop();
      }else{
        stack.push(i);
      }
    }
    return stack.join("");
};


console.log(removeDuplicates("abbaca"));
