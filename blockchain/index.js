const Block = require('./block')

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()]
    }


    // function to add block
    addBlock(data){
        const lastBlock = this.chain[this.chain.length-1]
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block)

        return block
    }

    isValidChain(chain){
        // cek kalau genesis block ada di bc
        // JSON.stringif dipakai buat compare object, tapi dijadiin str dlu
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false

        // cek semua block yg ada di bc
        for (let i=1; i<chain.length; i++){
            const block = chain[i]
            const lastBlock = chain[i-1]

            if(block.lastHash !== lastBlock.hash || 
               block.hash !== Block.blockHash(block)){
                return false 
            }
        }

        return true

    }

    // !-- Kurang paham sama fungsi ini 
    replaceChain(newChain) {
        // make sure it has valid chain 
        // Kalau < berarti bner
        if(newChain.length <= this.chain.length){
            console.log('Receive chain is not longer than the current chain')
            return
        } else if (!this.isValidChain(newChain)){
            console.log('The receive chain is not valid')
            return
        }  

        console.log('Replacing blockchain with the new chain')
        this.chain = newChain
    }

}


module.exports = Blockchain