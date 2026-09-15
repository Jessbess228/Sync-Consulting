import { createPortal } from 'react-dom'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AdminMode } from './pages/AdminMode'
import { Home } from './pages/Home'

function EditToggle() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin-edit-mode')) return null

  return createPortal(
    <Link to="/admin-edit-mode" className="sc-edit-toggle" aria-label="Edit page">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M11.6 1.9a1.4 1.4 0 0 1 2 2L5.4 12.1 2 13l.9-3.4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M10.2 3.3 12.7 5.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    </Link>,
    document.body,
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/sync">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-edit-mode" element={<AdminMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <EditToggle />
    </BrowserRouter>
  )
}
