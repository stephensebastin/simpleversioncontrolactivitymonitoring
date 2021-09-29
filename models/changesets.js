'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class changesets extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.branches, { as: 'branch', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
        }
        toJSON() {
            return {...this.get(), updatedAt: undefined };
        }
    };
    changesets.init({
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        /*    branch_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                model: 'branches',
                key: 'id',
              }
            },*/
        /*token: {
          type : DataTypes.UUID,
          defaultValue: UUIDV4
        }*/
    }, {
        sequelize,
        modelName: 'changesets',
    });
    return changesets;
};