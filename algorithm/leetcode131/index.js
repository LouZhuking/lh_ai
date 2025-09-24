/**
 * @param {string} s
 * @return {string[][]}
 */

const isPalindrome = (s,l,r) => {
    for(let i = l,j = r; i < j;i++,j--){
        if(s[i] !== s[j]) return false;
    }
    return true;
}


var partition = function(s) {
    const path = [], res = [];
    const len = s.length;
    const backTracking = function(startIndex){
        if(startIndex >= len){
            res.push(Array.from(path));
            return;
        }
        for(let i =startIndex; i < len; i++){
            if(!isPalindrome(s,startIndex,i)) continue;
            path.push(s.slice(startIndex,i+1));
            backTracking(i+1);
            path.pop()
        }
    }
    backTracking(0);
    return res;
};