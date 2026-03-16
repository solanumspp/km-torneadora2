import { useState, useEffect } from 'react'
import './Page.css'

const API      = '/produtos'
const API_FORN = '/fornecedores'

export default function Produtos() {
  const [lista, setLista]           = useState([])
  const [fornecedores, setForn]     = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({ nome: '', categoria: '', descricao: '', preco: '', quantidade: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState(null)
  const [editando, setEditando] = useState(null)
  const [editForm, setEditForm] = useState({ preco: '', quantidade: '' })

  const carregar = () => {
    fetch(API).then(r => r.json()).then(setLista)
    fetch(API_FORN).then(r => r.json()).then(setForn)
    fetch(`${API}/categorias`).then(r => r.json()).then(setCategorias)
  }
  useEffect(() => { carregar() }, [])

  const atualizar = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = async () => {
    if (!form.nome || !form.preco)
      return setMsg({ tipo: 'erro', texto: 'Nome e preço são obrigatórios' })
    setLoading(true)
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!r.ok) throw new Error()
      setForm({ nome: '', categoria: '', descricao: '', preco: '', quantidade: '' })
      setMsg({ tipo: 'ok', texto: 'Maquinário cadastrado!' })
      carregar()
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao salvar produto' })
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const excluir = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    carregar()
  }

  const abrirEditar = (p) => {
    setEditando(p.id)
    setEditForm({ preco: p.preco, quantidade: p.quantidade })
  }

  const salvarEdicao = async () => {
    if (!editForm.preco) return
    try {
      await fetch(`${API}/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preco: Number(editForm.preco), quantidade: Number(editForm.quantidade) })
      })
      setEditando(null)
      carregar()
    } catch {
      alert('Erro ao atualizar')
    }
  }

  const nomeFornecedor = (id) => {
    if (!id) return <span className="tag-none">Sem fornecedor</span>
    const f = fornecedores.find(f => f.id === id)
    return f ? <span className="tag-forn">{f.nome}</span> : '—'
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Maquinário</h1>
        <span className="badge">{lista.length} equipamentos</span>
      </div>

      <div className="card form-card">
        <h2 className="card-title">Novo Equipamento</h2>
        <div className="form-grid">
          <div className="field">
            <label>Nome do Equipamento *</label>
            <input placeholder="Ex: Draga, Maraca, Guincho..." value={form.nome} onChange={e => atualizar('nome', e.target.value)} />
          </div>
          <div className="field">
            <label>Categoria</label>
            <select value={form.categoria} onChange={e => atualizar('categoria', e.target.value)}>
              <option value="">Selecione a categoria...</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Preço de Fabricação (R$) *</label>
            <input type="number" placeholder="0.00" value={form.preco} onChange={e => atualizar('preco', e.target.value)} />
          </div>
          <div className="field">
            <label>Quantidade em Estoque</label>
            <input type="number" placeholder="0" value={form.quantidade} onChange={e => atualizar('quantidade', e.target.value)} />
          </div>
          <div className="field field-full">
            <label>Descrição</label>
            <input placeholder="Descrição do equipamento e uso no garimpo" value={form.descricao} onChange={e => atualizar('descricao', e.target.value)} />
          </div>
        </div>
        {msg && <div className={`msg msg-${msg.tipo}`}>{msg.texto}</div>}
        <button className="btn-primary" onClick={salvar} disabled={loading}>
          {loading ? 'Salvando...' : '+ Cadastrar Equipamento'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>Equipamento</th><th>Categoria</th><th>Preço</th><th>Qtd</th><th>Fornecedor</th><th></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={7} className="empty">Nenhum equipamento cadastrado</td></tr>
            )}
            {lista.map(p => (
              editando === p.id ? (
                <tr key={p.id} className="editing-row">
                  <td className="id-col">#{p.id}</td>
                  <td><strong>{p.nome}</strong></td>
                  <td><span className="tag-cat">{p.categoria}</span></td>
                  <td>
                    <input
                      type="number"
                      className="inline-input"
                      value={editForm.preco}
                      onChange={e => setEditForm(f => ({ ...f, preco: e.target.value }))}
                      placeholder="Preço"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="inline-input inline-input-sm"
                      value={editForm.quantidade}
                      onChange={e => setEditForm(f => ({ ...f, quantidade: e.target.value }))}
                      placeholder="Qtd"
                    />
                  </td>
                  <td>{nomeFornecedor(p.fornecedorId)}</td>
                  <td className="action-btns">
                    <button className="btn-save" onClick={salvarEdicao}>Salvar</button>
                    <button className="btn-cancel" onClick={() => setEditando(null)}>Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td className="id-col">#{p.id}</td>
                  <td><strong>{p.nome}</strong><br/><span className="sub-desc">{p.descricao}</span></td>
                  <td><span className="tag-cat">{p.categoria}</span></td>
                  <td className="mono">R$ {Number(p.preco).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
                  <td className="mono">{p.quantidade}</td>
                  <td>{nomeFornecedor(p.fornecedorId)}</td>
                  <td className="action-btns">
                    <button className="btn-edit" onClick={() => abrirEditar(p)}>Editar</button>
                    <button className="btn-danger" onClick={() => excluir(p.id)}>Excluir</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
