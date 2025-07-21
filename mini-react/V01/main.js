// v1
const dom = document.createElement('div')
dom.id = "app"
document.querySelector('#root').append(dom)


const textNode = document.createTextNode("")
textNode.nodeValue = "app"
dom.append(textNode)

// v2 react -> vdom -> js object

// type props children
const el = {
  type: "div",
}