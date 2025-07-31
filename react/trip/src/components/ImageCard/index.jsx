import styles from './card.module.css'
import {
  useRef,
  useEffect,
} from 'react'

const ImageCard = (props) => {
  // console.log(props);
  const { img } = props
  const { url, height } = img
  console.log(img);

  const imgRef = useRef(null)
  // console.log(url, height);
  // 图片懒加载 代码的问题
  useEffect(() => {
    // 创建一个IntersectionObserver实例，用于监听元素是否进入视口
    const observer = new IntersectionObserver(([entry], obs) => {
      // 当目标元素进入视口时执行
      if (entry.isIntersecting) {
        // 获取目标图片元素
        const img = entry.target;
        // 创建一个新的img元素用于预加载图片
        const oImg = document.createElement('img')
        // 设置预加载图片的源地址，来自data-src属性
        oImg.src = img.dataset.src
        // 当图片加载完成后，将预加载的图片设置为实际显示的图片
        oImg.onload = () => {
          img.src = oImg.src
        }
        // 停止观察该元素
        observer.unobserve(img)
      }
    })

    // 如果imgRef已绑定到DOM元素，则开始观察该元素
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }


    // 依赖数组为空，表示只在组件挂载时执行一次
  }, [])

  return (
    <div style={{ height }} className={styles.card}>
      <img ref={imgRef} data-src={url} className={styles.img} />
    </div>
  )
}

export default ImageCard