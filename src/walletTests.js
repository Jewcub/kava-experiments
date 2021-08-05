const fetch = require('node-fetch');
const init = require('./init');
const { API_URL, pPrint, runExec, dkvcli, Kava } = init;

/**
 * WALLET SETUP
 */

const newUserMnemonic = Kava.crypto.generateMnemonic();
// pPrint(mnemonic, 'mnemonic');
const defaultUserName = 'addr1';
const defaultUserMnemonic =
  'arrive guide way exit polar print kitchen hair series custom siege afraid shrug crew fashion mind script divorce pattern trust project regular robust safe';
const defaultUserAddress = 'kava1vlpsrmdyuywvaqrv7rx6xga224sqfwz3fyfhwq';

const client = new Kava.KavaClient(API_URL);
client.setWallet(defaultUserMnemonic);

const newAddress = client.wallet.address;

const recoverCmd = (addressName, mnemonic) =>
  `${dkvcli} keys add ${addressName} --recover && ${mnemonic}`;
const sendCoinsCmd = (sendAddressName, receiveAddress, amount, currency) =>
  `${dkvcli} tx send ${sendAddressName} ${receiveAddress} ${amount}${currency} --chain-id kava-localnet -y`;

const runTest = async () => {
  // await init.initialize();
  await init.start();
  runExec(recoverCmd(defaultUserName, defaultUserMnemonic));

  runExec(
    sendCoinsCmd(defaultUserName, init.devWalletAdd, 100000000000000, 'ukava')
  );
  runExec(
    sendCoinsCmd(defaultUserName, init.devWalletAdd, 100000000000000, 'usdx')
  );
  runExec(
    sendCoinsCmd(defaultUserName, init.devWalletAdd, 100000000000000, 'bnb')
  );
  runExec(
    sendCoinsCmd(defaultUserName, init.devWalletAdd, 100000000000000, 'hard')
  );
};

module.exports = runTest;
