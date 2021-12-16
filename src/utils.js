const execSync = require('child_process').execSync;
const execAsync = require('child_process').exec;

const fetch = require('node-fetch');
/** Pretty print objects in node.js */
const pPrint = (obj, label = null, depth = null) => {
  if (label) console.log('*****' + label + '*****:\n');
  console.dir(obj, { depth: depth });
};
/** Run command line commands (synchronous) */
const run = (cmd) => {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    pPrint(error, 'error');
    console.log(`Status Code: ${error.status} with '${error.message}'`);
  }
};

function runRead(command) {
  return new Promise(function (resolve, reject) {
    execAsync(command, function (error, standardOutput, standardError) {
      if (error) {
        reject();
        return;
      }
      if (standardError) {
        reject(standardError);
        return;
      }
      resolve(standardOutput);
    });
  });
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`bad response status ${response.status}`);
  }
  return response.json();
}

module.exports = { pPrint, run, runRead, fetchJSON };
