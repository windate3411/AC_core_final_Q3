'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {});
  Record.associate = function (models) {
    // associations can be defined here
    Record.belongsTo(models.User)
  };
  return Record;
};