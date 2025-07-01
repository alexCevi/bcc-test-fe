import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/context'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App id="frgwrx-lt-dashboard-root" />
    </AuthProvider>
)