// https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades#script-usage
import { ethers, network, upgrades } from 'hardhat'
import { loadContractInfo } from './contractAddress'

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer, tester] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await tester.getAddress()
  );

  const { Token: ContractAddress } = loadContractInfo('codeshi')
  
  console.log('Interacting with contract', ContractAddress)
  const CodeshiToken = await ethers.getContractFactory("CodeshiToken");
  const codeshi = await CodeshiToken.attach(ContractAddress)
  await codeshi.mint(await tester.getAddress(), 30)
  console.log('Minted 30 codeshi')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });