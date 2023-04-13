const Category = require('../models/Category');
const App = require('../models/App');

const wipeDb = async () => {
  await Category.destroy({ truncate: true });
  await App.destroy({ truncate: true });
};

module.exports = wipeDb;
