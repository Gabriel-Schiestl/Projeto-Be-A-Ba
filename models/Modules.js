import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Modules = sequelize.define('modules', {
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
}, {
    schema: 'projeto'
})

export default Modules;