import { Op } from "sequelize";
import bcrypt from 'bcryptjs';
import models from 'models'

const {Users, Profiles} = models;

export default async function handler(req, res) {

    if (req.method == 'POST') {

        const { userName, email, password, register, profile } = req.body;

        try {

            const nameOrEmailExists = await Users.findOne({
                where: {
                    [Op.or]: [
                        { name: userName },
                        { email: email }
                    ]
                }
            });

            if (nameOrEmailExists) {

                if (nameOrEmailExists.name == moduleName) {

                    return res.status(400).json({ error: "Já existe outro usuário com este nome" });

                }

                if (nameOrEmailExists.email == email) {

                    return res.status(400).json({ error: "Já existe outro usuário com este e-mail" });

                }
            }

            const findProfile = await Profiles.findByPk(profile);

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await Users.create({
                name: userName,
                email: email,
                password: hashedPassword,
                register: register,
                profileId: findProfile.id,
            })

            if(!newUser) throw new Error("Erro ao criar usuário");

            res.status(201).json({ message: "Sucesso ao criar usuário" });

        } catch (e) {

            res.status(400).json({ error: e.message || "Erro ao criar usuário"});

        }

    } else if (req.method == 'GET') {

        try {

            const users = await Users.findAll({
                include: {
                    model: Profiles,
                    include: [Functions, Modules, Transactions]
                }
            });

            res.status(200).json(users);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter usuários" });

        }

    }
}