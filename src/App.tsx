import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminMode } from './pages/AdminMode'
import { Home } from './pages/Home'

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename === '/' ? undefined : basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
