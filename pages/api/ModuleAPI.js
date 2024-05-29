import Modules from "models/Modules";

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { moduleName, tag, moduleDescription, transactions } = req.body;

            try {

                const nameExists = await Modules.findOne({ where: { moduleName: moduleName } });
                const tagExists = await Modules.findOne({ where: { tag: tag } });

                if (tagExists) {

                    return res.status(400).json({ error: "Já existe outro módulo com esta tag" });

                } else if (nameExists) {

                    return res.status(400).json({ error: "Já existe outro módulo com este nome" });

                }

            } catch (e) {

            }

            await Modules.create({
                name: moduleName,
                tag: tag,
                description: moduleDescription,
            })

            await Modules.addTransactions(transactions);

            res.status(200).json({ message: "Sucesso ao criar módulo" });

        } catch (e) {

            res.status(400).json({ error: "Erro ao criar módulo" });

        }

    } else if (req.method == 'GET') {

        try {

            const modules = await Modules.findAll();

            res.status(200).json(modules);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter módulos" });

        }

    }
}