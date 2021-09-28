'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON(){
      return {...this.get(), updatedAt:undefined};
    }
  };
  users.init({
    name: {
     type: DataTypes.STRING,
     allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
     },
    team: {
      type : DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'users',
  });
  return users;
};