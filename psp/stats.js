var data = require('./osoby.json');

function parseDate(d) {
    if (!d) return null;
    if (d === '01.01.1900') return null;
    return `${d.substr(6, 4)}-${d.substr(3, 2)}-${d.substr(0, 2)}`;
}

function run() {
    var counts = [];
    var total = 0;
    var totalExported = 0;
    var totalMatched = 0;
    var totalAmbiguous = 0;
    var missingWithDob = 0;
    for (var i = 0; i < data.length; ++i) {
        var poslanec = data[i];
        if (!poslanec.mapping) continue;
        if (poslanec.exported) {
            ++totalExported;
            continue;
        }
        ++total;
        var length = poslanec.mapping.queryResult.length;
        if (length) ++totalMatched;
        if (length > 1) ++totalAmbiguous;
        if (!length && parseDate(poslanec.birthDate)) ++missingWithDob;
        var count = counts[length] || 0;
        counts[length] = count + 1;
    }
    for (var i = 0; i < counts.length; ++i) {
        console.log(`${i} – ${counts[i] || 0}`);
    }
    console.log(`${totalExported} already exported, from the rest: ${total} items total, ${totalMatched} matched, ${total - totalMatched} missing (${missingWithDob} with DOB), ${totalAmbiguous} ambiguous, ${totalMatched - totalAmbiguous} ready`);
};

run();
