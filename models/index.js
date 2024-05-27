import sequelize from "utils/db";
import User from "./User";
import Profile from "./Profile";

Profile.hasMany(User, { foreignKey: 'profileId'});
User.belongsTo(Profile, { foreignKey: 'profileId'});

sequelize.sync({ force: true }).then(() => {
    console.log('Banco de dados e tabelas criadas!');
});

export {User, Profile}