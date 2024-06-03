import { DataTypes } from "sequelize";
import sequelize from "utils/db";

const Profiles = sequelize.define('profiles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

}, {
    schema: 'projeto'
})

export default Profiles;