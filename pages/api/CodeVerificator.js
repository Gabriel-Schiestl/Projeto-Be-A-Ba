import Users from "models/Users";

export default async function CodeVerificator(req, res) {

    if (req.method == 'POST') {

        try {
            const { code, id } = req.body;

            const user = await Users.findByPk(id);

            const result = await user.update({ code: code });

            if (!result) return res.status(500).json({ error: "Erro interno do servidor" });

            return res.status(200).json({ sucess: "Sucesso ao salvar código" });

        } catch (e) {
            return res.status(500).json("Erro ao salvar código");
        }

    } else if (req.method == 'GET') {

        const { id } = req.query;

        const user = await Users.findByPk(id);

        const code = user.code;

        return res.status(200).json({ code: code });

    }

}