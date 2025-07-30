import styles from './card.module.css'
import {
  useRef,
  useEffect,
  use
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
    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const oImg = document.createElement('img')
        oImg.src = img.dataset.src
        oImg.onload = () => {
          img.src = oImg.src
        }
        // img.src = img.dataset.src || '';
        obs.unobserve(img);
      }
    })

  }, [])

  return (
    <div style={{ height }} className={styles.card}>
      <img ref={imgRef} data-src={url} className={styles.img} />
    </div>
  )
}

export default ImageCard