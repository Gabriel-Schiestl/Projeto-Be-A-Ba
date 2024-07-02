import axios from 'axios';
import xl from 'excel4node';
import models from 'models';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const { Functions, Modules, Transactions, Profiles, Users } = models;

export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ error: "Não autorizado" });

    if (req.method === 'POST') {
        const { attribute } = req.body;
        let data;

        switch (attribute) {
            case 'Users':
                data = await Users.findAll({ attributes: { exclude: ['password'] } });
                break;
            case 'Profiles':
                data = await Profiles.findAll();
                break;
            case 'Transactions':
                data = await Transactions.findAll();
                break;
            case 'Modules':
                data = await Modules.findAll();
                break;
            case 'Functions':
                data = await Functions.findAll();
                break;
        }

        const report = data.map(item => item.dataValues);

        try {

            const wb = new xl.Workbook();

            const ws = wb.addWorksheet('Relatório');

            const headers = Object.keys(report[0]);
            headers.forEach((header, index) => {
                ws.cell(1, index + 1).string(header);
            });

            report.forEach((row, rowIndex) => {
                headers.forEach((header, colIndex) => {
                    const cellValue = row[header];
                    if (typeof cellValue === 'number') {
                        ws.cell(rowIndex + 2, colIndex + 1).number(cellValue);
                    } else if (cellValue instanceof Date) {
                        ws.cell(rowIndex + 2, colIndex + 1).date(cellValue);
                    } else {
                        ws.cell(rowIndex + 2, colIndex + 1).string(cellValue.toString());
                    }
                });
            });

            wb.writeToBuffer().then((buffer) => {
                res.setHeader('Content-Disposition', `attachment; filename="${attribute}.xlsx"`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.send(buffer);
            });
        } catch (error) {
            res.status(500).send({ error: "Erro ao gerar relatório" });
        }
    }
}