import {
  ref,
  onMounted,
  onUnmounted
} from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)


 const updateMousePosition = (e) =>{
  x.value = e.clientX;
  y.value = e.clientY;
 }

 onMounted(() => {
  // 挂载中
  window.addEventListener('mousemove',updateMousePosition)
 })
 onUnmounted(() => {
  // 卸载中
  window.removeEventListener('mousemove', updateMousePosition)
 })


  return{
    x,
    y
  }
}
