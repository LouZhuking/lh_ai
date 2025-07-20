import {
  BrowserRouter as Router
} from 'react-router-dom'
import {
  GlobalProvider
} from './context/GlobalContext'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GlobalProvider>
    <Router>
      <App />
    </Router>
  </GlobalProvider>,
) 
