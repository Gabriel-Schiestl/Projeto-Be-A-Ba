import Transactions from "models/Transactions";

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { transactionName, tag, transactionDescription, functions } = req.body;

            try {

                const nameExists = await Transactions.findOne({ where: { transactionName: transactionName } });
                const tagExists = await Transactions.findOne({ where: { tag: tag } });

                if (tagExists) {

                    return res.status(400).json({ error: "Já existe outra transação com esta tag" });

                } else if (nameExists) {

                    return res.status(400).json({ error: "Já existe outra transação com este nome" });

                }

            } catch (e) {

            }

            await Transactions.create({
                name: transactionName,
                tag: tag,
                description: transactionDescription,
            })

            res.status(200).json({ message: "Sucesso ao criar transação" });

        } catch (e) {

            res.status(400).json({ error: "Erro ao criar transação" });

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