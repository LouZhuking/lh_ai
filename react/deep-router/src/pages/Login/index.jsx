import {
  useState
} from 'react'
import {
  useNavigate, // Navigate 组件 js 跳转
  useLocation
} from 'react-router-dom'

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === 'Happy' && password === '1314520') {
      localStorage.setItem('isLogin', 'true');
      navigate(location?.state?.from || '/');
    } else {
      alert('用户名或密码错误');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>登录界面</h1>
      <input
        type="text"
        placeholder="请输入用户名"
        required
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="请输入密码"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <button type="submit">登录</button>
    </form>
  )

}
export default Login