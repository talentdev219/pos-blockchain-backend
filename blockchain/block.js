const ChainUtil = require('../chain-util')
const { DIFFICULTY, MINE_RATE } = require('../config') // mining difficulty, biar gampang proses 2 dlu

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty || DIFFICULTY
    }

    toString(){
        return `Block - 
            Timestamp  : ${this.timestamp}
            Last Hash  : ${this.lastHash.substring(0, 10) + '...'}
            Hash       : ${this.hash.substring(0, 10) + '...'}
            Nonce      : ${this.nonce}
            Difficulty : ${this.difficulty}
            Data       : ${this.data}
        `
    } 

    // genesis block
    static genesis(){
        return new this(
            'Genesis Timestamp', 
            '-----', 
            '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
            [],
            '0',
            DIFFICULTY
        )
    }

    // mine block
    static mineBlock(lastBlock,data){
        let hash, timestamp
        const lastHash = lastBlock.hash
        let { difficulty } = lastBlock
        let nonce = 0

        do {
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)   
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty)) // untuk set difficulty 

        return new this(timestamp, lastHash, hash, data, nonce, difficulty)
    }


    // hash with SHA256
    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()

    }

    // static blockHash 
    static blockHash(block){
        const { timestamp, lastHash, data, nonce, difficulty } = block
        return Block.hash(timestamp, lastHash, data, nonce, difficulty)
    }

    // create dynamic difficulty 
    static adjustDifficulty(lastBlock, currentTime){
        let { difficulty } = lastBlock
        // ternary expresion to adjust dificulty
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
        return difficulty    
    }
} 


module.exports = Block