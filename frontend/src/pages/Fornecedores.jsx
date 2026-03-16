import { useState, useEffect } from 'react'
import './Page.css'

const API = 'http://localhost:3001/fornecedores'

const MATERIAIS = ['Ferro', 'Engrenagens', 'Revestimento', 'Chapas', 'Outro']

export default function Fornecedores() {
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({ nome: '', cnpj: '', materialFornecido: '', email: '', telefone: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const carregar = () =>
    fetch(API).then(r => r.json()).then(setLista)
      .catch(() => setMsg({ tipo: 'erro', texto: 'Erro ao conectar com a API' }))

  useEffect(() => { carregar() }, [])

  const atualizar = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = async () => {
    if (!form.nome || !form.cnpj || !form.materialFornecido)
      return setMsg({ tipo: 'erro', texto: 'Nome, CNPJ e material são obrigatórios' })
    setLoading(true)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!r.ok) throw new Error()
      setForm({ nome: '', cnpj: '', materialFornecido: '', email: '', telefone: '' })
      setMsg({ tipo: 'ok', texto: 'Fornecedor cadastrado com sucesso!' })
      carregar()
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao salvar fornecedor' })
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const excluir = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    carregar()
  }

  const corMaterial = (m) => {
    const cores = {
      'Ferro':        'tag-ferro',
      'Engrenagens':  'tag-engrenagem',
      'Revestimento': 'tag-revestimento',
      'Chapas':       'tag-chapa',
    }
    return cores[m] || 'tag-outro'
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Fornecedores</h1>
        <span className="badge">{lista.length} registros</span>
      </div>

      <div className="card form-card">
        <h2 className="card-title">Novo Fornecedor</h2>
        <div className="form-grid">
          <div className="field">
            <label>Razão Social *</label>
            <input placeholder="Nome da empresa" value={form.nome} onChange={e => atualizar('nome', e.target.value)} />
          </div>
          <div className="field">
            <label>CNPJ *</label>
            <input placeholder="00.000.000/0001-00" value={form.cnpj} onChange={e => atualizar('cnpj', e.target.value)} />
          </div>
          <div className="field">
            <label>Material Fornecido *</label>
            <select value={form.materialFornecido} onChange={e => atualizar('materialFornecido', e.target.value)}>
              <option value="">Selecione o material...</option>
              {MATERIAIS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Telefone</label>
            <input placeholder="(69) 99999-0000" value={form.telefone} onChange={e => atualizar('telefone', e.target.value)} />
          </div>
          <div className="field field-full">
            <label>E-mail</label>
            <input placeholder="contato@fornecedor.com" value={form.email} onChange={e => atualizar('email', e.target.value)} />
          </div>
        </div>
        {msg && <div className={`msg msg-${msg.tipo}`}>{msg.texto}</div>}
        <button className="btn-primary" onClick={salvar} disabled={loading}>
          {loading ? 'Salvando...' : '+ Cadastrar Fornecedor'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>Razão Social</th><th>CNPJ</th><th>Material</th><th>Contato</th><th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={6} className="empty">Nenhum fornecedor cadastrado</td></tr>
            )}
            {lista.map(f => (
              <tr key={f.id}>
                <td className="id-col">#{f.id}</td>
                <td><strong>{f.nome}</strong></td>
                <td className="mono">{f.cnpj}</td>
                <td><span className={`tag-material ${corMaterial(f.materialFornecido)}`}>{f.materialFornecido}</span></td>
                <td>{f.email || f.telefone || '—'}</td>
                <td><button className="btn-danger" onClick={() => excluir(f.id)}>Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
