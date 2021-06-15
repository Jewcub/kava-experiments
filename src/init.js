const Kava = require('@kava-labs/javascript-sdk');
const fetch = require('node-fetch');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const utils = require('./utils');
const { pPrint, runExec, fetchJSON } = utils;

/**
 * ENVS
 */

const devWalletAdd = process.env.DEV_WALLET_ADDRESS;
const devWalletName = 'address11';
const devWalletMnemonic = process.env.DEV_WALLET_MNEMONIC;
//** Change is not on mac m1 amd chip */
const ARCH_ENV = 'arm';
//** I found it better to run kvtool from  */
const KVTOOL_DIR = path.join('/Users/jacob/Documents/GitHub/kava/kvtool');
const THIS_DIR = path.join(__dirname, '/');
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
}`;
const configKvtoolCmd = `${archPrefix} cd ${KVTOOL_DIR} && kvtool testnet gen-config kava binance deputy --kava.configTemplate master`;
const pullTestnetImgsCmd = `${archPrefix} cd ${KVTOOL_DIR}/full_configs/generated && docker-compose pull`;
const startTestnetCmd = `docker-compose --file ${KVTOOL_DIR}/full_configs/generated docker-compose.yaml up -d && ${dkvcli} status`;
const purgeConfigCmd = `cd ${KVTOOL_DIR} && rm -rf ./full_configs/generated`;
const purgeDockerCmd = `docker image prune --all --force`;
/** `kvtool testnet up --kava.configTemplate master && ${dkvcli} status` */
const startTestnet = () => runExec(startTestnetCmd);

/** fixes bug on mac m1 silicon where docker pulls the incompatible arm image */
const reWriteDockerfile = () => {
  try {
    const filePath = `${KVTOOL_DIR}/full_configs/generated/binance/Dockerfile`;
    const data = readFileSync(filePath, 'utf8');
    if (data.includes('--platform=linux/amd64 ')) return null;
    console.log('rewriting Dockerfile\n')
    const insertIndex = data.indexOf('ubuntu:');
    const replacement =
      data.substring(0, insertIndex) +
      '--platform=linux/amd64 ' +
      data.substring(insertIndex);
    writeFileSync(filePath, replacement);
  } catch (err) {
    console.error(err);
  }
};

const getNodeInfo = async () => {
  const res = await fetch(`${API_URL}/node_info`);
  const data = await res.json();
  pPrint(data.node_info, 'node_info');
  return data;
};

const purgeDocker = () => {
  console.log('purging docker images\n');
  runExec(purgeDockerCmd);
};
const purgeConfig = () => {
  console.log('purging config\n');
  runExec(purgeConfigCmd);
};

const initialize = async () => {
  // purgeDocker();
  // purgeConfig();
  console.log('configuring kava\n', configKvtoolCmd);
  runExec(`${configKvtoolCmd}`);
  if ( ARCH_ENV === 'arm') reWriteDockerfile()
  console.log('pulling images\n', pullTestnetImgsCmd);
  runExec(`${pullTestnetImgsCmd}`);
};

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
  purgeDocker,
  purgeConfig,
  reWriteDockerfile,
};
