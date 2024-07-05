import sequelize from "utils/db";
import Users from "./Users";
import Profiles from "./Profiles";
import Functions from "./Functions";
import Modules from "./Modules";
import Transactions from "./Transactions";
import { DataTypes } from "sequelize";

const ProfilesFunctions = sequelize.define('ProfilesFunctions', {}, {
    schema: 'projeto'
});

const ModulesTransactions = sequelize.define('ModulesTransactions', {}, {
    schema: 'projeto'
});

const ProfilesModules = sequelize.define('ProfilesModules', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    profileId: {
        type: DataTypes.INTEGER,
        references: {
            model: Profiles,
            key: 'id',
        }
    },
    moduleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Modules,
            key: 'id',
        }
    }
}, {
    schema: 'projeto'
});

const ProfilesModulesTransactions = sequelize.define('ProfilesModulesTransactions', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    transactionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Transactions,
            key: 'id',
        }
    },
}, {
    schema: 'projeto'
})

Profiles.belongsToMany(Modules, { through: ProfilesModules });
Modules.belongsToMany(Profiles, { through: ProfilesModules });

ProfilesModules.belongsToMany(Transactions, { through: ProfilesModulesTransactions });
Transactions.belongsToMany(ProfilesModules, { through: ProfilesModulesTransactions });

Profiles.hasMany(Users, { foreignKey: 'profileId' });
Users.belongsTo(Profiles, { foreignKey: 'profileId' });

Profiles.belongsToMany(Functions, { through: ProfilesFunctions });
Functions.belongsToMany(Profiles, { through: ProfilesFunctions });

Modules.belongsToMany(Transactions, { through: ModulesTransactions });
Transactions.belongsToMany(Modules, { through: ModulesTransactions });

sequelize.sync({ force: false });

export default { Users, Profiles, Functions, Modules, Transactions, ModulesTransactions, ProfilesModules, ProfilesModulesTransactions }