import models from 'models'

const { Profiles, Functions, Transactions, Modules } = models;

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { name, modules, transactions, functions } = req.body;

            const exists = await Profiles.findOne({ where: { name: name } });

            if (exists) {

                return res.status(400).json({ error: "Já existe outro perfil com este nome" });

            }

            const newProfile = await Profiles.create({

                name: name,

            })

            if (!newProfile) {

                return res.status(400).json({ error: "Erro ao criar perfil" });

            } else {

                await newProfile.addFunctions(functions);
                await newProfile.addTransactions(transactions);
                await newProfile.addModules(modules);

            }

            return res.status(201).json({ message: "Sucesso ao criar perfil" });

        } catch (e) {

            return res.status(400).json({ error: e.message || "Erro ao criar perfil" });

        }

    } else if (req.method == 'GET') {

        try {

            const { id } = req.query;

            if (id) {

                const profile = await Profiles.findByPk(id, {
                    include: [Functions, Transactions, Modules]
                });

                if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });

                return res.status(200).json(profile);

            } else {

                const profiles = await Profiles.findAll();

                if (!profiles) return res.status(404).json({ error: "Perfis não encontrados" });

                return res.status(200).json(profiles);

            }

        } catch (e) {

            return res.status(400).json({ error: "Erro ao obter perfis" });

        }

    } else if (req.method == 'PUT') {

        const { id } = req.query;
        let { name, modules, functions, transactions } = req.body;

        try {

            const result = await Profiles.update(
                { name: name },
                { where: { id: id } }
            )

            if (!result) return res.status(400).json({ error: "Erro ao atualizar perfil" });

            const profile = await Profiles.findByPk(id);

            await profile.setModules(modules);
            await profile.setFunctions(functions);
            await profile.setTransactions(transactions);

            return res.status(200).json(result);

        } catch (e) {
            return res.status(400).json({ error: "Erro ao atualizar perfil" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Profiles.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(400).json({ error: "Erro ao deletar perfil" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(400).json({ error: "Erro ao deletar perfil" });
        }
    }
}
