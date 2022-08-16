// Contracts
const Minter = artifacts.require("Minter")

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts()
    const minter = await Minter.deployed()
    console.log('Minter fetched', minter.address)
    const user = accounts[0]

    await minter.mint(user, 'ipfs://QmSRZ8UeM7U8UTaGidUoeMbvzxPK7PN66Kn1V17tEDzyaj', { from: user })
    console.log(`NFT minted by ${user}`)
  }
  catch(error) {
    console.log(error)
  }

  callback()
}