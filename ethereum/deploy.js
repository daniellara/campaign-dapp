const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'hope bounce arrive mystery logic reveal brass palm lyrics museum protect bargain',
  'https://rinkeby.infura.io/v3/0a8d613198854c048f8245e38e5646c6'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from account: ${accounts[0]}`);

  const deployedContract = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: '0x' + compiledFactory.evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: '2000000'
    });

  console.log(`Contract deployed at address: ${deployedContract.options.address}`);
};

deploy();