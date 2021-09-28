'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_branch_mapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.branches, {as:'branch',onUpdate: 'CASCADE',onDelete: 'CASCADE'});
      this.belongsTo(models.users, {as:'user',onUpdate: 'CASCADE',onDelete: 'CASCADE'});    }
  };
  user_branch_mapping.init({
    access_level: {
      type: DataTypes.SMALLINT,
      allowNull:false,
      defaultValue:1
    },
  user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'branches',
        key: 'id',
      }
    },
    

  }, {
    sequelize,
    modelName: 'user_branch_mapping',
  });
  return user_branch_mapping;
};