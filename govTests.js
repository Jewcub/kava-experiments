const fetch = require('node-fetch');
const init = require('./init');
const API_URL = init.API_URL;
const pPrint = init.pPrint;
const runExec = init.runExec;
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
const test = async () => {
	try {
		// getNodeInfo();
	} catch (error) {
		pPrint(error, 'error');
	}
	return await getAllValidators();
};

// make a proposal

// give a user tokens

// stake the user's tokens

// vote on a proposal

module.exports = test;
