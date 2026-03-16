const express = require('express')
const router = express.Router()
const supabase = require('../db/supabase')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .order('id', { ascending: true })

  if (error) return res.status(500).json({ erro: error.message })

  const formatted = data.map(f => ({
    id: f.id,
    nome: f.nome,
    cnpj: f.cnpj,
    materialFornecido: f.material_fornecido,
    email: f.email,
    telefone: f.telefone
  }))

  res.json(formatted)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error) return res.status(500).json({ erro: error.message })
  if (!data) return res.status(404).json({ erro: 'Fornecedor não encontrado' })

  const formatted = {
    id: data.id,
    nome: data.nome,
    cnpj: data.cnpj,
    materialFornecido: data.material_fornecido,
    email: data.email,
    telefone: data.telefone
  }

  res.json(formatted)
})

router.post('/', async (req, res) => {
  const { nome, cnpj, materialFornecido, email, telefone } = req.body
  if (!nome || !cnpj || !materialFornecido) {
    return res.status(400).json({ erro: 'Nome, CNPJ e material fornecido são obrigatórios' })
  }

  const { data, error } = await supabase
    .from('fornecedores')
    .insert({
      nome,
      cnpj,
      material_fornecido: materialFornecido,
      email: email || '',
      telefone: telefone || ''
    })
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  const formatted = {
    id: data.id,
    nome: data.nome,
    cnpj: data.cnpj,
    materialFornecido: data.material_fornecido,
    email: data.email,
    telefone: data.telefone
  }

  res.status(201).json(formatted)
})

router.put('/:id', async (req, res) => {
  const updates = {}
  if (req.body.nome) updates.nome = req.body.nome
  if (req.body.cnpj) updates.cnpj = req.body.cnpj
  if (req.body.materialFornecido) updates.material_fornecido = req.body.materialFornecido
  if (req.body.email !== undefined) updates.email = req.body.email
  if (req.body.telefone !== undefined) updates.telefone = req.body.telefone

  const { data, error } = await supabase
    .from('fornecedores')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })
  if (!data) return res.status(404).json({ erro: 'Fornecedor não encontrado' })

  const formatted = {
    id: data.id,
    nome: data.nome,
    cnpj: data.cnpj,
    materialFornecido: data.material_fornecido,
    email: data.email,
    telefone: data.telefone
  }

  res.json(formatted)
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('fornecedores')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ erro: error.message })
  res.sendStatus(204)
})

module.exports = router
