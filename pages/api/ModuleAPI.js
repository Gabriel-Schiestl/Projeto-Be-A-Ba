import Modules from "models/Modules";

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { moduleName, tag, moduleDescription, transactions } = req.body;

        try {
            const nameExists = await Modules.findOne({ where: { name: moduleName } });
            const tagExists = await Modules.findOne({ where: { tag: tag } });

            if (nameExists) {
                return res.status(400).json({error: "Já existe outro módulo com este nome"});
            }

            if (tagExists) {
                return res.status(400).json({error: "Já existe outro módulo com esta tag"});
            }

            const newModule = await Modules.create({
                name: moduleName,
                tag: tag,
                description: moduleDescription,
            });

            if (!newModule) {

                throw new Error("Erro ao criar módulo");
                
            }

            await newModule.addTransactions(transactions);

            return res.status(201).json({ message: "Módulo criado com sucesso" });

        } catch (e) {

            return res.status(400).json({ error: e.message || "Erro ao criar módulo" });

        }

    } else if (req.method === 'GET') {

        try {

            const modules = await Modules.findAll();
            return res.status(200).json(modules);

        } catch (e) {

            return res.status(400).json({ error: "Erro ao obter módulos" });

        }
    } else {

        return res.status(405).json({ error: "Método não permitido" });

    }
}