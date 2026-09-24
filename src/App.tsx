import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminMode } from './pages/AdminMode'
import { Home } from './pages/Home'

export default function App() {
  return (
    <BrowserRouter basename="/website-builder">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
