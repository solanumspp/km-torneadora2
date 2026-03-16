import { useState } from 'react'
import Fornecedores from './pages/Fornecedores'
import Produtos from './pages/Produtos'
import Associacao from './pages/Associacao'
import Clientes from './pages/Clientes'
import './App.css'

const TABS = [
  { id: 'fornecedores', label: 'Fornecedores' },
  { id: 'produtos',     label: 'Maquinário' },
  { id: 'associacao',   label: 'Associação' },
  { id: 'clientes',     label: 'Clientes' },
]

export default function App() {
  const [tab, setTab] = useState('fornecedores')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">K&M Torneadora</span>
        </div>
        <nav className="nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <span className="status-dot" /> Sistema ativo
        </div>
      </header>

      <main className="page-content">
        {tab === 'fornecedores' && <Fornecedores />}
        {tab === 'produtos'     && <Produtos />}
        {tab === 'associacao'   && <Associacao />}
        {tab === 'clientes'     && <Clientes />}
      </main>
    </div>
  )
}
