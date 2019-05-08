// auto unit test with jest 

const Block = require('./block')
const Blockchain = require('./index')

describe('Blockchain', () => {
    let bc, bc2 

    beforeEach(() => {
        bc = new Blockchain ()
        bc2 = new Blockchain ()
    })
    
    // testing block awal di bc = genesis block
    it('start with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    // test to add new block di bc = data di add block
    it('add a new Block', () => {
        const data = 'foo'
        bc.addBlock(data)

        expect(bc.chain[bc.chain.length-1].data).toEqual(data)
    })

    // testing validate chain 
    it('validates a valid chain', () => {
        bc2.addBlock('foo') // add data foo to bc2

        expect(bc.isValidChain(bc2.chain)).toBe(true)
    })

    // invalidates a chain with a corrupt genesis block
    it('invalidates a chain with a corrupt genesis', () => {
        bc2.chain[0].data = 'Bad Data' // data pertama di chain

        expect(bc.isValidChain(bc2.chain)).toBe(false)
     })

    // invalidates a corrupt chain
    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo') // jadi data kedua di chain
        bc2.chain[1].data = 'Not Foo' // data kedua langsung diganti

        expect(bc.isValidChain(bc2.chain)).toBe(false) // hasilnya false
     })

     // testing replacing the chain with a valid chain
     it('replace the chain with a valid chain', () =>{
        bc2.addBlock('goo')
        bc.replaceChain(bc2.chain)

        expect(bc.chain).toEqual(bc2.chain)
     })

     it('does not replace the chain with one <= to length', () => {
        bc.addBlock('foo')
        bc.replaceChain(bc2.chain)

        expect(bc.chain).not.toEqual(bc2.chain)
     })
})