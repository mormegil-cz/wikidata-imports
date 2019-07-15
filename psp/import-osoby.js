const fs = require('fs');
const { promisify } = require('util');
const fetch = require('node-fetch');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const wikidataUrl = 'https://query.wikidata.org/sparql?query=';

var data = require('./osoby.json');

async function getData(url) {
    var response = null;
    try {
        response = await fetch(url, { headers: { 'Accept': 'application/sparql-results+json' } });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        console.log(response);
    }
}

function parseDate(d) {
    if (!d) return null;
    if (d === '01.01.1900') return null;
    return `${d.substr(6, 4)}-${d.substr(3, 2)}-${d.substr(0, 2)}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    var processed = 0;
    for (var i = 0; i < data.length && processed < 1000; ++i) {
        var poslanec = data[i];
        if (poslanec.mapping) continue;

        var dob = parseDate(poslanec.birthDate);

        const query = `SELECT ?item (SAMPLE(?itemDescription) AS ?itemDescription) ?pspid WHERE {
?item wdt:P31 wd:Q5.
{ { ?item rdfs:label '${poslanec.firstName} ${poslanec.lastName}'@cs } UNION { ?item rdfs:label '${poslanec.firstName} ${poslanec.lastName} (politik)'@cs } UNION { ?item skos:altLabel '${poslanec.firstName} ${poslanec.lastName}'@cs } UNION { ?item wdt:P6828 ?pspid } }
OPTIONAL {
    ?item schema:description ?itemDescription.
    FILTER (LANG(?itemDescription)='cs').
}
OPTIONAL {
    ?item wdt:P569 ?dob.
}
${dob ? `FILTER (?dob="${dob}"^^xsd:dateTime)` : ''}
}
GROUP BY ?item
LIMIT 10`;
        const retrievedData = await getData(wikidataUrl + encodeURIComponent(query) + '&_=' + new Date());

        var queryResult = retrievedData.results.bindings;
        if (queryResult.some(m => m.pspid)) {
            var origLength = queryResult.length;
            queryResult = queryResult.filter(m => m.pspid);
            if (origLength != queryResult.length) {
                console.log(`Selected ${queryResult.length} from ${origLength} entries for ${poslanec.firstName} ${poslanec.lastName}`);
            }
        }

        data[i].mapping = { queryResult: queryResult };
        if (queryResult.length === 1 && queryResult[0].pspid) {
            data[i].exported = true;
        }
        ++processed;
        await writeFileAsync('osoby.json', JSON.stringify(data, null, 1), 'utf8');
        console.log(`Processed ${poslanec.firstName} ${poslanec.lastName} -> ${retrievedData.results.bindings.length} results`);
        await sleep(1000);
    }
    console.log(`Processed ${processed} records`);
};

run();
