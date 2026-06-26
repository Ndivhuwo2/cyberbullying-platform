import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NewCasePage from './pages/NewCasePage'
import CaseDetailPage from './pages/CaseDetailPage'
import LogIncidentPage from './pages/LogIncidentPage'
import TimelinePage from './pages/TimelinePage'
import EvidencePage from './pages/EvidencePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cases/new" element={<NewCasePage />} />
        <Route path="/cases/:id" element={<CaseDetailPage />} />
        <Route path="/cases/:id/log" element={<LogIncidentPage />} />
        <Route path="/cases/:id/timeline" element={<TimelinePage />} />
        <Route path="/cases/:id/evidence" element={<EvidencePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App