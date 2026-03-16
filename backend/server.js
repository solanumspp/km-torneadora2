const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/fornecedores', require('./controllers/fornecedorController'))
app.use('/produtos',     require('./controllers/produtoController'))
app.use('/associacao',   require('./controllers/associacaoController'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`)
})
