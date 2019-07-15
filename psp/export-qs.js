const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

var data = require('./osoby.json');

function parseDate(d) {
    if (!d) return null;
    if (d === '01.01.1900') return null;
    return `${d.substr(6, 4)}-${d.substr(3, 2)}-${d.substr(0, 2)}`;
}

function uriToItemId(uri) {
    return uri.substr(uri.lastIndexOf('/') + 1);
}

async function run() {
    var output = [];
    for (var i = 0; i < data.length; ++i) {
        var poslanec = data[i];
        if (!poslanec.mapping || poslanec.mapping.queryResult.length !== 1) continue;

        poslanec.exported = true;
        output.push(`${uriToItemId(poslanec.mapping.queryResult[0].item.value)}\tP6828\t"${poslanec.id}"`);
    }

    await writeFileAsync('osoby.json', JSON.stringify(data, null, 1), 'utf8');
    await writeFileAsync('export-qs.tsv', output.join('\n'), 'utf8');
};

run();
