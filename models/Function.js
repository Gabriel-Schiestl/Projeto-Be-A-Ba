import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Function = sequelize.define('Function', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    register: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    creationDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})