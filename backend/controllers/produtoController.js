const express = require('express')
const router = express.Router()

let produtos = [
  { id: 1, nome: 'Draga',   categoria: 'Extração',   descricao: 'Equipamento para extração de minério em leitos de rios',      preco: 45000, quantidade: 3, fornecedorId: null },
  { id: 2, nome: 'Maraca',  categoria: 'Extração',   descricao: 'Bomba de sucção para garimpo em áreas alagadas',               preco: 12000, quantidade: 5, fornecedorId: null },
  { id: 3, nome: 'Guincho', categoria: 'Içamento',   descricao: 'Guincho mecânico para movimentação de cargas pesadas',         preco: 8500,  quantidade: 8, fornecedorId: null },
  { id: 4, nome: 'Abacaxi', categoria: 'Perfuração', descricao: 'Equipamento de perfuração para garimpo em solo duro',          preco: 22000, quantidade: 4, fornecedorId: null },
  { id: 5, nome: 'Lança',   categoria: 'Hidráulico', descricao: 'Lança hidráulica de alta pressão para desmonte de barranco',   preco: 6500,  quantidade: 10, fornecedorId: null },
]
let nextId = 6

const CATEGORIAS = ['Extração', 'Içamento', 'Perfuração', 'Hidráulico', 'Outro']

router.get('/categorias', (req, res) => res.json(CATEGORIAS))

router.get('/', (req, res) => res.json(produtos))

router.get('/:id', (req, res) => {
  const p = produtos.find(p => p.id === Number(req.params.id))
  if (!p) return res.status(404).json({ erro: 'Produto não encontrado' })
  res.json(p)
})

router.post('/', (req, res) => {
  const { nome, categoria, descricao, preco, quantidade } = req.body
  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' })
  }
  const novo = {
    id: nextId++,
    nome,
    categoria: categoria || 'Outro',
    descricao: descricao || '',
    preco: Number(preco),
    quantidade: Number(quantidade) || 0,
    fornecedorId: null
  }
  produtos.push(novo)
  res.status(201).json(novo)
})

router.put('/:id', (req, res) => {
  const idx = produtos.findIndex(p => p.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' })
  produtos[idx] = { ...produtos[idx], ...req.body }
  res.json(produtos[idx])
})

router.delete('/:id', (req, res) => {
  produtos = produtos.filter(p => p.id !== Number(req.params.id))
  res.sendStatus(204)
})

module.exports = router
module.exports.getProdutos = () => produtos
module.exports.setProdutos = (arr) => { produtos = arr }
