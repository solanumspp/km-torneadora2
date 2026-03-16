import { useState, useEffect } from 'react'
import './Page.css'

const API = '/clientes'

export default function Clientes() {
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({ nome: '', cpfCnpj: '', telefone: '', email: '', cidade: '', observacao: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [busca, setBusca] = useState('')

  const carregar = () =>
    fetch(API).then(r => r.json()).then(setLista)
      .catch(() => setMsg({ tipo: 'erro', texto: 'Erro ao conectar com a API' }))

  useEffect(() => { carregar() }, [])

  const atualizar = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = async () => {
    if (!form.nome) return setMsg({ tipo: 'erro', texto: 'Nome é obrigatório' })
    setLoading(true)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!r.ok) throw new Error()
      setForm({ nome: '', cpfCnpj: '', telefone: '', email: '', cidade: '', observacao: '' })
      setMsg({ tipo: 'ok', texto: 'Cliente cadastrado!' })
      carregar()
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao salvar cliente' })
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const excluir = async (id) => {
    if (!confirm('Remover este cliente?')) return
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    carregar()
  }

  const listafiltrada = lista.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.cidade.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpfCnpj.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <span className="badge">{lista.length} cadastrados</span>
      </div>

      <div className="card form-card">
        <h2 className="card-title">Novo Cliente</h2>
        <div className="form-grid">
          <div className="field">
            <label>Nome *</label>
            <input placeholder="Nome completo ou razão social" value={form.nome} onChange={e => atualizar('nome', e.target.value)} />
          </div>
          <div className="field">
            <label>CPF / CNPJ</label>
            <input placeholder="000.000.000-00" value={form.cpfCnpj} onChange={e => atualizar('cpfCnpj', e.target.value)} />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input placeholder="(69) 99999-0000" value={form.telefone} onChange={e => atualizar('telefone', e.target.value)} />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input placeholder="contato@email.com" value={form.email} onChange={e => atualizar('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Cidade</label>
            <input placeholder="Ex: Porto Velho, RO" value={form.cidade} onChange={e => atualizar('cidade', e.target.value)} />
          </div>
          <div className="field">
            <label>Observação</label>
            <input placeholder="Ex: Garimpeiro, cliente desde 2022..." value={form.observacao} onChange={e => atualizar('observacao', e.target.value)} />
          </div>
        </div>
        {msg && <div className={`msg msg-${msg.tipo}`}>{msg.texto}</div>}
        <button className="btn-primary" onClick={salvar} disabled={loading}>
          {loading ? 'Salvando...' : '+ Cadastrar Cliente'}
        </button>
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Buscar por nome, cidade ou CPF/CNPJ..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>CPF / CNPJ</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Observação</th>
              <th>Cadastro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listafiltrada.length === 0 && (
              <tr><td colSpan={8} className="empty">
                {busca ? 'Nenhum cliente encontrado para essa busca' : 'Nenhum cliente cadastrado'}
              </td></tr>
            )}
            {listafiltrada.map(c => (
              <tr key={c.id}>
                <td className="id-col">#{c.id}</td>
                <td><strong>{c.nome}</strong>{c.email && <><br/><span className="sub-desc">{c.email}</span></>}</td>
                <td className="mono">{c.cpfCnpj || <span className="muted">—</span>}</td>
                <td className="mono">{c.telefone || <span className="muted">—</span>}</td>
                <td>{c.cidade || <span className="muted">—</span>}</td>
                <td><span className="sub-desc">{c.observacao || '—'}</span></td>
                <td className="mono" style={{fontSize:'11px'}}>{c.cadastradoEm}</td>
                <td>
                  <button className="btn-danger" onClick={() => excluir(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
