import sequelize from "utils/db";
import Users from "./Users";
import Profiles from "./Profiles";
import Functions from "./Functions";
import Modules from "./Modules";
import Transactions from "./Transactions";

const ProfilesFunctions = sequelize.define('ProfilesFunctions', {}, {
    schema: 'projeto'
});

const ModulesTransactions = sequelize.define('ModulesTransactions', {}, {
    schema: 'projeto'
});

const ProfilesModules = sequelize.define('ProfilesModules', {}, {
    schema: 'projeto'
})

const ModulesTransactionsProfiles = sequelize.define('ModulesTransactionsProfiles', {}, {
    schema: 'projeto'
})

Modules.belongsToMany(Transactions, { through: ModulesTransactionsProfiles });
Transactions.belongsToMany(Modules, { through: ModulesTransactionsProfiles });

Profiles.belongsToMany(Modules, { through: ProfilesModules });
Modules.belongsToMany(Profiles, { through: ProfilesModules });

Profiles.hasMany(Users, { foreignKey: 'profileId' });
Users.belongsTo(Profiles, { foreignKey: 'profileId' });

Profiles.belongsToMany(Functions, { through: ProfilesFunctions });
Functions.belongsToMany(Profiles, { through: ProfilesFunctions });

Modules.belongsToMany(Transactions, { through: ModulesTransactions });
Transactions.belongsToMany(Modules, { through: ModulesTransactions });

sequelize.sync({ force: false });

export default { Users, Profiles, Functions, Modules, Transactions, ModulesTransactions, ProfilesModules, ModulesTransactionsProfiles }