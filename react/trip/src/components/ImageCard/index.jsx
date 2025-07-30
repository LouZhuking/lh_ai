import styles from './card.module.css'

const ImageCard = (props) => {
  // console.log(props);
  const { img } = props
  const { url, height } = img
  // console.log(url, height);

  return (
    <div style={{ height }} className={styles.card}>
      <img src={url} className={styles.img} />
    </div>
  )
}

export default ImageCard