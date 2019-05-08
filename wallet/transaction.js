// logika proses transaksi ada di sini
// kaya transfer uang, dsb 

const ChainUtil = require('../chain-util')
const { MINING_REWARD } = require('../config')
class Transaction{
    constructor(){
        this.id = ChainUtil.id()
        this.input = null 
        this.outputs = []
    }

    // update the transaction 
    update(senderWallet, recipient, amount){
        const senderOutput = this.outputs.find(output => output.address == senderWallet.publicKey)
        if (amount > senderOutput.amount){
            console.log(`Amount: ${amount} exceeds balance`)
            return
        }

        senderOutput.amount = senderOutput.amount - amount
        this.outputs.push({ amount, address: recipient })
        Transaction.signTransaction(this, senderWallet)

        return this
    }


    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this()
        transaction.outputs.push(...outputs)
        Transaction.signTransaction(transaction, senderWallet)
        return transaction
    }

    // create new transaction
    static newTransaction(senderWallet, recipient, amount){        
        // check the balance di wallet bisa gak dipake buat transaksi
        if(amount > senderWallet.balance){
            console.log(`Amount: ${amount} exceeds balance`) // print ke terminal
            return
        } 

        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey }, 
            { amount, address: recipient }
        ])
    }

    // blockchain wallet digunakan untuk confirm & authenticate reward transaction
    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [
            { amount: MINING_REWARD, address: minerWallet.publicKey }
        ])
    }

    // buat input dalam transaksi, tapi jadi signature
    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address, 
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }
}


module.exports = Transaction
