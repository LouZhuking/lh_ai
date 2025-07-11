console.log('同步Start');
const promise1 = Promise.resolve('First Promise')
const promise2 = Promise.resolve('Second Promise')
const promise3 = new Promise(resolve =>{
  resolve('Third Promise')
  console.log('promise3');
  
})


setTimeout(()=>{
  console.log('下一把再相见');
  const Promise4 = Promise.resolve('Fourth Promise')
  Promise4.then(value => console.log(value))
},0)
setTimeout(()=>{
  console.log('下一把再相见');
},0)

promise1.then(value => console.log(value))
promise2.then(value => console.log(value))
promise3.then(value => console.log(value))

console.log('同步end');
