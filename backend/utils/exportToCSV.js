const { Parser } = require("json2csv");

function exportToCSV(data, fields) {
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        return parser.parse(data);
    } catch (err) {
        throw err;
    }
}

module.exports = exportToCSV;