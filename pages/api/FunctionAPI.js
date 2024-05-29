import Functions from "models/Functions";

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { functionName, tag, functionDescription } = req.body;

            try {

                const nameExists = await Functions.findOne({ where: { functionName: functionName } });
                const tagExists = await Functions.findOne({ where: { tag: tag } });

                if (tagExists) {

                    return res.status(400).json({ error: "Já existe outra função com esta tag" });

                } else if (nameExists) {

                    return res.status(400).json({ error: "Já existe outra função com este nome" });

                }

            } catch (e) {

            }

            await Functions.create({
                name: functionName,
                tag: tag,
                description: functionDescription,
            })

            res.status(200).json({ message: "Sucesso ao criar função" });

        } catch (e) {

            res.status(400).json({ error: "Erro ao criar função" });

        }

    } else if (req.method == 'GET') {

        try {

            const functions = await Functions.findAll();

            res.status(200).json(functions);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter funções" });

        }

    }
}