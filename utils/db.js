import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE,
    'postgres', 
    process.env.PASSWORD, 
    {
    host: process.env.HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: false
    }
});

export default sequelize;