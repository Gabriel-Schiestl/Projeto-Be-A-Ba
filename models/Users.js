import { DataTypes } from "sequelize";
import sequelize from "utils/db";
import Profiles from "./Profiles";

const Users = sequelize.define('users', {
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

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    profileId: {
        type: DataTypes.INTEGER,
        references: {
            model: Profiles,
            key: 'id',
        }
    }

}, {
    schema: 'projeto'
})

export default Users;