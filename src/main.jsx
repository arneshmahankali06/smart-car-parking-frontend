import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1629',
            color: '#f0f4ff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#48bb78', secondary: '#0f1629' } },
          error:   { iconTheme: { primary: '#fc8181', secondary: '#0f1629' } },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
