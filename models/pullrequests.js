'use strict';
const {
    Model,
    UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class pullrequests extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.branches, { as: 'branch', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
            this.belongsTo(models.users, { as: 'user', onUpdate: 'CASCADE', onDelete: 'CASCADE' });

            // define association here
        }
    };
    pullrequests.init({
        pull_token: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4
        },
        /* user_id: {
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
         },*/
    }, {
        sequelize,
        modelName: 'pullrequests',
    });
    return pullrequests;
};