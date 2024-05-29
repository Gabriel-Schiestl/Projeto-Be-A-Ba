import Profiles from "models/Profiles";

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { profileName, modules, transactions, functions } = req.body;

            try {

                const exists = await Profiles.findOne({ where: { profileName: profileName } });

                if (exists) {

                    return res.status(400).json({ error: "Já existe outro perfil com este nome" });

                }

            } catch (e) {

            }

            const response = await Profiles.create({
                name: profileName,
                created_at: new Date(),
            })

            res.status(200).json({ message: "Sucesso ao criar perfil" });

        } catch (e) {

            res.status(400).json({ error: "Erro ao criar perfil" });

        }

    } else if (req.method == 'GET') {

        try {

            const profiles = await Profiles.findAll();

            res.status(200).json(profiles);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter perfis" });

        }

    }
}