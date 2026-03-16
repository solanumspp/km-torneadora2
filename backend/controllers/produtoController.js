const express = require('express')
const router = express.Router()
const pool = require('../db')

const CATEGORIAS = ['Extração', 'Içamento', 'Perfuração', 'Hidráulico', 'Outro']

router.get('/categorias', (req, res) => res.json(CATEGORIAS))

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nome, categoria, descricao, preco, quantidade,
              fornecedor_id AS "fornecedorId"
       FROM produtos ORDER BY id`
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nome, categoria, descricao, preco, quantidade,
              fornecedor_id AS "fornecedorId"
       FROM produtos WHERE id = $1`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Produto não encontrado' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.post('/', async (req, res) => {
  const { nome, categoria, descricao, preco, quantidade } = req.body
  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' })
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO produtos (nome, categoria, descricao, preco, quantidade)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, categoria, descricao, preco, quantidade, fornecedor_id AS "fornecedorId"`,
      [nome, categoria || 'Outro', descricao || '', Number(preco), Number(quantidade) || 0]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { nome, categoria, descricao, preco, quantidade } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE produtos
       SET nome = COALESCE($1, nome),
           categoria = COALESCE($2, categoria),
           descricao = COALESCE($3, descricao),
           preco = COALESCE($4, preco),
           quantidade = COALESCE($5, quantidade)
       WHERE id = $6
       RETURNING id, nome, categoria, descricao, preco, quantidade, fornecedor_id AS "fornecedorId"`,
      [nome, categoria, descricao, preco ? Number(preco) : null, quantidade != null ? Number(quantidade) : null, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Produto não encontrado' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM produtos WHERE id = $1', [req.params.id])
    res.sendStatus(204)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router
