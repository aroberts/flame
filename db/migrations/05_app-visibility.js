const { DataTypes } = require('sequelize');
const { INTEGER } = DataTypes;

const visFields = ['allowUsers', 'denyUsers', 'allowGroups', 'denyGroups'];

const up = async (query) => {
  for (const f of visFields) {
    await query.addColumn('apps', f, {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
};

const down = async (query) => {
  for (const f of visFields) {
    await query.removeColumn('apps', f);
  }
};

module.exports = {
  up,
  down,
};
