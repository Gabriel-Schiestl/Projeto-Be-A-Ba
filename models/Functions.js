import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Functions = sequelize.define('functions', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    schema: 'projeto'
})

export default Functions;