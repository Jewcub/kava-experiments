const Kava = require('@kava-labs/javascript-sdk');
const fetch = require('node-fetch');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const utils = require('./utils');
const { pPrint, run, fetchJSON } = utils;
const featV44 = process.env.FEAT_V44 === 'true';

console.log({ featV44 });
/*
V44 changes
*/
let cliCmd = 'kvcli';
if (featV44) cliCmd = 'kava'; //v44
// let kavaVersion = 'v0.15';
let kavaVersion = 'master';
if (featV44) kavaVersion = 'upgrade-v44';
let sendCmd = 'tx send'; // before v44
if (featV44) sendCmd = 'tx bank send';

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
const KVTOOL_CONFIG_DIR = '/full_configs/generated';
const THIS_DIR = path.join(__dirname, '/');
const LOCAL_API_URL = 'http://localhost:1317';
// const LIVE_API_URL = 'https://kava4.data.kava.io';
// const TESTNET_API_URL = 'https://api.testnet-12000.kava.io';
/** Pick a testnet from local/live or testnet above*/
const API_URL = LOCAL_API_URL;

/** Alias for kvcli inside the docker container */
const dockerExec = 'docker exec generated_kavanode_1 ';

const dkvcli = dockerExec + cliCmd;

const archPrefix = `${
  ARCH_ENV === 'arm' ? 'export DOCKER_DEFAULT_PLATFORM=linux/amd64 &&' : ''
}`;
const configTemplate = `--kava.configTemplate ${kavaVersion}`;
/** `${KVTOOL_DIR}${KVTOOL_CONFIG_DIR} docker-compose.yaml up -d && ${dkvcli} status` */

const startTestnet = () => {
  const startTestnetCmd = `docker-compose --file ${KVTOOL_DIR}${KVTOOL_CONFIG_DIR}/docker-compose.yaml down && docker-compose --file ${KVTOOL_DIR}${KVTOOL_CONFIG_DIR}/docker-compose.yaml up -d && ${dkvcli} status`;
  run(startTestnetCmd);

  // run('kvtool testnet up');
};

/** fixes bug on mac m1 silicon where docker pulls the incompatible arm image */
const reWriteDockerfile = () => {
  try {
    const filePath = `${KVTOOL_DIR}${KVTOOL_CONFIG_DIR}/binance/Dockerfile`;
    const data = readFileSync(filePath, 'utf8');
    if (data.includes('--platform=linux/amd64 ')) return null;
    console.log('rewriting Dockerfile\n');
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
  const purgeDockerCmd = `docker image prune --all --force`;
  console.log('purging docker images\n');
  run(purgeDockerCmd);
};

const purgeConfig = () => {
  const purgeConfigCmd = `cd ${KVTOOL_DIR} && rm -rf .${KVTOOL_CONFIG_DIR}`;
  console.log('purging config\n');
  run(purgeConfigCmd);
};

const initialize = async () => {
  const configKvtoolCmd = `${archPrefix} cd ${KVTOOL_DIR} && kvtool testnet gen-config kava binance deputy ${configTemplate}`;
  const pullTestnetImgsCmd = `${archPrefix} cd ${KVTOOL_DIR}${KVTOOL_CONFIG_DIR} && docker-compose pull`;

  purgeConfig();
  console.log('configuring kava\n', configKvtoolCmd);
  run(`${configKvtoolCmd}`);
  if (ARCH_ENV === 'arm') reWriteDockerfile();
  console.log('pulling images\n', pullTestnetImgsCmd);
  run(`${pullTestnetImgsCmd}`);

  // run('kvtool testnet bootstrap');
};

const start = async () => {
  try {
    await getNodeInfo();
    console.log('**** TESTNET ALREADY RUNNING **** ');
  } catch (error) {
    startTestnet();
    console.log('**** STARTING NEW TESTNET **** ');
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
  run,
  startTestnet,
  getNodeInfo,
  fetchJSON,
  start,
  initialize,
  purgeDocker,
  purgeConfig,
  reWriteDockerfile,
  sendCmd,
  dockerExec,
  featV44,
};
