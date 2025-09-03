const eachFlat = (arr = [], depth =1) => {
  const result = [];
  (function flatten(arr,depth){
    arr.forEach((item) => {
      if(Array.isArray(item) && depth > 0){
        flatten(item,depth -1)
      }else{
        result.push(item)
      }
    })
  })(arr,depth)
  return result
}

arr = [1,[1,2],[2,3,4]]
console.log(eachFlat(arr))
