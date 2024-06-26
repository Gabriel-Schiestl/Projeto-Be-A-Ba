import { DataTypes } from 'sequelize';
import sequelize from "utils/db";
import Modules from "./Modules";
import Profiles from "./Profiles";
import Transactions from "./Transactions";

const ProfileModulesTransactions = sequelize.define('ProfileModulesTransactions', {

  profile_id: {
    type: DataTypes.INTEGER,
    primaryKey: false,
    references: {
      model: Profiles,
      key: 'id'
    }
  },
  module_id: {
    type: DataTypes.INTEGER,
    primaryKey: false,
    references: {
      model: Modules,
      key: 'id'
    }
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: false,
    references: {
      model: Transactions,
      key: 'id'
    }
  }
}, {
  schema: 'projeto'
});

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

export default ProfileModulesTransactions;