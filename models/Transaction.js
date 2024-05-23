import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Transaction = sequelize.define('Transaction', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})