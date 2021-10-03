const fs = require('fs')

const { ETH_NETWORK } = process.env
const { Token } = JSON.parse(fs.readFileSync(`.codeshi.${ETH_NETWORK}.json`))

module.exports = {
  env: {
    Token,
    ETH_NETWORK
  }
}