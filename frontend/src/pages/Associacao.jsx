import { useState, useEffect } from 'react'
import './Page.css'

const API_PROD  = '/produtos'
const API_FORN  = '/fornecedores'
const API_ASSOC = '/associacao'

export default function Associacao() {
  const [produtos, setProdutos]         = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [produtoId, setProdutoId]       = useState('')
  const [fornecedorId, setFornecedorId] = useState('')
  const [msg, setMsg]   = useState(null)
  const [loading, setLoading] = useState(false)

  const carregar = () => {
    fetch(API_PROD).then(r => r.json()).then(setProdutos)
    fetch(API_FORN).then(r => r.json()).then(setFornecedores)
  }
  useEffect(() => { carregar() }, [])

  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto })
    setTimeout(() => setMsg(null), 3000)
  }

  const associar = async () => {
    if (!produtoId || !fornecedorId) return showMsg('erro', 'Selecione o equipamento e o fornecedor')
    setLoading(true)
    try {
      const r = await fetch(API_ASSOC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId: Number(produtoId), fornecedorId: Number(fornecedorId) })
      })
      if (!r.ok) throw new Error()
      showMsg('ok', 'Fornecedor vinculado ao equipamento!')
      setProdutoId(''); setFornecedorId('')
      carregar()
    } catch {
      showMsg('erro', 'Erro ao realizar associação')
    } finally {
      setLoading(false)
    }
  }

  const remover = async (pid) => {
    await fetch(`${API_ASSOC}/${pid}`, { method: 'DELETE' })
    carregar()
  }

  const nomeFornecedor = (id) => fornecedores.find(f => f.id === id)
  const produtosVinculados = produtos.filter(p => p.fornecedorId)
  const produtosSemFornecedor = produtos.filter(p => !p.fornecedorId)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Associação</h1>
        <span className="badge">{produtosVinculados.length} vínculos ativos</span>
      </div>

      <div className="card form-card">
        <h2 className="card-title">Vincular Fornecedor a Equipamento</h2>
        <p className="card-desc">
          Defina qual fornecedor é responsável pelo material principal de cada equipamento fabricado pela K&M.
        </p>
        <div className="form-grid">
          <div className="field">
            <label>Equipamento *</label>
            <select value={produtoId} onChange={e => setProdutoId(e.target.value)}>
              <option value="">Selecione o equipamento...</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} {p.fornecedorId ? '(já vinculado)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Fornecedor *</label>
            <select value={fornecedorId} onChange={e => setFornecedorId(e.target.value)}>
              <option value="">Selecione o fornecedor...</option>
              {fornecedores.map(f => (
                <option key={f.id} value={f.id}>{f.nome} — {f.materialFornecido}</option>
              ))}
            </select>
          </div>
        </div>
        {msg && <div className={`msg msg-${msg.tipo}`}>{msg.texto}</div>}
        <button className="btn-primary" onClick={associar} disabled={loading}>
          {loading ? 'Vinculando...' : '⇄ Vincular'}
        </button>
      </div>

      {produtosSemFornecedor.length > 0 && (
        <div className="alert-warning">
          ⚠️ {produtosSemFornecedor.length} equipamento(s) sem fornecedor vinculado: {produtosSemFornecedor.map(p => p.nome).join(', ')}
        </div>
      )}

      <div className="table-wrap">
        <h2 className="section-title">Vínculos Ativos</h2>
        <table className="data-table">
          <thead>
            <tr><th>Equipamento</th><th>Categoria</th><th>Preço</th><th>Fornecedor</th><th>Material</th><th></th></tr>
          </thead>
          <tbody>
            {produtosVinculados.length === 0 && (
              <tr><td colSpan={6} className="empty">Nenhum vínculo ativo ainda</td></tr>
            )}
            {produtosVinculados.map(p => {
              const forn = nomeFornecedor(p.fornecedorId)
              return (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td><span className="tag-cat">{p.categoria}</span></td>
                  <td className="mono">R$ {Number(p.preco).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
                  <td><span className="tag-forn">{forn?.nome || '—'}</span></td>
                  <td>{forn?.materialFornecido || '—'}</td>
                  <td><button className="btn-danger" onClick={() => remover(p.id)}>Desvincular</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
