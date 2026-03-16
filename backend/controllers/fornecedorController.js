const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, cnpj, material_fornecido AS "materialFornecido", email, telefone FROM fornecedores ORDER BY id'
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, cnpj, material_fornecido AS "materialFornecido", email, telefone FROM fornecedores WHERE id = $1',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Fornecedor não encontrado' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.post('/', async (req, res) => {
  const { nome, cnpj, materialFornecido, email, telefone } = req.body
  if (!nome || !cnpj || !materialFornecido) {
    return res.status(400).json({ erro: 'Nome, CNPJ e material fornecido são obrigatórios' })
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO fornecedores (nome, cnpj, material_fornecido, email, telefone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, cnpj, material_fornecido AS "materialFornecido", email, telefone`,
      [nome, cnpj, materialFornecido, email || '', telefone || '']
    )
    res.status(201).json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { nome, cnpj, materialFornecido, email, telefone } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE fornecedores
       SET nome = COALESCE($1, nome),
           cnpj = COALESCE($2, cnpj),
           material_fornecido = COALESCE($3, material_fornecido),
           email = COALESCE($4, email),
           telefone = COALESCE($5, telefone)
       WHERE id = $6
       RETURNING id, nome, cnpj, material_fornecido AS "materialFornecido", email, telefone`,
      [nome, cnpj, materialFornecido, email, telefone, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Fornecedor não encontrado' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM fornecedores WHERE id = $1', [req.params.id])
    res.sendStatus(204)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router
