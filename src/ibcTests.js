const init = require('./init');
const { pPrint } = require('./utils');
const { sendCoinsCmd } = require('./walletTests');
const { run, runRead, dkvcli, ibcDkvcli, devWalletAdd } = init;
const ibcTransferCmd = (from, to, amount, coin) =>
  `${ibcDkvcli} tx ibc-transfer transfer transfer channel-0 ${to} ${amount}${coin} --from ${from} -y`;
const checkIbcTxBalance = (add) => `${dkvcli} q bank balances ${add}`;
const decodeDenom = (denom) => `${dkvcli} q ibc-transfer denom-trace ${denom}`;
const runTest = async () => {
  run(sendCoinsCmd('whale', devWalletAdd, 100000000000000, 'ukava'));
  run(sendCoinsCmd('whale', devWalletAdd, 100000000000000, 'ukava', ibcDkvcli));
  run(ibcTransferCmd('whale', devWalletAdd, 100000000000000, 'uosmo'));
  // const balanceOutput = await runRead(checkIbcTxBalance(devWalletAdd));
  // const balances = balanceOutput.split('\n');
  // let denom;
  // pPrint(balances, 'balances');
  // balances.forEach((line) => {
  //   if (line.includes('denom') && line.includes('ibc/')) {
  //     denom = line.split('ibc/')[1];
  //   }
  // });
  // console.log({ denom });
  // const denomDecoded = await runRead(decodeDenom(denom));
  // console.log({ denomDecoded });
};

module.exports = { runTest };
