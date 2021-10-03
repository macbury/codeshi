const { Wallet } = require('ethers')
const { entropyToMnemonic } = require("@ethersproject/hdnode");
const crypto = require("crypto");
async function main() {
  const str = "hello";

  // secret or salt to be hashed with
  const secret = "This is a secret 🤫";

  // create a md5 hasher
  const md5Hasher = crypto.createHmac("md5", secret);

  // hash the string
  const hash = md5Hasher.update(str).digest('hex');
  const entropy = Buffer.from(hash.slice(0, 16))
  console.log('entropy', entropy)
  const mnemonic = entropyToMnemonic(entropy);
  console.log('mnemonic', mnemonic)
  
  const wallet = Wallet.fromMnemonic(mnemonic);
  console.log('address', wallet.address)
  console.log('privateKey', wallet.privateKey)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });