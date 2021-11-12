const fetch = require('node-fetch');
const init = require('./init');
const fetchJSON = require('./utils').fetchJSON;
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

const whaleSend = `${dkvcli} tx bank send whale kava10x8cvphxl2ddykg73fhc7nhzqvt0h4h6y5t2nl 20000000000usdx,20000000000swp,20000000000hard,200000000000ukava,200000000000bnb,200000000000busd,200000000000xrpb,200000000000btcb -y`;

const dockerCopyCommand =
  'docker cp ./src/example.json generated_kavanode_1:/root/kava/example.json';
// const submitProposalCommand = `${dkvcli} tx committee submit-proposal {committee id} example.json --from committee`;
// const submitProposalCommand = `${dkvcli} tx gov submit-proposal --proposal example.json`;
const submitProposalCommand = `${dkvcli} tx gov submit-proposal param-change example.json --from whale -y`;
const queryCommitteesCmd = `${dkvcli} q committee committees`;
const queryProposalsCmd = `${dkvcli} q gov proposals`;
const gov = `${dkvcli} tx gov -h`;
const checkProp = `${dkvcli} ls && cat`;
const test = async () => {
  try {
    // await init.initialize();
    await init.start();
    await init.getNodeInfo();
    // runExec(gov);

    runExec(dockerCopyCommand);
    runExec(submitProposalCommand);
    runExec(queryProposalsCmd);
  } catch (error) {
    pPrint(error, 'error');
  }
};

module.exports = test;
