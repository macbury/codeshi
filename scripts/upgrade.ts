// https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades#script-usage

import fs from 'fs'
import { ethers, upgrades } from "hardhat"
import { loadContractInfo } from './contractAddress';

async function main() {
  const { Token: ContractAddress } = loadContractInfo('codeshi')
  const Codeshi = await ethers.getContractFactory("CodeshiToken");
  const codeshi = await upgrades.upgradeProxy(ContractAddress, Codeshi);
  console.log("Codeshi upgraded", codeshi.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });