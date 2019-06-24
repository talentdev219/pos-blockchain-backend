const express = require('express')
const bp = require('body-parser')
const cors = require('cors')

const Blockchain = require('../blockchain')
const P2pServer = require('./p2p-server') 
const Wallet = require('../wallet')
const TransactionPool = require('../wallet/transaction-pool')
const Miner = require('./miner')

const HTTP_PORT = process.env.HTTP_PORT || 3001 // biar bisa manggil banyak port

const app = express()
const bc = new Blockchain()
const wallet = new Wallet()
const tp = new TransactionPool()
const p2p = new P2pServer(bc, tp)
const miner = new Miner(bc, tp, wallet, p2p)

app.use(cors()); // allow cors fpr http req
app.use(bp.json()) // allow us to receive json on post request

app.get('/blocks', (req,res) => {
  res.json(bc.chain)
})

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data)
  console.log(`New block added: ${block.toString()}`)

  p2p.syncChains()

  res.redirect('/blocks')
})

// user can interact with transaction pool
app.get('/transactions', (req, res) => {
  res.json(tp.transactions)
})

// add transaction to transaction pool 
app.post('/transac', (req, res) => {
  const { recipient, amount, id_kartu } = req.body
  const transaction = wallet.createTransaction(recipient, amount, id_kartu, bc, tp)
  p2p.broadcastTransaction(transaction)
  res.redirect('/transactions') 
})


// endpoint to mine transaction
app.get('/mine-transactions', (req, res) => {
  const block = miner.mine()
  console.log(`New block added: ${block.toString()}`)
  res.redirect('/blocks')
})

// enpoint to see public key of user
app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

app.listen(HTTP_PORT, () => console.log(`jalan di http://localhost:${HTTP_PORT}`))
p2p.listen()  