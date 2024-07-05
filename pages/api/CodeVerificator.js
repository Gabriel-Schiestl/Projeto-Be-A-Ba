let savedCode = "";

export default async function CodeVerificator(req, res) {

    if (req.method == 'POST') {

        try {
            const { code } = req.body;

            savedCode = code;

            return res.status(200).json({ sucess: "Sucesso ao salvar código" });

        } catch (e) {
            return res.status(500).json("Erro ao salvar código");
        }

    } else if (req.method == 'GET') {

        return res.status(200).json({ code: savedCode });

    }

}