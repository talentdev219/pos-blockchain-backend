// test the transaction pool 

const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')
const Blockchain = require('../blockchain')

describe('TransactionPool', () => {
    let tp, wallet, transaction, bc
    
    // set the variable with something
    beforeEach(() => {
        tp = new TransactionPool()
        wallet = new Wallet()
        bc = new Blockchain()
        transaction = wallet.createTransaction('r4nd0m-4ddr355', 30, bc, tp)
    })

    // test #1: add transaction to the pool
    it('adds transaction to the transaction pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction)
    })

    // test #2: updates transaction in the pool
    it('updates transaction in the pool', () => {
        // buat data transaksi yg uda ada dalam format json
        const oldTransaction = JSON.stringify(transaction)
        // buat transaksi baru 
        const newTransaction = transaction.update(wallet, 'f00-4ddr355', 40)
        tp.updateOrAddTransaction(newTransaction)

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
            .not.toEqual(oldTransaction)
    })

    // test #3 clear the transaction pool
    it('should clear the transaction pool', () => {
        tp.clear()
        expect(tp.transactions).toEqual([])
    })

    // --- kondisi: gabunging transaksi corrup & valid --- 
    describe('mixing valid and corrupt transaction', () => {
        let validTransactions

        beforeEach(() => {
            validTransactions = [...tp.transactions]
            for (let i=0; i<6; i++){
                wallet = new Wallet()
                transaction = wallet.createTransaction('r4nd0m-4ddr355', 30, bc, tp)
                if (i%2==0){
                    transaction.input.amount = 99999
                } else {
                    validTransactions.push(transaction)
                }
            }
        })

        // test #1
        it('should shows a difference between valid and corrupt transactions', () =>{
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
        })

        // test #2
        it('should grabs valid transaction', () => {
            expect(tp.validTransactions()).toEqual(validTransactions)
        })

    })
})