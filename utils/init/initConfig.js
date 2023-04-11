const { copyFile, readFile, writeFile } = require('fs/promises');
const checkFileExists = require('../checkFileExists');
const initialConfig = require('./initialConfig.json');

const initConfig = async () => {
  await copyFile('utils/init/initialConfig.json', 'data/config.json');
};

module.exports = initConfig;
