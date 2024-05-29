import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Transactions = sequelize.define('transactions', {
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
    }
}, {
    schema: 'projeto'
})

export default Transactions;