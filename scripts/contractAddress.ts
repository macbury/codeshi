import fs from 'fs'
import { Contract } from "ethers";
import { network } from 'hardhat';

export type TContractInfo = {
  Token: string
}

const ContractsDir = __dirname + "/../";

export function saveContractInfo(tokenName: string, token : Contract) {
  
  if (!fs.existsSync(ContractsDir)) {
    fs.mkdirSync(ContractsDir);
  }

  const contractInfo : TContractInfo = { Token: token.address }

  fs.writeFileSync(
    ContractsDir + `.${tokenName}.${network.name}.json`,
    JSON.stringify(contractInfo, undefined, 2)
  );

  // const TokenArtifact = artifacts.readArtifactSync("Token");

  // fs.writeFileSync(
  //   contractsDir + "/Token.json",
  //   JSON.stringify(TokenArtifact, null, 2)
  // );
}

export function loadContractInfo(tokenName: string) : TContractInfo {
  const contractInfoRaw = fs.readFileSync(ContractsDir + `.${tokenName}.${network.name}.json`)
  return JSON.parse(contractInfoRaw.toString('utf8'))
}