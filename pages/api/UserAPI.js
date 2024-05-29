import Users from "models/Users";

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {

            const { userName, email, password, register, profile } = req.body;

            try {

                const emailExists = await Users.findOne({ where: { email: email } });
                const registerExists = await Users.findOne({ where: { register: register } });

                if (emailExists) {

                    return res.status(400).json({ error: "Já existe outro usuário com este e-mail" });

                } else if (registerExists) {

                    return res.status(400).json({ error: "Já existe outro usuário com esta matrícula" });

                }

            } catch (e) {

            }

            await Users.create({
                name: userName,
                email: email,
                password: password,
                register: register,
                created_at: new Date(),
                profileId: profile,
            })

            res.status(200).json({ message: "Sucesso ao criar usuário" });

        } catch (e) {

            res.status(400).json({ error: "Erro ao criar usuário" });

        }

    } else if (req.method == 'GET') {

        try {

            const users = await Users.findAll();

            res.status(200).json(users);

        } catch (e) {

            res.status(400).json({ error: "Erro ao obter usuários" });

        }

    }
}