import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { useAppData } from './context/AppDataContext'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import ReportPage from './pages/ReportPage'
import ProfilePage from './pages/ProfilePage'

function NavBar() {
  return (
    <nav className="nav-bar">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <span>🏠</span>
        홈
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span>📅</span>
        캘린더
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span>📊</span>
        리포트
      </NavLink>
    </nav>
  )
}

export default function App() {
  const { profile } = useAppData()

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/*"
        element={
          profile ? (
            <>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
              <NavBar />
            </>
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />
    </Routes>
  )
}
