import useTitle from "@/hooks/useTitle"
import {
  Button
} from 'react-vant'
import {
  showToast,
} from "@/components/Toast/ToastController"

const Home = () => {
  useTitle("Happy Trip Home")
  return (
    <div>
      Home
      <Button
        type="primary"
        onClick={() => showToast(3, 6, 9)}>
        showToast
      </Button>
    </div>
  )
}
export default Home