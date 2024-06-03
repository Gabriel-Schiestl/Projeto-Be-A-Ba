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

            if (!newTransaction) throw new Error("Erro ao criar transação");

            res.status(201).json({ message: "Sucesso ao criar transação" });

        } catch (e) {

            return res.status(400).json({ error: e.message || "Erro ao criar transação" });

        }

    } else if (req.method == 'GET') {

        try {

            const transactions = await Transactions.findAll();

            res.status(200).json(transactions);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter transações" });

        }

    }
}