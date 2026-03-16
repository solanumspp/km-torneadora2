const express = require('express')
const router = express.Router()
const supabase = require('../db/supabase')

const CATEGORIAS = ['Extração', 'Içamento', 'Perfuração', 'Hidráulico', 'Outro']

router.get('/categorias', (req, res) => res.json(CATEGORIAS))

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true })

  if (error) return res.status(500).json({ erro: error.message })

  const formatted = data.map(p => ({
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    descricao: p.descricao,
    preco: Number(p.preco),
    quantidade: p.quantidade,
    fornecedorId: p.fornecedor_id
  }))

  res.json(formatted)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error) return res.status(500).json({ erro: error.message })
  if (!data) return res.status(404).json({ erro: 'Produto não encontrado' })

  const formatted = {
    id: data.id,
    nome: data.nome,
    categoria: data.categoria,
    descricao: data.descricao,
    preco: Number(data.preco),
    quantidade: data.quantidade,
    fornecedorId: data.fornecedor_id
  }

  res.json(formatted)
})

router.post('/', async (req, res) => {
  const { nome, categoria, descricao, preco, quantidade } = req.body
  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' })
  }

  const { data, error } = await supabase
    .from('produtos')
    .insert({
      nome,
      categoria: categoria || 'Outro',
      descricao: descricao || '',
      preco: Number(preco),
      quantidade: Number(quantidade) || 0
    })
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  const formatted = {
    id: data.id,
    nome: data.nome,
    categoria: data.categoria,
    descricao: data.descricao,
    preco: Number(data.preco),
    quantidade: data.quantidade,
    fornecedorId: data.fornecedor_id
  }

  res.status(201).json(formatted)
})

router.put('/:id', async (req, res) => {
  const updates = {}
  if (req.body.nome) updates.nome = req.body.nome
  if (req.body.categoria) updates.categoria = req.body.categoria
  if (req.body.descricao !== undefined) updates.descricao = req.body.descricao
  if (req.body.preco) updates.preco = Number(req.body.preco)
  if (req.body.quantidade !== undefined) updates.quantidade = Number(req.body.quantidade)
  if (req.body.fornecedorId !== undefined) updates.fornecedor_id = req.body.fornecedorId

  const { data, error } = await supabase
    .from('produtos')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })
  if (!data) return res.status(404).json({ erro: 'Produto não encontrado' })

  const formatted = {
    id: data.id,
    nome: data.nome,
    categoria: data.categoria,
    descricao: data.descricao,
    preco: Number(data.preco),
    quantidade: data.quantidade,
    fornecedorId: data.fornecedor_id
  }

  res.json(formatted)
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ erro: error.message })
  res.sendStatus(204)
})

module.exports = router
