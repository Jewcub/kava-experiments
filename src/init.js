const Kava = require('@kava-labs/javascript-sdk');
const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const utils = require('./utils');
const { pPrint, runExec, fetchJSON } = utils;
/**
 * ENVS
 */

const devWalletAdd = process.env.DEV_WALLET_ADDRESS;
const devWalletName = 'address1';
const devWalletMnemonic = process.env.DEV_WALLET_MNEMONIC;
//** Change is not on mac m1 amd chip */
const ARCH_ENV = 'arm';
//** I found it better to run kvtool from  */
const KVTOOL_DIR = path.join(
  '/Users/jacob/Documents/GitHub/kava/kvtool'
);
const THIS_DIR = path.join(__dirname, '/')
const LOCAL_API_URL = 'http://localhost:1317';
// const LIVE_API_URL = 'https://kava4.data.kava.io';
// const TESTNET_API_URL = 'https://api.testnet-12000.kava.io';
/** Pick a testnet from local/live or testnet above*/
const API_URL = LOCAL_API_URL;

/**
 * COMMANDS
 */

/** Alias for kvcli inside the docker container */
const dkvcli = 'docker exec generated_kavanode_1 kvcli';
const archPrefix = `${
  ARCH_ENV === 'arm' ? 'export DOCKER_DEFAULT_PLATFORM=linux/amd64 &&' : ''
}`
const configKvtoolCmd = `${archPrefix} cd ${KVTOOL_DIR} && kvtool testnet gen-config kava binance deputy --kava.configTemplate master`;
const pullTestnetImgsCmd = `${archPrefix} cd ${KVTOOL_DIR}/full_configs/generated && docker-compose pull`;
const startTestnetCmd = `${archPrefix} cd ${KVTOOL_DIR} && kvtool testnet up && ${dkvcli} status`;

/** `kvtool testnet up --kava.configTemplate master && ${dkvcli} status` */
const startTestnet = () => runExec(startTestnetCmd);

const getNodeInfo = async () => {
  const res = await fetch(`${API_URL}/node_info`);
  const data = await res.json();
  pPrint(data.node_info, 'node_info');
  return data;
};

const initialize = async () => {
  console.log('configuring kava ', configKvtoolCmd)
  runExec(`${configKvtoolCmd}`)
  console.log('pulling images ', pullTestnetImgsCmd);
  runExec(`${pullTestnetImgsCmd}`);
}

const start = async () => {
  try {
    await getNodeInfo();
  } catch (error) {
    startTestnet();
    await getNodeInfo();
  }
};


module.exports = {
  Kava,
  API_URL,
  devWalletAdd,
  devWalletName,
  devWalletMnemonic,
  dkvcli,
  pPrint,
  runExec,
  startTestnet,
  getNodeInfo,
  fetchJSON,
  start,
  initialize,
};
