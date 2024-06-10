import { Op } from "sequelize";
import bcrypt from 'bcryptjs';
import models from 'models'

const { Users, Profiles, Modules, Transactions, Functions } = models;

export default async function handler(req, res) {

    if (req.method == 'POST') {

        const { name, email, password, register, profile } = req.body;

        try {

            const userExists = await Users.findOne({
                where: {
                    [Op.or]: [
                        { name: name },
                        { email: email },
                        { register: register }
                    ]
                }
            });

            if (userExists) {

                if (userExists.name == name) {

                    return res.status(400).json({ error: "Já existe outro usuário com este nome" });

                }

                if (userExists.email == email) {

                    return res.status(400).json({ error: "Já existe outro usuário com este e-mail" });

                }

                if (userExists.register == register) {

                    return res.status(400).json({ error: "Já existe outro usuário com este registro" });

                }
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await Users.create({
                name: name,
                email: email,
                password: hashedPassword,
                register: register,
                profileId: profile,
            })

            if (!newUser) return res.status(400).json({ error: "Erro ao criar usuário" });

            res.status(201).json({ message: "Sucesso ao criar usuário" });

        } catch (e) {

            res.status(400).json({ error: e.message || "Erro ao criar usuário" });

        }

    } else if (req.method == 'GET') {

        const { id } = req.query;

        try {

            if (id) {

                const user = await Users.findByPk(id, {
                    include: {
                        model: Profiles,
                        as: 'profile',
                    }
                });

                if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

                return res.status(200).json(user);

            } else {

                const users = await Users.findAll();

                if (!users) return res.status(404).json({ error: "Usuários não encontrados" });

                return res.status(200).json(users);
            }

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter usuários" });

        }
    } else if (req.method == 'PUT') {

        const { id } = req.query;
        let { name, email, register, password, profileId } = req.body;

        try {

            if (password) {
                password = bcrypt.hashSync(password, 10);
            } else {
                const user = await Users.findByPk(id);
                password = user.password;
            }

            const result = await Users.update(
                { name: name, email: email, register: register, password: password, profileId: profileId },
                { where: { id: id } }
            )

            if (!result) return res.status(400).json({ error: "Erro ao atualizar usuário" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(400).json({ error: "Erro ao atualizar usuário" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Users.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(400).json({ error: "Erro ao deletar usuário" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(400).json({ error: "Erro ao deletar usuário" });
        }
    }
}