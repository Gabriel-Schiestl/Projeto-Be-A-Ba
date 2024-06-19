import models from 'models'
import sequelize from 'utils/db';

const { Profiles, Functions, Transactions, Modules, ProfilesModules, ProfilesModulesTransactions } = models;

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { name, functions, modulesTransactions } = req.body;

        try {

            const existingProfile = await Profiles.findOne({ where: { name } });

            if (existingProfile) {
                return res.status(400).json({ error: "Já existe outro perfil com este nome" });
            }

            const newProfile = await Profiles.create({ name });

            if (!newProfile) return res.status(500).json({ error: "Erro ao criar perfil" });

            for (const moduleTransaction of modulesTransactions) {
                const { module, transactions } = moduleTransaction;

                await newProfile.addModules(module);

                const profileModule = await ProfilesModules.findOne({
                    where: {
                        profileId: newProfile.id,
                        moduleId: module
                    }
                });

                await profileModule.addTransactions(transactions);

            }

            await newProfile.addFunctions(functions);

            return res.status(201).json({ success: "Sucesso ao criar perfil" });
        } catch (error) {
            return res.status(500).json({ error: error.message || "Erro ao criar perfil" });
        }
    } else if (req.method == 'GET') {

        try {

            const { id } = req.query;

            if (id) {

                const profile = await Profiles.findByPk(id, {
                    include: [
                        {
                            model: Functions
                        },
                        {
                            model: Modules
                        }
                    ]
                });

                if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });

                return res.status(200).json(profile);

            } else {

                const profiles = await Profiles.findAll();


                if (!profiles) return res.status(404).json({ error: "Perfis não encontrados" });

                return res.status(200).json(profiles);

            }

        } catch (e) {

            return res.status(500).json({ error: "Erro ao obter perfis" });

        }

    } else if (req.method == 'PUT') {

        const { id } = req.query;
        const { name, functions, modulesTransactions } = req.body;
        console.log('Recebido PUT request');
        console.log('ID:', id);
        console.log('Dados recebidos:', { name, functions, modulesTransactions });

        try {
            console.log('Iniciando atualização de perfil');

            const profile = await Profiles.findByPk(id);

            if (profile.name != name) {

                const result = await Profiles.update(
                    { name: name },
                    { where: { id: id } }
                )
            }

            await profile.setFunctions([]);

            await profile.setFunctions(functions);

            const modules = modulesTransactions.map(mt => mt.module);

            await ProfilesModules.destroy({
                where: { profileId: profile.id }
            });

            for (const moduleTransaction of modulesTransactions) {
                const { module, transactions } = moduleTransaction;

                await ProfilesModules.create({
                    profileId: profile.id,
                    moduleId: module
                });

                const profileModule = await ProfilesModules.findOne({
                    where: {
                        profileId: profile.id,
                        moduleId: module
                    }
                });

                await profileModule.setTransactions(transactions);
            }

            console.log('Perfil atualizado com sucesso');
            return res.status(200).json({success: "Perfil atualizado"});

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
