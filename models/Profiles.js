import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Profiles = sequelize.define('profiles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },

}, {
    schema: 'projeto'
})

export default Profiles;