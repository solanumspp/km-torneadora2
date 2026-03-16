const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nome, cpf_cnpj AS "cpfCnpj", telefone, email, cidade, observacao,
              to_char(created_at, 'DD/MM/YYYY') AS "cadastradoEm"
       FROM clientes ORDER BY nome`
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.post('/', async (req, res) => {
  const { nome, cpfCnpj, telefone, email, cidade, observacao } = req.body
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' })
  try {
    const { rows } = await pool.query(
      `INSERT INTO clientes (nome, cpf_cnpj, telefone, email, cidade, observacao)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, cpf_cnpj AS "cpfCnpj", telefone, email, cidade, observacao,
                 to_char(created_at, 'DD/MM/YYYY') AS "cadastradoEm"`,
      [nome, cpfCnpj || '', telefone || '', email || '', cidade || '', observacao || '']
    )
    res.status(201).json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { nome, cpfCnpj, telefone, email, cidade, observacao } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE clientes
       SET nome = COALESCE($1, nome),
           cpf_cnpj = COALESCE($2, cpf_cnpj),
           telefone = COALESCE($3, telefone),
           email = COALESCE($4, email),
           cidade = COALESCE($5, cidade),
           observacao = COALESCE($6, observacao)
       WHERE id = $7
       RETURNING id, nome, cpf_cnpj AS "cpfCnpj", telefone, email, cidade, observacao,
                 to_char(created_at, 'DD/MM/YYYY') AS "cadastradoEm"`,
      [nome, cpfCnpj, telefone, email, cidade, observacao, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Cliente não encontrado' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clientes WHERE id = $1', [req.params.id])
    res.sendStatus(204)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router
