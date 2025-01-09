import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { MaterialTailwindProvider } from './context/MaterialTwContext.jsx'
import { ThemeProvider } from '@material-tailwind/react'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <MaterialTailwindProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </MaterialTailwindProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
)
