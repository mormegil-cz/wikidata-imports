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
        if (poslanec.mapping && poslanec.mapping.queryResult.length) continue;
        if (poslanec.lastName.indexOf('-') >= 0 || poslanec.lastName.indexOf(' ') >= 0) {
            var dob = parseDate(poslanec.birthDate);
            console.log(`#${poslanec.id}: ${poslanec.firstName} ${poslanec.lastName} (${dob})`);
            //poslanec.mapping = undefined;
        }
    }

    //await writeFileAsync('osoby.json', JSON.stringify(data, null, 1), 'utf8');
};

run();
