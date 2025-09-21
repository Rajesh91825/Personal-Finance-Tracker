const pool = require("../config/db");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

const exportCSV = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT t.id, t.amount, t.description, t.transaction_date, c.name as category " +
            "FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id=$1",
            [req.user.id]
        );

        const parser = new Parser();
        const csv = parser.parse(result.rows);

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        return res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export CSV ❌" });
    }
};

const exportPDF = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT t.id, t.amount, t.description, t.transaction_date, c.name as category " +
            "FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id=$1",
            [req.user.id]
        );

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

        doc.pipe(res);

        doc.fontSize(18).text("Transactions Report", { align: "center" });
        doc.moveDown();

        result.rows.forEach(tx => {
            doc.fontSize(12).text(
                `ID: ${tx.id} | Amount: ${tx.amount} | Desc: ${tx.description} | Date: ${tx.transaction_date.toISOString().slice(0,10)} | Category: ${tx.category}`
            );
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to export PDF ❌" });
    }
};

module.exports = { exportCSV, exportPDF };
