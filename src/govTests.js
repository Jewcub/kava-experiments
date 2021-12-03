const fetch = require('node-fetch');
const {
  sendCmd,
  API_URL,
  pPrint,
  run,
  dkvcli,
  devWalletAdd,
  dockerExec,
  initialize,
  start,
  getNodeInfo,
  fetchJSON,
  purgeDocker,
  featV44,
  Kava,
  devWalletMnemonic,
} = require('./init');

const getDelegatedBalanceUrl = (address) =>
  `${API_URL}/staking/delegators/${address}/delegations`;

async function getDelegated() {
  console.log(getDelegatedBalanceUrl(devWalletAdd));
  const res = await fetchJSON(getDelegatedBalanceUrl(devWalletAdd));
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
const stakeUserTokens = async (amount) => {
  // recover command doesnt work in node. must do it manually in terminal
  const devWalletName = `jcr`;
  const recoverCmd = () => `${dkvcli} keys add ${devWalletName}`;
  // jcr
  // run(recoverCmd(user, devWalletMnemonic));
  const validators = await getAllValidators();
  const validator = validators.result[0];
  const validatorAddress = validator.operator_address;
  const stakingCmd = `${dkvcli} tx staking delegate ${validatorAddress} ${amount} --gas 300000 --gas-prices 0.01ukava --from ${devWalletName} -y`;
  run(stakingCmd);
};
const committeePropFile = 'exampleCommitteeProposal.json';
const committeePropFileV44 = 'exampleCommitteeProposalV44.json';
const propFile = 'exampleProposal.json';
const propFileV44 = 'exampleProposalV44.json';

const containerRootFolder = featV44 ? '' : '/root/kava';

const dockerCopyCommand = (filePath) =>
  `docker cp ./src/${filePath} generated_kavanode_1:${containerRootFolder}${filePath}`;

const submitGovProposalCommand = (filePath) =>
  `${dkvcli} tx gov submit-proposal param-change ${filePath} --from whale -y --gas 750000`;
const submitGovProposalCommandV44 = (filePath) =>
  `${dkvcli} tx gov submit-proposal param-change ${filePath} --from committee -y --gas 750000`;
/**
   Swap = 5
   God = 3
    */
const submitCommitteeProposalCommand = (prop, committeeNumber) =>
  `${dkvcli} tx committee submit-proposal ${committeeNumber} ${prop} --from committee -y`;
const submitCommitteeProposalCommandV44 = (prop, committeeNumber) =>
  `${dkvcli} tx committee submit-proposal ${committeeNumber} ${prop} --from committee -y`;

// const submitProposalCommand = `${dkvcli} tx committee submit-proposal {committee id} exampleProposal.json --from committee`;
// const submitProposalCommand = `${dkvcli} tx gov submit-proposal --proposal exampleProposal.json`;

const queryCommitteesCmd = `${dkvcli} q committee committees`;
const queryProposalsCmd = (commNumber) =>
  `${dkvcli} q committee proposals ${commNumber}`;
const govHelp = `${dkvcli} tx gov -h`;
const deleteOld = (prop) => `${dockerExec} rm ${containerRootFolder}${prop}`;
const checkProp = (prop) => `${dockerExec} cat ${prop}`;
const submitProposal = () => {
  if (featV44) {
    // committee
    run(deleteOld(committeePropFileV44));
    run(dockerCopyCommand(committeePropFileV44));
    run(submitCommitteeProposalCommandV44(committeePropFileV44, 5));
    // gov
    run(deleteOld(propFileV44));
    run(dockerCopyCommand(propFileV44));
    run(submitGovProposalCommandV44(propFileV44));
  } else {
    run(deleteOld(propFile));
    run(dockerCopyCommand(propFile));
    run(submitGovProposalCommand(propFile));
    run(deleteOld(committeePropFile));
    run(dockerCopyCommand(committeePropFile));
    run(submitCommitteeProposalCommand(committeePropFile, 5));
  }

  // run(checkProp(committeePropFile));
  // run(queryProposalsCmd);
};

// vote on a proposal
const voteOnProposal = () => {
  //
};

const whaleSend = `${dkvcli} ${sendCmd} whale ${devWalletAdd} 20000000000usdx,20000000000swp,20000000000hard,200000000000ukava,200000000000bnb,200000000000busd,200000000000xrpb,200000000000btcb -y`;

const test = async () => {
  try {
    // await purgeDocker();
    // await initialize();
    await start();
    // await getNodeInfo();
    // run(govHelp);
    // run(whaleSend);
    // run(queryCommitteesCmd);
    submitProposal();
    // stakeUserTokens('20000ukava');
  } catch (error) {
    pPrint(error, 'error');
  }
};

module.exports = test;
