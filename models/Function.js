import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Function = sequelize.define('Function', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
})

export default Function;