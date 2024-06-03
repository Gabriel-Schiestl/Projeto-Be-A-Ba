import models from 'models'

const { Profiles, Functions, Transactions, Modules } = models;

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { profileName, modules, transactions, functions } = req.body;

            const exists = await Profiles.findOne({ where: { profileName: profileName } });

            if (exists) {

                return res.status(400).json({ error: "Já existe outro perfil com este nome" });

            }

            const newProfile = await Profiles.create({

                name: profileName,

            })

            if (!newProfile) {

                throw new Error("Erro ao criar perfil");

            } else {

                await newProfile.addFunctions(functions);
                await newProfile.addTransactions(transactions);
                await newProfile.addModules(modules);

            }

            res.status(201).json({ message: "Sucesso ao criar perfil" });

        } catch (e) {

            res.status(400).json({ error: e.message || "Erro ao criar perfil" });

        }

    } else if (req.method == 'GET') {

        try {

            const profiles = await Profiles.findAll();

            res.status(201).json(profiles);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter perfis" });

        }

    }
}
