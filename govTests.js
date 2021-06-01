const fetch = require('node-fetch');
const init = require('./init');
const API_URL = init.API_URL;
const pPrint = init.pPrint;
const runExec = init.runExec;
const dkvcli = init.dkvcli;
async function fetchJSON(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`bad response status ${response.status}`);
	}
	return response.json();
}

const getDelegatedBalanceUrl = (address) =>
	`${API_URL}/staking/delegators/${address}/delegations`;

async function getDelegated() {
	console.log(getDelegatedBalanceUrl(myWalletAdd));
	const res = await fetchJSON(getDelegatedBalanceUrl(myWalletAdd));
	const data = await res.json();
	return data;
}

const getAllValidators = async () => {
	const res = await fetch(`${API_URL}/staking/validators`);
	const data = await res.json();
	return data;
};

const getLatestBlocks = async () => {
	const res = await fetch(`${API_URL}/blocks/latest`);
	const data = await res.json();
	return data;
};
const getNodeInfo = async () => {
	const res = await fetch(`${API_URL}/node_info`);
	const data = await res.json();
	pPrint(data.node_info.listen_addr, 'listen_addr');
	return data;
};

// give a user tokens
const giveUserTokens = () => {
	// runExec(`${dkvcli} keys add user_bob --output json`);
	runExec(`${dkvcli} keys show user_bob -a `);
	runExec(
		`${dkvcli} tx send ${init.newAddress} ${init.newAddress} 100000000000000ukava --from user_bob && y`
	);
};

// stake the user's tokens
const stakeUserTokens = async () => {
	const validators = await getAllValidators();
	const validator = validators.result[0];
};

// make a proposal
const makeProposal = () => {
	//
};

// vote on a proposal
const voteOnProposal = () => {
	//
};

const test = async () => {
	try {
		// getNodeInfo();
		giveUserTokens();
	} catch (error) {
		pPrint(error, 'error');
	}
};

module.exports = test;
