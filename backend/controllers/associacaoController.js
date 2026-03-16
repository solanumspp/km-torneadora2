const express = require('express')
const router = express.Router()
const produtoCtrl = require('./produtoController')

// POST /associacao  { produtoId, fornecedorId }
router.post('/', (req, res) => {
  const { produtoId, fornecedorId } = req.body
  if (!produtoId || !fornecedorId) {
    return res.status(400).json({ erro: 'produtoId e fornecedorId são obrigatórios' })
  }
  const produtos = produtoCtrl.getProdutos()
  const idx = produtos.findIndex(p => p.id === Number(produtoId))
  if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' })

  produtos[idx].fornecedorId = Number(fornecedorId)
  produtoCtrl.setProdutos(produtos)
  res.json({ mensagem: 'Associação realizada com sucesso', produto: produtos[idx] })
})

// DELETE /associacao/:produtoId — remove vínculo
router.delete('/:produtoId', (req, res) => {
  const produtos = produtoCtrl.getProdutos()
  const idx = produtos.findIndex(p => p.id === Number(req.params.produtoId))
  if (idx === -1) return res.status(404).json({ erro: 'Produto não encontrado' })

  produtos[idx].fornecedorId = null
  produtoCtrl.setProdutos(produtos)
  res.json({ mensagem: 'Associação removida', produto: produtos[idx] })
})

module.exports = router
