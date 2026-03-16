const express = require('express')
const router = express.Router()
const pool = require('../db')

router.post('/', async (req, res) => {
  const { produtoId, fornecedorId } = req.body
  if (!produtoId || !fornecedorId) {
    return res.status(400).json({ erro: 'produtoId e fornecedorId são obrigatórios' })
  }
  try {
    const { rows } = await pool.query(
      `UPDATE produtos SET fornecedor_id = $1 WHERE id = $2
       RETURNING id, nome, categoria, descricao, preco, quantidade, fornecedor_id AS "fornecedorId"`,
      [Number(fornecedorId), Number(produtoId)]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Produto não encontrado' })
    res.json({ mensagem: 'Associação realizada com sucesso', produto: rows[0] })
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

router.delete('/:produtoId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE produtos SET fornecedor_id = NULL WHERE id = $1
       RETURNING id, nome, categoria, descricao, preco, quantidade, fornecedor_id AS "fornecedorId"`,
      [req.params.produtoId]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Produto não encontrado' })
    res.json({ mensagem: 'Associação removida', produto: rows[0] })
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router
