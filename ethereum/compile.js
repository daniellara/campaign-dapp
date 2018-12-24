const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const builPath = path.resolve('ethereum', 'build');
const campaignPath = path.resolve('ethereum', 'contracts', 'Campaign.sol');
const campaignFactoryPath = path.resolve('ethereum', 'contracts', 'CampaignFactory.sol')
const campaignSource = fs.readFileSync(campaignPath, 'utf8');
const campaignFactorySource = fs.readFileSync(campaignFactoryPath, 'utf8');

const input = {
	language: 'Solidity',
	sources: {
		'Campaign.sol': {
			content: campaignSource
		},
		'CampaignFactory.sol': {
			content: campaignFactorySource
		}
	},
	settings: {
		outputSelection: {
				'*': {
						'*': [ '*' ]
				}
		}
	}
}

fs.emptyDirSync(path.resolve('ethereum', 'build'));

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

for (let contract in output) {
	fs.outputJsonSync(
		path.resolve(builPath, `${contract.substring(0, contract.length - 4)}.json`),
		output[contract]
	);
}