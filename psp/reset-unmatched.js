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

async function run() {
    for (var i = 0; i < data.length; ++i) {
        var poslanec = data[i];
        if (!poslanec.mapping) continue;
        if (poslanec.mapping.queryResult && poslanec.mapping.queryResult.length === 0) {
            if (parseDate(poslanec.birthDate)) {
                poslanec.mapping = undefined;
                console.log(`Reset ${poslanec.firstName} ${poslanec.lastName} (${poslanec.birthDate})`);
            } else {
                console.debug(`Skipping ${poslanec.firstName} ${poslanec.lastName}`);
            }
        }
    }
    await writeFileAsync('osoby.json', JSON.stringify(data), 'utf8');
};

run();
