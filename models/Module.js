import { Description } from "@mui/icons-material";
import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Module = sequelize.define('Module', {
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

export default Module;