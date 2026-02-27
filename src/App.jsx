import { useState, useEffect } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import PlanGenerator from './pages/PlanGenerator'
import DecryptPage from './pages/DecryptPage'
import NotFound from './pages/NotFound'
import { PLAN_GENERATOR_HASH, DECRYPT_HASH, HOME_HASHES } from './routes'

function App() {
  const [page, setPage] = useState(() => {
    const hash = window.location.hash || '#'
    if (hash === PLAN_GENERATOR_HASH) return 'plan-generator'
    if (hash === DECRYPT_HASH) return 'decrypt'
    if (HOME_HASHES.includes(hash)) return 'home'
    return '404'
  })

  useEffect(() => {
    const check = () => {
      const hash = window.location.hash || '#'
      if (hash === PLAN_GENERATOR_HASH) setPage('plan-generator')
      else if (hash === DECRYPT_HASH) setPage('decrypt')
      else if (HOME_HASHES.includes(hash)) setPage('home')
      else setPage('404')
    }
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  const PageComponent =
    page === '404' ? NotFound
    : page === 'plan-generator' ? PlanGenerator
    : page === 'decrypt' ? DecryptPage
    : HomePage

  return (
    <div key={page} className="page-transition">
      <PageComponent />
    </div>
  )
}

export default App
