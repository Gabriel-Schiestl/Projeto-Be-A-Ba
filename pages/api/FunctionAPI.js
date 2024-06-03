import Functions from "models/Functions";
import { Op } from 'sequelize';

export default async function handler(req, res) {

    if (req.method == 'POST') {

        const {name, tag, description} = req.body;

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

            if(!newFunction) throw new Error("Erro ao criar função");

            return res.status(201).json({ message: "Sucesso ao criar função" });

        } catch (e) {

            res.status(400).json({ error: e.message || "Erro ao criar função" });

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