const Kava = require('@kava-labs/javascript-sdk');
const execSync = require('child_process').execSync;

const LOCAL_API_URL = 'http://localhost:1317';
const LIVE_API_URL = 'https://kava4.data.kava.io';
const TESTNET_URL = 'https://api.testnet-12000.kava.io';

const API_URL = LOCAL_API_URL;

const pPrint = (obj, label = null, depth = null) => {
	if (label) console.log('*****' + label + '*****:\n');
	console.dir(obj, { depth: depth });
};
const runExec = (cmd) => {
	try {
		execSync(cmd, { stdio: 'inherit' });
	} catch (error) {
		console.log(`Status Code: ${error.status} with '${error.message}'`);
	}
};

const dkvcli = 'docker exec generated_kavanode_1 kvcli';

const startTestNet = () => {
	runExec(
		`kvtool testnet bootstrap --kava.configTemplate master && ${dkvcli} status`
	);
};
// startTestNet();

const mnemonic = Kava.crypto.generateMnemonic();
// pPrint(mnemonic, 'mnemonic');

const client = new Kava.KavaClient(API_URL);
client.setWallet(mnemonic);

const myWalletAdd = 'kava1svgnjkqeyg80q78k7egrvvkpuyt70fxunkwgke';

const newAddress = client.wallet.address;

module.exports = {
	Kava,
	API_URL,
	mnemonic,
	client,
	newAddress,
	myWalletAdd,
	dkvcli,
	pPrint,
	runExec,
};
