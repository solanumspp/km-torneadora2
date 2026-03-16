const express = require('express')
const router = express.Router()

let fornecedores = [
  { id: 1, nome: 'AçoForte Ltda',        cnpj: '11.111.111/0001-11', materialFornecido: 'Ferro',        email: 'contato@acoforte.com',   telefone: '(69) 99001-0001' },
  { id: 2, nome: 'EngreTech S.A.',        cnpj: '22.222.222/0001-22', materialFornecido: 'Engrenagens',  email: 'vendas@engretech.com',   telefone: '(69) 99002-0002' },
  { id: 3, nome: 'RevMax Ind.',           cnpj: '33.333.333/0001-33', materialFornecido: 'Revestimento', email: 'rev@revmax.com',          telefone: '(69) 99003-0003' },
  { id: 4, nome: 'Chapas & Metais Ltda',  cnpj: '44.444.444/0001-44', materialFornecido: 'Chapas',       email: 'chapas@metais.com',       telefone: '(69) 99004-0004' },
]
let nextId = 5

router.get('/', (req, res) => res.json(fornecedores))

router.get('/:id', (req, res) => {
  const f = fornecedores.find(f => f.id === Number(req.params.id))
  if (!f) return res.status(404).json({ erro: 'Fornecedor não encontrado' })
  res.json(f)
})

router.post('/', (req, res) => {
  const { nome, cnpj, materialFornecido, email, telefone } = req.body
  if (!nome || !cnpj || !materialFornecido) {
    return res.status(400).json({ erro: 'Nome, CNPJ e material fornecido são obrigatórios' })
  }
  const novo = { id: nextId++, nome, cnpj, materialFornecido, email: email || '', telefone: telefone || '' }
  fornecedores.push(novo)
  res.status(201).json(novo)
})

router.put('/:id', (req, res) => {
  const idx = fornecedores.findIndex(f => f.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ erro: 'Fornecedor não encontrado' })
  fornecedores[idx] = { ...fornecedores[idx], ...req.body }
  res.json(fornecedores[idx])
})

router.delete('/:id', (req, res) => {
  fornecedores = fornecedores.filter(f => f.id !== Number(req.params.id))
  res.sendStatus(204)
})

module.exports = router
