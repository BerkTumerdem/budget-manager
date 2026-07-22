const Expense = require("../models/Expense");
const exportToCSV = require("../utils/exportToCSV");
const User = require("../models/User");

const removeDiacritics = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\x00-\x7F]/g, '');
};

exports.exportExpensesCSV = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const userEmail = user ? user.email : "unknown";
        const { start, end } = req.query;

        const filter = { userId: req.user.id };
        if (start || end) {
            filter.date = {};
            if (start) filter.date.$gte = new Date(start);
            if (end) filter.date.$lte = new Date(end);
        }

        const expenses = await Expense.find(filter).populate("category").sort({ date: -1 });

        let totalIncome = 0;
        let totalExpenses = 0;

        const data = expenses.map((e) => {
            const type = (e.type || '').toLowerCase();
            const amount = Number(e.amount) || 0;
            if (type === 'income') totalIncome += amount;
            else totalExpenses += amount;
            return {
                Date: `'${e.date.toISOString().split("T")[0]}`,
                Amount: amount.toFixed(2),
                Type: type.charAt(0).toUpperCase() + type.slice(1),
                Category: removeDiacritics(e.category?.name || "Uncategorized"),
                Description: removeDiacritics(e.description || "")
            };
        });

        const balance = totalIncome - totalExpenses;
        data.push({
            Date: '',
            Amount: '',
            Type: '',
            Category: '--- SUMMARY ---',
            Description: ''
        });
        data.push({
            Date: '',
            Amount: totalIncome.toFixed(2),
            Type: 'Total Income',
            Category: '',
            Description: ''
        });
        data.push({
            Date: '',
            Amount: totalExpenses.toFixed(2),
            Type: 'Total Expenses',
            Category: '',
            Description: ''
        });
        data.push({
            Date: '',
            Amount: balance.toFixed(2),
            Type: 'Balance',
            Category: '',
            Description: ''
        });

        const fields = ["Date", "Amount", "Type", "Category", "Description"];
        let csv = exportToCSV(data, fields);
        csv = '\uFEFF' + csv;

        const now = new Date();
        const dateStr = now.toISOString().split("T")[0];
        const timeStr = now.toTimeString().split(" ")[0];
        const filename = `${userEmail}, ${timeStr}, ${dateStr}, exported with MCH by Berk.csv`;
        res.header("Content-Type", "text/csv; charset=utf-8");
        res.attachment(filename);
        return res.send(csv);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};