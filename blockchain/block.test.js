// auto unit test with jest 

const Block = require('./block')

// jest parameter
describe('Block', () => {
    // deklarasi variable biar bisa dipake di it
    let data, lastBlock, block 
    // jest parameter untuk forEach
    beforeEach(() => {
        data = 'bar'
        lastBlock = Block.genesis()
        block = Block.mineBlock(lastBlock, data)
    })

    // keren, tapi butuh mahamin fungsi it di jest
    it('sets the `data` to the match input', () => {
        expect(block.data).toEqual(data)
    })

    // testing cek hash data
    it('sets the `lastHash` to match the hash of the last block input', () => {
        expect(block.lastHash).toEqual(lastBlock.hash)        
    })

    // testing nonce hash
    it('generate the hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty))
            .toEqual('0'.repeat(block.difficulty))        
    })

    // testing lower the difficulty for slowly mined blocks
    it('lower difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+360000))
            .toEqual(block.difficulty-1)
    })

    // testing raise the difficulty for slowly mined blocks
    it('lower difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1 ))
            .toEqual(block.difficulty+1)
    })

})