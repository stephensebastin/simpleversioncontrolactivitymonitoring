'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class changeset_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      this.belongsTo(models.changesets, {as:'changeset', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    }
  };
  changeset_details.init({
    addition: DataTypes.JSON,
    deletion: DataTypes.STRING,
    changes: DataTypes.JSON,
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    /*,
    changeset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'changesets',
        key: 'id',
      }
    }*/
  }, {
    sequelize,
    modelName: 'changeset_details',
  });
  return changeset_details;
};