const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
web3.currentProvider.setMaxListeners(300);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: compiledFactory.evm.bytecode.object })
		.send({ from: accounts[0], gas: '2000000'});

	await factory.methods.createCampaign('100')
		.send({
			from: accounts[0],
			gas: '1000000'
		});

	const addresses = await factory.methods.getDeployedCampaigns().call();
	campaignAddress = addresses[0];

	campaign = await new web3.eth.Contract(
		compiledCampaign.abi,
		campaignAddress
	);
});

describe('Campaigns', () => {
	it('should be deployed successfully', async () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it('should assign successfully the manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(manager, accounts[0])
	});

	it('allows people to contribute money and marks them as approvers', async () => {
		await campaign.methods.contribute()
			.send({
				value: '200',
				from: accounts[1]
			});

		const isContributor = await campaign.methods.approvers(accounts[1]).call()
		const approversCount = await campaign.methods.approversCount().call();

		assert.ok(isContributor);
		assert.equal(approversCount, 1);
	});

	it('requires a minimum contribution', async () => {
		try {
			await campaign.methods.contribute()
			.send({
				value: '50',
				from: accounts[1]
			});

			assert(false);

		} catch (err) {
			assert(err);
		}
	});

	it('allows the manager to make a payment request', async () => {
		const description = 'My first payment request';
		const amount = '50';
		const vendor = accounts[3];

		await campaign.methods.createRequest(description, amount, vendor)
			.send({
				from: accounts[0],
				gas: '1000000'
			});

		const request = await campaign.methods.requests(0).call();

		assert.equal(request.description, description);
		assert.equal(request.amount, amount);
		assert.equal(request.vendor, vendor);
	});

	it('processes requests', async () => {
		await campaign.methods.contribute()
			.send({
				from: accounts[1],
				value: web3.utils.toWei('10', 'ether')
			});

		await campaign.methods
			.createRequest('End to End requests', web3.utils.toWei('5', 'ether'), accounts[3])
			.send({
				from: accounts[0],
				gas: '1000000'
			});

		await campaign.methods.approveRequest(0)
			.send({
				from: accounts[1],
				gas: '1000000'
			});

		await campaign.methods.finalizeRequest(0)
			.send({
				from: accounts[0],
				gas: '1000000'
			});

		let vendorAmount = await web3.eth.getBalance(accounts[3]);
		vendorAmount = web3.utils.fromWei(vendorAmount, 'ether');
		vendorAmount = parseFloat(vendorAmount);

		const request = await campaign.methods.requests(0).call();

		assert(request.complete);
		assert(vendorAmount > 104);
	});
});