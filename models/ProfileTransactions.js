import Modules from "./Modules";
import Profiles from "./Profiles";
import Transactions from "./Transactions";
import ProfileModulesTransactions from "./ProfileModulesTransactions";

Profiles.belongsToMany(Modules, {
    through: ProfileModulesTransactions,
    foreignKey: 'profile_id'
  });

  Modules.belongsToMany(Profiles, {
    through: ProfileModulesTransactions,
    foreignKey: 'module_id'
  });

  Profiles.belongsToMany(Transactions, {
    through: ProfileModulesTransactions,
    foreignKey: 'profile_id'
  });

  Transactions.belongsToMany(Profiles, {
    through: ProfileModulesTransactions,
    foreignKey: 'transaction_id'
  });

  Modules.belongsToMany(Transactions, {
    through: ProfileModulesTransactions,
    foreignKey: 'module_id'
  });

  Transactions.belongsToMany(Modules, {
    through: ProfileModulesTransactions,
    foreignKey: 'transaction_id'
  });

  export default {Profiles, Modules, Transactions, ProfileModulesTransactions}