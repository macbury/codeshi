// https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades#script-usage
import { ethers, network, upgrades } from 'hardhat'
import { saveContractInfo } from './contractAddress'

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const CodeshiToken = await ethers.getContractFactory("CodeshiToken");
  const codeshi = await upgrades.deployProxy(CodeshiToken, [], { initializer: 'setup' });
  const token = await codeshi.deployed();
  console.log("Codeshi deployed to:", token.address);
  saveContractInfo('codeshi', token)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });