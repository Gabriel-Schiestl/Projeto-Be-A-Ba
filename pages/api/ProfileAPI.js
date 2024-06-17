import models from 'models'
import sequelize from 'utils/db';

const { Profiles, Functions, Transactions, Modules, ProfilesModules, ModulesTransactionsProfiles } = models;

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { name, functions, modulesTransactions } = req.body;

            const exists = await Profiles.findOne({ where: { name: name } });

            if (exists) {

                return res.status(400).json({ error: "Já existe outro perfil com este nome" });

            }

            const newProfile = await Profiles.create({ name: name })

            for (const moduleTransaction of modulesTransactions) {
                const { module, transactions } = moduleTransaction;

                await ProfilesModules.create({ profileId: newProfile.id, moduleId: module });

                for (const transactionId of transactions) {
                    await ModulesTransactionsProfiles.create({
                        moduleId: module,
                        transactionId: transactionId,
                        profileId: newProfile.id
                    });
                }
            }

            await newProfile.addFunctions(functions);

            if (!newProfile) return res.status(500).json({ error: "Erro ao criar perfil" });


            return res.status(201).json({ success: "Sucesso ao criar perfil" });

        } catch (e) {

            return res.status(500).json({ error: e.message || "Erro ao criar perfil" });

        }

    } else if (req.method == 'GET') {

        try {

            const { id } = req.query;

            if (id) {

                const profile = await Profiles.findByPk(id, {
                    include: [
                        { model: Functions },
                        {
                            model: Modules,
                            include: [Transactions]
                        }
                    ]
                });

                if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });

                return res.status(200).json(profile);

            } else {

                const profiles = await Profiles.findAll({
                    include: [
                        { model: Functions },
                        {
                            model: Modules,
                            include: [Transactions]
                        }
                    ]
                });

                if (!profiles) return res.status(404).json({ error: "Perfis não encontrados" });

                return res.status(200).json(profiles);

            }

        } catch (e) {

            return res.status(500).json({ error: "Erro ao obter perfis" });

        }

    } else if (req.method == 'PUT') {

        const { id } = req.query;
        const { name, functions, modulesTransactions } = req.body;

        try {

            const result = await Profiles.update(
                { name: name },
                { where: { id: id } }
            )

            if (!result) return res.status(500).json({ error: "Erro ao atualizar perfil" });

            await ProfilesModules.destroy({ where: { profileId: id } });

            for (const moduleTransaction of modulesTransactions) {
                const { module, transactions } = moduleTransaction;

                await ProfilesModules.create({ profileId: id, moduleId: module });
                await ModulesTransactionsProfiles.destroy({ where: { moduleId: module } });

                for (const transactionId of transactions) {

                    await ModulesTransactionsProfiles.create({
                        moduleId: module,
                        transactionId: transactionId,
                    });
                }
            }

            const profile = await Profiles.findByPk(id);

            await profile.setFunctions(functions);

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao atualizar perfil" });
        }

    } else if (req.method == 'DELETE') {

        const { id } = req.query;

        try {

            const result = await Profiles.destroy(
                { where: { id: id } }
            );

            if (!result) return res.status(500).json({ error: "Erro ao deletar perfil" });

            return res.status(200).json(result);

        } catch (e) {
            return res.status(500).json({ error: "Erro ao deletar perfil" });
        }
    }
}
