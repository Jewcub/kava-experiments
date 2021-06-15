const fetch = require('node-fetch');
const init = require('./init');
const {API_URL, pPrint, runExec, dkvcli , Kava} = init;


/**
 * WALLET SETUP
 */

const newUserMnemonic = Kava.crypto.generateMnemonic();
// pPrint(mnemonic, 'mnemonic');

const defaultUserMnemonic =
  'season bone lucky dog depth pond royal decide unknown device fruit inch clock trap relief horse morning taxi bird session throw skull avocado private';
const defaultUserAddress = 'kava173w2zz287s36ewnnkf4mjansnthnnsz7rtrxqc';

const client = new Kava.KavaClient(API_URL);
client.setWallet(defaultUserMnemonic);

const newAddress = client.wallet.address;

const recoverCmd = (addressName, mnemonic) =>
  `${dkvcli} keys add ${addressName} --recover && ${mnemonic}`;
const sendCoinsCmd = (sendAddressName, receiveAddress, amount, currency) =>
  `${dkvcli} tx send ${sendAddressName} ${receiveAddress} ${amount}${currency} --chain-id kava-localnet`;


const runTest = async () => {
  // await init.initialize();
  await init.start();
  runExec(recoverCmd(init.devWalletName, init.devWalletMnemonic))
  runExec(sendCoinsCmd(init.devWalletAddName, init.devWalletAdd, 100000000000000, 'ukava'));
};


module.exports = runTest