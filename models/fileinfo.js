'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fileinfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.branches, {as:'branch',onUpdate: 'CASCADE',
      onDelete: 'CASCADE'});
      // define association here
    }
    toJSON(){
      return { ...this.get(),updatedAt:undefined}
    }
  };
  fileinfo.init({
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  /*  branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'branches',
        key: 'id',
      }
    },*/
  }, {
    sequelize,
    modelName: 'fileinfo',
  });
  return fileinfo;
};