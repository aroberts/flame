const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const App = sequelize.define(
  'App',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'cancel',
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    isPublic: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    allowUsers: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    denyUsers: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allowGroups: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    denyGroups: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    tableName: 'apps',
  }
);

module.exports = App;
