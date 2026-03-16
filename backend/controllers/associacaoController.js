const express = require('express')
const router = express.Router()
const supabase = require('../db/supabase')

router.post('/', async (req, res) => {
  const { produtoId, fornecedorId } = req.body
  if (!produtoId || !fornecedorId) {
    return res.status(400).json({ erro: 'produtoId e fornecedorId são obrigatórios' })
  }

  const { data, error } = await supabase
    .from('produtos')
    .update({ fornecedor_id: Number(fornecedorId) })
    .eq('id', Number(produtoId))
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

  res.json({ mensagem: 'Associação realizada com sucesso', produto: formatted })
})

router.delete('/:produtoId', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .update({ fornecedor_id: null })
    .eq('id', Number(req.params.produtoId))
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

  res.json({ mensagem: 'Associação removida', produto: formatted })
})

module.exports = router
