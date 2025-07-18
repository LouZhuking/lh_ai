import {
  useState,
  useEffect,
  Suspense,
  lazy
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
// 公共组件不是页面级别组件因此不要路由懒加载
import Loading from './components/Loading'
const RepoList = lazy(() => import('./pages/RepoList'))

function App() {


  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/users/:id/repos" element={<RepoList />} />
        <Route path="*" element={<Navigate to="/users/shuwuyu/repos" />} />
      </Routes>
    </Suspense>
  )
}

export default App
