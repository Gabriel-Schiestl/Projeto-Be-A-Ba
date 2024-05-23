import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.database,
    process.env.username, process.env.password, {
    host: process.env.host,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
});

export default sequelize;