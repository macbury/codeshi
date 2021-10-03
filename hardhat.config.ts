const { infuraUrl, mnemonic } = require('./secrets.json');

import { HardhatUserConfig, HardhatConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle"
import '@openzeppelin/hardhat-upgrades'
import "@nomiclabs/hardhat-web3"
import "hardhat-typechain"

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.7.3",

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        count: 2,
        path: "m/44'/60'/0'/0",
        initialIndex: 0
      }
    },
    ropsten: {
      url: infuraUrl,
      accounts: { mnemonic: mnemonic }
    }
  },
};

export default config
