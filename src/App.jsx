import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import People from './pages/People.jsx'
import OrgChart from './pages/OrgChart.jsx'
import Documents from './pages/Documents.jsx'
import Compliance from './pages/Compliance.jsx'
import Hiring from './pages/Hiring.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Integrations from './pages/Integrations.jsx'
import EAAgent from './pages/EAAgent.jsx'
import Handbooks from './pages/Handbooks.jsx'
import Signing from './pages/Signing.jsx'
import styles from './App.module.css'

const PAGES = {
  dashboard:    Dashboard,
  people:       People,
  org:          OrgChart,
  docs:         Documents,
  compliance:   Compliance,
  hiring:       Hiring,
  onboarding:   Onboarding,
  signing:      Signing,
  integrations: Integrations,
  ea:           EAAgent,
  handbooks:    Handbooks,
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const Page = PAGES[currentPage] || Dashboard

  return (
    <div className={styles.app}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className={styles.main}>
        <Page onNavigate={setCurrentPage} />
      </div>
    </div>
  )
}
