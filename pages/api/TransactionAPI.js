import Transactions from "models/Transactions";
import { Op } from "sequelize";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function TransactionHandler(req, res) {

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ error: "Não autorizado" });

    if (req.method == 'POST') {

        const { name, tag, description } = req.body;

        try {

            const nameOrTagExists = await Transactions.findOne({
                where: {
                    [Op.or]: [
                        { name: name },
                        { tag: tag }
                    ]
                }
            });

            if (nameOrTagExists) {

                if (nameOrTagExists.name == name) {

                    return res.status(400).json({ error: "Já existe outra transação com este nome" });

                }

                if (nameOrTagExists.tag == tag) {

                    return res.status(400).json({ error: "Já existe outra transação com esta tag" });

                }
            }

            const newTransaction = await Transactions.create({
                name: name,
                tag: tag,
                description: description,
            })

            if (!newTransaction) return res.status(500).json({ error: "Erro ao criar transação" });

            return res.status(201).json({ success: "Sucesso ao criar transação" });

        } catch (e) {

            return res.status(500).json({ error: e.message || "Erro ao criar transação" });

        }

    } else if (req.method == 'GET') {

        try {

            const { id } = req.query;

            if (id) {

                const transaction = await Transactions.findByPk(id);

                if (!transaction) return res.status(404).json({ error: "Transação não encontrada" });

                return res.status(200).json(transaction);

            } else {

                const transactions = await Transactions.findAll();

                if (!transactions) return res.status(404).json({ error: "Transações não encontradas" });

                return res.status(200).json(transactions);

            }

        } catch (e) {

            return res.status(500).json({ error: "Erro ao obter transações" });

        }
    } else if (req.method == 'PUT') {

        const { id } = req.query;
        const { name, tag, description } = req.body;

        try {

            const result = await Transactions.update(
                { name: name, tag: tag, description: description },
                { where: { id: id } }
            )

            if (!result) return res.status(500).json({ error: "Erro ao atualizar transação" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao atualizar transação" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Transactions.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(500).json({ error: "Erro ao deletar transação" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao deletar transação" });
        }
    }
}