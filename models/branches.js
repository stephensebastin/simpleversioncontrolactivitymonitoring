'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class branches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        //    const branches = sequelize.define("branches");
        //const changesets = sequelize.define("changesets");

        //const fileinfos = sequelize.define("fileinfo");

        //    this.hasMany(models.changesets);
        //  models.changesets.belongsTo(this);

        //this.hasMany(models.fileinfos);
        //models.fileinfos.belongsTo(this);
    }
    
  };
  branches.init({
    name:{
      type: DataTypes.STRING,
      unique: true,
      allowNull:false
     },
    description: {
      type: DataTypes.STRING,
      allowNull:true
     }
  }, {
    sequelize,
    modelName: 'branches',
  });
  return branches;
};