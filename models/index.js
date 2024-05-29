import sequelize from "utils/db";
import Users from "./Users";
import Profiles from "./Profiles";
import Functions from "./Functions";
import Modules from "./Modules";
import Transactions from "./Transactions";

const ProfilesFunctions = sequelize.define('ProfilesFunctions', {}, {
    schema: 'projeto'
});
const ProfilesModules = sequelize.define('ProfilesModules', {}, {
    schema: 'projeto'
});
const ProfilesTransactions = sequelize.define('ProfilesTransactions', {}, {
    schema: 'projeto'
});
const ModulesTransactions = sequelize.define('ModulesTransactions', {}, {
    schema: 'projeto'
});

Profiles.hasMany(Users, { foreignKey: 'profileId' });
Users.belongsTo(Profiles, { foreignKey: 'profileId' });

Profiles.belongsToMany(Functions, { through: ProfilesFunctions });
Functions.belongsToMany(Profiles, { through: ProfilesFunctions });

Profiles.belongsToMany(Modules, { through: ProfilesModules });
Modules.belongsToMany(Profiles, { through: ProfilesModules })

Profiles.belongsToMany(Transactions, { through: ProfilesTransactions });
Transactions.belongsToMany(Profiles, { through: ProfilesTransactions });

Modules.belongsToMany(Transactions, { through: ModulesTransactions });
Transactions.belongsToMany(Modules, { through: ModulesTransactions });

sequelize.sync({ force: false }).then(() => {
    console.log('Banco de dados e tabelas criadas!');
});

export default { Users, Profiles, Functions, Modules, Transactions }