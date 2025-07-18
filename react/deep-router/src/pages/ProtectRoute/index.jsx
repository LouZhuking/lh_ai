import {
  Navigate,
  useLocation
} from 'react-router-dom'

// 鉴权组件
const ProtectRoute = (props) => {
  // console.log(props);
  // 并非子组件
  // children属性 提升定制性
  const { children } = props;
  const pathname = useLocation();
  const isLogin = localStorage.getItem('isLogin') === 'true';

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: pathname }} />
  }

  return children
}

export default ProtectRoute