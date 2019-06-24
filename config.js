/**
 *  difficulty for mining
 * use for test & app itself
 * it uses dynamic mining difficulty that change on certain time */

const DIFFICULTY = 6

const MINE_RATE  = 5000  // dynamic difficulty in milisecond
const INITIAL_BALANCE = 100000

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE }