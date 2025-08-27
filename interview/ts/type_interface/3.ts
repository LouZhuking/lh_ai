interface Animal {
  name: string;
}

interface Animal {
  age: number
}
const dragon:Animal = {
  name: 'xww',
  age: 2
}
// type 不能重复声明
// type AnimalType = {name: string}
// type AnimalType = {age: number}