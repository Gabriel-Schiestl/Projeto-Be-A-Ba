import Functions from "models/Functions";
import { Op } from 'sequelize';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ error: "Não autorizado" });

    if (req.method == 'POST') {

        const { name, tag, description } = req.body;

        try {

            const functionOrTagExists = await Functions.findOne({
                where: {
                    [Op.or]: [
                        { name: name },
                        { tag: tag }
                    ]
                }
            });

            if (functionOrTagExists) {

                if (functionOrTagExists.name === name) {

                    return res.status(400).json({ error: "Já existe outra função com este nome" });

                }

                if (functionOrTagExists.tag === tag) {

                    return res.status(400).json({ error: "Já existe outra função com esta tag" });

                }
            }

            const newFunction = await Functions.create({
                name: name,
                tag: tag,
                description: description,
            });

            if (!newFunction) return res.status(500).json({ error: "Erro ao criar função" });

            return res.status(201).json({ success: "Sucesso ao criar função" });

        } catch (e) {

            res.status(500).json({ error: e.message || "Erro ao criar função" });

        }

    } else if (req.method == 'GET') {

        try {

            const { id } = req.query;

            if (id) {

                const aFunction = await Functions.findByPk(id);

                if (!aFunction) return res.status(404).json({ error: "Função não encontrada" });

                return res.status(200).json(aFunction);

            } else {

                const functions = await Functions.findAll();

                if (!functions) return res.status(404).json({ error: "Funções não encontradas" });

                return res.status(200).json(functions);

            }

        } catch (e) {

            return res.status(500).json({ error: "Erro ao obter funções" });

        }

    } else if (req.method == 'PUT') {

        const { id } = req.query;
        const { name, tag, description } = req.body;

        try {

            const result = await Functions.update(
                { name: name, tag: tag, description: description },
                { where: { id: id } }
            )

            if (!result) return res.status(500).json({ error: "Erro ao atualizar função" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao atualizar função" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Functions.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(500).json({ error: "Erro ao deletar função" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao deletar função" });
        }
    }
}