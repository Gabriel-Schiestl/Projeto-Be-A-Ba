import Transactions from "models/Transactions";
import { Op } from "sequelize";

export default async function TransactionHandler(req, res) {

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

            if (!newTransaction) return res.status(400).json({ error: "Erro ao criar transação" });

            return res.status(201).json({ message: "Sucesso ao criar transação" });

        } catch (e) {

            return res.status(400).json({ error: e.message || "Erro ao criar transação" });

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

            return res.status(400).json({ error: "Erro ao obter transações" });

        }

    }
}