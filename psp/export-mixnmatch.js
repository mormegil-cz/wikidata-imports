const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/*
var organTypes = {"1":{"count":1964,"name":"Klub"},"2":{"count":1142,"name":"Komise"},"3":{"count":2910,"name":"Výbor"},"4":{"count":2977,"name":"Podvýbor"},"5":{"count":315,"name":"Vláda"},"7":{"count":397,"name":"Delegace"},"11":{"count":1728,"name":"Parlament"},"13":{"count":5287,"name":"Meziparlamentní skupina v rámci MPU"},"15":{"count":535,"name":"Instituce"},"18":{"count":4,"name":"Prezident"},"20":{"count":1465,"name":"Česká národní rada"},"23":{"count":618,"name":"Národní shromáždění Československé socialistické republiky"},"24":{"count":2108,"name":"Národní shromáždění republiky Československé"},"25":{"count":322,"name":"Ústavodárné Národní shromáždění republiky Československé"},"26":{"count":302,"name":"Prozatimní Národní shromáždění republiky Československé"},"27":{"count":323,"name":"Národní shromáždění československé"},"29":{"count":1237,"name":"Výbor"},"30":{"count":1222,"name":"Sněmovna lidu"},"31":{"count":896,"name":"Sněmovna národů"},"33":{"count":603,"name":"Výbor"},"34":{"count":322,"name":"Klub"},"40":{"count":2,"name":"Legislativní rada vlády"},"41":{"count":37,"name":"Prezídium"},"42":{"count":224,"name":"Dozorčí rada"},"45":{"count":118,"name":"Správní rada"},"54":{"count":316,"name":"Sněmovna lidu"},"55":{"count":314,"name":"Sněmovna národů"},"68":{"count":1009,"name":"Klub"},"74":{"count":2,"name":"Konvent EU"},"77":{"count":20,"name":"Evropský parlament"},"78":{"count":39,"name":"Pracovní skupina"},"79":{"count":984,"name":"Senát"},"82":{"count":78,"name":"Orgány Registru"},"83":{"count":10,"name":"Pracovní skupina"},"84":{"count":3,"name":"Mezinárodní organizace"}};
*/
var usedOrganTypes = {"5":true, "11":true, "15":true, "18":true, "20":true, "23":true, "24":true, "25":true, "26":true, "27":true, "30":true, "31":true, "40":true, "54":true, "55":true, "74":true, "77":true, "79":true, "82":true, "84":true,
    "42":true, "45":true};

var osoby = require('./osoby.json');
var zarazeni = require('./zarazeni.json');
var typFunkce = require('./typ_funkce.json');
var typOrganu = require('./typ_organu.json');
var funkce = require('./funkce.json');
var organy = require('./organy.json');

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
    var typeCounts = {};
    for (var i = 0; i < osoby.length; ++i) {
        var poslanec = osoby[i];

        var description = [];
        var dob = parseDate(poslanec.birthDate);
        var dod = parseDate(poslanec.deathDate);
        if (dob) {
            if (dod) {
                description.push(`${dob} – ${dod}`);
            } else {
                description.push(`* ${dob}`);
            }
        } else if (dod) {
            description.push(`† ${dod}`);
        }

        var poslancovoZarazeni = zarazeni[poslanec.id];
        if (poslancovoZarazeni) {
            var zarazeniDesc = [];

            // organy
            var membership = {};
            for (var j = 0; j < poslancovoZarazeni.length; ++j) {
                var z = poslancovoZarazeni[j];
                var caption = [];
                if (z.typeClass === "0") {
                    var typeId = z.typeId;
                    var orgType = organy[typeId].organTypeId;
                    if (usedOrganTypes[orgType]) {
                        membership[typeId] = true;
                    }
                }
            }

            // funkce
            for (var j = 0; j < poslancovoZarazeni.length; ++j) {
                var z = poslancovoZarazeni[j];
                var caption = [];
                if (z.typeClass === "1") {
                    var typeId = z.typeId;
                    var fun = funkce[typeId];
                    var org = organy[fun.organId];
                    var orgType = org.organTypeId;
                    var funType = typFunkce[fun.functionTypeId];

                    if (usedOrganTypes[orgType]) {
                        membership[fun.organId] = false;
                        caption.push(`${fun.name} (#${fun.id}: ${funType.nameCs} #${funType.id}) – ${org.nameCs} (#${org.id}: ${typOrganu[orgType].nameCs} #${orgType})`);
                    }
                }
                if (caption.length) zarazeniDesc.push(caption.join('–'));
            }

            // zbytek orgánů
            for (var typeId in membership) {
                if (membership.hasOwnProperty(typeId) && membership[typeId]) {
                    var org = organy[typeId];
                    var orgType = org.organTypeId;
                    zarazeniDesc.push(`${org.nameCs} (#${org.id}: ${typOrganu[orgType].nameCs} #${orgType})`);
                }
            }

            description.push(zarazeniDesc.join(', '));
        }

        output.push(`${poslanec.id}\t${poslanec.firstName} ${poslanec.lastName}\t${description.join('; ')}`);
    }
    //console.log(JSON.stringify(typeCounts));

    await writeFileAsync('export-mixnmatch.tsv', output.join('\n'), 'utf8');
};

run();
