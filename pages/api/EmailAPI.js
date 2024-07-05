import Users from "models/Users";

export default async function CodeVerificator(req, res) {

    try {
        if (req.method == 'GET') {

            const { email } = req.query;

            const result = await Users.findOne({ where: { email: email } });

            if (!result) return res.status(404).json({ error: "Não há usuário cadastrado com esse e-mail" });

            return res.status(200).json(result);
        }
    } catch (e) {
        return res.status(500).json({ error: "Erro interno" });
    }

}