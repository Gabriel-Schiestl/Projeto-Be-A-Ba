import { DataTypes } from "sequelize";
import sequelize from "utils/db";
import Profile from "./Profile";

const User = sequelize.define('User', {
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
        type: DataTypes.DATE,
        allowNull: false,
    },

    profileId: {
        type: DataTypes.INTEGER,
        references: {
            model: Profile,
            key: id,
        }
    },
})

export default User;