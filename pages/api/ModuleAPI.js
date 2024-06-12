import { Op } from "sequelize";
import sequelize from "utils/db";
import models from 'models'

const { Transactions, Modules } = models;

export default async function handler(req, res) {

    if (req.method === 'POST') {

        const { name, tag, description, transactions } = req.body;

        await sequelize.sync();

        try {

            const nameOrTagExists = await Modules.findOne({
                where: {
                    [Op.or]: [
                        { name: name },
                        { tag: tag }
                    ]
                }
            });

            if (nameOrTagExists) {

                if (nameOrTagExists.name == name) {

                    return res.status(400).json({ error: "Já existe outro módulo com este nome" });

                }

                if (nameOrTagExists.tag == tag) {

                    return res.status(400).json({ error: "Já existe outro módulo com esta tag" });

                }
            }

            const newModule = await Modules.create({
                name: name,
                tag: tag,
                description: description,
            });

            if (!newModule) {

                return res.status(500).json({error: "Erro ao criar módulo"});

            } else {

                await newModule.addTransactions(transactions);

            }

            return res.status(201).json({ success: "Módulo criado com sucesso" });

        } catch (e) {

            return res.status(400).json({ error: e.message || "Erro ao criar módulo" });

        }

    } else if (req.method === 'GET') {

        try {

            const { id } = req.query;

            if (id) {

                const module = await Modules.findByPk(id, {
                    include: Transactions
                });

                if (!module) return res.status(404).json({ error: "Módulo não encontrado" });

                return res.status(200).json(module);

            } else {

                const modules = await Modules.findAll({ include: Transactions });

                if (!modules) return res.status(404).json({ error: "Módulos não encontrados" });

                return res.status(200).json(modules);

            }

        } catch (e) {

            return res.status(500).json({ error: "Erro ao obter módulos" });

        }

    } else if (req.method == 'PUT') {

        const { id } = req.query;
        const { name, tag, description, transactions } = req.body;

        try {

            const result = await Modules.update(
                { name: name, tag: tag, description: description },
                { where: { id: id } }
            )

            const module = await Modules.findByPk(id);

            await module.setTransactions(transactions);

            if (!result) return res.status(500).json({ error: "Erro ao atualizar módulo" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao atualizar módulo" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Modules.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(500).json({ error: "Erro ao deletar módulo" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao deletar módulo" });
        }
    } else {

        return res.status(405).json({ error: "Método não permitido" });

    }
}