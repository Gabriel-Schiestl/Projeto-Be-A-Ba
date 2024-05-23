import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Profile = sequelize.define('Profile', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

})