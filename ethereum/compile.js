const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const builPath = path.resolve('ethereum', 'build');
const campaignPath = path.resolve('ethereum', 'contracts', 'Campaign.sol');
const campaignSource = fs.readFileSync(campaignPath, 'utf8');

const input = {
	language: 'Solidity',
	sources: {
		'Campaign.sol': {
			content: campaignSource
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

for (let contract in output['Campaign.sol']) {
	fs.outputJsonSync(
		path.resolve(builPath, `${contract}.json`),
		output['Campaign.sol'][contract]
	);
}