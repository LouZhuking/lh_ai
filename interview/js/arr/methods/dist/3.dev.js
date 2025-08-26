"use strict";

var people = [{
  name: 'Alice',
  age: 20,
  role: 'user'
}, {
  name: 'Bob',
  age: 18,
  role: 'admin'
}, {
  name: 'Charlie',
  age: 25,
  role: 'user'
}];
var allAdults = people.every(function (person) {
  return person.age >= 18;
});
var hasAdmin = people.some(function (person) {
  return person.role === 'admin';
});