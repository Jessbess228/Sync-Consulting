import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminMode } from './pages/AdminMode'
import { Home } from './pages/Home'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-edit-mode" element={<AdminMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
