// test the transaction 

const Transaction =  require('./transaction')
const Wallet = require('./index')
const { MINING_REWARD } = require('../config')

describe('Transaction', () =>{
    let transaction, wallet, recipient, amount

    // create relevant value before test func.
    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = 'r3c1p1i3nt'    

        transaction = Transaction.newTransaction(wallet, recipient,amount)
    })
    
    // test #1
    // check kalau output = balance - transaksi
    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount)
    })

    // test #2 
    // check kalau amount diterima recipient 
    it('outputs the `amount` added to recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount)
    })

    // test #3 inputs the balance of the wallet
    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    // test #4 
    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    // test #5
    it('invalidates a corrupt transaction', () => {
        // corruptig the transaction 
        // by taking the 1st output & changinng to something unseen 
        transaction.outputs[0].amount = 50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false) 
    })


    // ---- beda kondisi: kondisi kalau amount tx > wallet balance ----
    describe('transacting with an amount that exceed the balance', () => {
        beforeEach(() => {
            amount = 50000
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })


        // test: hasilnya undefined karna balance kurang
        it('does not create transaction', () => {
            expect(transaction).toEqual(undefined)
        })
    })


    // --- condition: updating a transaction ---
    describe('and updating a transaction', () => {
        let nextAmount, nextRecipient

        beforeEach(() => {
            nextAmount = 20
            nextRecipient = 'n3xt-4ddr355' 
            transaction = transaction.update(wallet, nextRecipient, nextAmount)  
        })

        // test #1 sender output substract nextAmount too
        it(`substract the next amount from the sender's output`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount)
        })

        // test #2 next adress sama next amount harus sama & sesuai
        it('outputs amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount )
        })  
    })

    // creating a reward transaction
    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
        })

        // test #1 check miner nerima mining_reward
        it(`reward the miner's wallet`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(MINING_REWARD)
        })
    })
    
})