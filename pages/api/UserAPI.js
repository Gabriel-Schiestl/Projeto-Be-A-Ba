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

            if (!newUser) return res.status(500).json({ error: "Erro ao criar usuário" });

            res.status(201).json({ success: "Sucesso ao criar usuário" });

        } catch (e) {

            res.status(500).json({ error: e.message || "Erro ao criar usuário" });

        }

    } else if (req.method == 'GET') {

        const { id } = req.query;
        const {email} = req.query;

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

            } else if(email) {

                const user = await Users.findOne({where: {email: email}});

                if(user) return res.status(200).json({id: user.id});

                return res.status(404).json({error: 'Não há usuário cadastrado com este e-mail'});

            } else {

                const users = await Users.findAll();

                if (!users) return res.status(404).json({ error: "Usuários não encontrados" });

                return res.status(200).json(users);
            }

        } catch (e) {

            res.status(500).json({ error: "Erro ao obter usuários" });

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

            if (!result) return res.status(500).json({ error: "Erro ao atualizar usuário" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao atualizar usuário" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Users.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(500).json({ error: "Erro ao deletar usuário" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao deletar usuário" });
        }
    } else if (req.method == 'PATCH') {

        const {password, id} = req.body;

        const hashedPassword = bcrypt.hashSync(password, 10);

        try {

            const user = await Users.update({password: hashedPassword}, {
                where: {id}
            })

            if(user[0] === 1) return res.status(200).json({success: "Sucesso ao atualizar senha"});

            return res.status(500).json({error: "Erro ao atualizar senha"});

        } catch (e) {
            return res.status(500).json({error: "Erro ao atualizar senha"});
        }

    }
}