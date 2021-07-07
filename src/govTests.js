const fetch = require('node-fetch');
const init = require('./init');
const fetchJSON = require('./utils').fetchJSON
const API_URL = init.API_URL;
const pPrint = init.pPrint;
const runExec = init.runExec;
const dkvcli = init.dkvcli;



const getDelegatedBalanceUrl = (address) =>
	`${API_URL}/staking/delegators/${address}/delegations`;

async function getDelegated() {
	console.log(getDelegatedBalanceUrl(init.myWalletAdd));
	const res = await fetchJSON(getDelegatedBalanceUrl(init.myWalletAdd));
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
	
	} catch (error) {
		pPrint(error, 'error');
	}
};

module.exports = test;
