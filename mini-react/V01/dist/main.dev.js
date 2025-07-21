"use strict";

// v1
var dom = document.createElement('div');
dom.id = "app";
document.querySelector('#root').append(dom);
var textNode = document.createTextNode("");
textNode.nodeValue = "app";
dom.append(textNode); // v2 react -> vdom -> js object
// type props children

var el = {
  type: "div"
};