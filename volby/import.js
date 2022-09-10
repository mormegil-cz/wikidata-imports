const Dbf = require('dbf-reader').Dbf;
const XmlReader = require('xml-reader');
const fs = require('fs');
const iconv = require('iconv-lite');

let participations = {};

importXml('data/prez/prez2013-perk.xml', 'prez2013', 'PE_REGKAND_ROW', null, 'PSTRANA', 'NSTRANA');
importXml('data/prez/prez2018-perk.xml', 'prez2018', 'PE_REGKAND_ROW', null, 'PSTRANA', 'NSTRANA');

importDbf('data/ps/ps2006-psrk.dbf', 'ps2006', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importDbf('data/ps/ps2010-psrk.dbf', 'ps2010', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importDbf('data/ps/ps2013-psrk.dbf', 'ps2013', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/ps/ps2017nss-psrk.xml', 'ps2017nss', 'PS_REGKAND_ROW', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/ps/ps2021-psrk.xml', 'ps2021', 'PS_REGKAND_ROW', 'KSTRANA', 'PSTRANA', 'NSTRANA');

importXml('data/se/se2008-serk.xml', 'se2008', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2010-serk.xml', 'se2010', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2011-serk.xml', 'se2011', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2012-serk.xml', 'se2012', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2014leden-serk.xml', 'se2014leden', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2014zari-serk.xml', 'se2014zari', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2014-serk.xml', 'se2014', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2016-serk.xml', 'se2016', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2017-serk.xml', 'se2017', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2018kveten-serk.xml', 'se2018kveten', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2018-serk.xml', 'se2018', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2019-serk.xml', 'se2019', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2020cerven-serk.xml', 'se2020cerven', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2020-serk.xml', 'se2020', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2022-serk.xml', 'se2022', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');

importDbf('data/kz/kz2008-kzrk.dbf', 'kz2008', [['KRZAST', 'KSTRANA'], loadDbfMapping('data/kz/kz2008-kzrkl.dbf', ['KRZAST', 'KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importDbf('data/kz/kz2012-kzrk.dbf', 'kz2012', [['KRZAST', 'KSTRANA'], loadDbfMapping('data/kz/kz2012-kzrkl.dbf', ['KRZAST', 'KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kz/kz2016-kzrk.xml', 'kz2016', 'KZ_REGKAND_ROW', [['KRZAST', 'KSTRANA'], loadXmlMapping('data/kz/kz2016-kzrkl.xml', 'KZ_RKL_ROW', ['KRZAST', 'KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kz/kz2020-kzrk.xml', 'kz2020', 'KZ_REGKAND_ROW', [['KRZAST', 'KSTRANA'], loadXmlMapping('data/kz/kz2020-kzrkl.xml', 'KZ_RKL_ROW', ['KRZAST', 'KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');

importXml('data/kv/kv2006-kvrk.xml', 'kv2006', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2006-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2010-kvrk.xml', 'kv2010', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2010-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2014-kvrk.xml', 'kv2014', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2014-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2018-kvrk.xml', 'kv2018', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2018-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2022-kvrk.xml', 'kv2022', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2022-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');

importXml('data/ep/ep2004-eprk.xml', 'ep2004', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2004-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ep/ep2009-eprk.xml', 'ep2009', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2009-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ep/ep2014-eprk.xml', 'ep2014', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2014-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ep/ep2019-eprk.xml', 'ep2019', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2019-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');

const partyCodebook = importXmlCodebook('data/current-cvs.xml', 'CVS_ROW', 'VSTRANA', ['NAZEVCELK', 'NAZEV_STRV', 'ZKRATKAV30', 'ZKRATKAV8', 'ZKRATKA_OF', 'POCSTR_SLO', 'TYPVS']);

const partyType = {
    'S': 'politická strana, hnutí',
    'K': 'koalice',
    'N': 'samostatný nezávislý kandidát',
    'M': 'sdružení nezávislých kandidátů',
    'D': 'sdružení nezávislých kandidátů a politických stran, hnutí'
};

// console.log(participations);

for (const partyId of Object.keys(participations)) {
    const partyInfo = partyCodebook[partyId];
    if (!partyInfo) {
        console.error(`No party data for ${partyId}`);
        continue;
    }
    let output = [];

    output.push(```
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(partyInfo[0])} – účast ve volbách</title>
</head>
<body>
  <h1>${escapeHtml(partyInfo[0])}</h1>

  <dl>
    <dt>Zkrácený název volební strany (50 znaků)</dt>
    <dd>${escapeHtml(partyInfo[1])}</dd>
    <dt>Zkrácený název (30 znaků)</dt>
    <dd>${escapeHtml(partyInfo[2])}</dd>
    <dt>Zkratka názvu (8 znaků)</dt>
    <dd>${escapeHtml(partyInfo[3])}</dd>
    <dt>Oficiální zkratka názvu volební strany</dt>
    <dd>${escapeHtml(partyInfo[4])}</dd>
    <dt>Typ volební strany</dt>
    <dd>${partyType[partyInfo[6]] || '?'}</dd>
```);

    const partyCount = +partyInfo[5];
    if (partyCount > 1) {
        output.push(```
    <dt>Počet politických subjektů ve složení volební strany</dt>
    <dd>${partyCount}</dd>
```);
    }

    output.push(```
  </dl>

  <h2>Účast ve volbách</h2>
  <ul>
```);

    const elections = participations[partyId];
    for (let electionId of Object.keys(elections)) {
        const electionFlags = elections[electionId];
        output.push(```
    <li>${electionid}: ${JSON.stringify(electionFlags)}</li>
```);
    }



    output.push(```
  </ul>
</body>
</html>
```);

    fs.writeFileSync(`output/${partyId}.htm`, output.join(''));

    return;
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function importDbf(filename, electionId, candidateCol, memberCol, nominatingCol) {
    const buffer = fs.readFileSync(filename);
    const datatable = Dbf.read(buffer);
    if (!datatable) throw new Error('Error reading ' + filename);
    datatable.rows.forEach(row => {
        processDbfColumn(row, candidateCol, electionId, 'candidate');
        processDbfColumn(row, memberCol, electionId, 'member');
        processDbfColumn(row, nominatingCol, electionId, 'nominating');
    });
}

function processDbfColumn(row, col, electionId, participationKind) {
    const partyId = row[col];
    if (!partyId) {
        // possibly “candidate removed by registration authority”
        // console.debug(`No ${col} found in ${electionId}: ${JSON.stringify(row)}`);
        return;
    }
    recordParticipation(partyId, electionId, participationKind);
}

function loadDbfMapping(filename, sourceElems, targetElem) {
    console.debug(`Loading DBF mapping from ${filename}`);
    const buffer = fs.readFileSync(filename);
    const datatable = Dbf.read(buffer);
    if (!datatable) throw new Error('Error reading ' + filename);
    let conversionTable = {};
    datatable.rows.forEach(row => {
        const sourceIds = sourceElems.map(sourceElem => row[sourceElem]);
        const source = sourceIds.join(':');
        const target = row[targetElem];
        if (conversionTable[source]) {
            console.warn(`Duplicate value for ${sourceElem}=${source} in ${filename}`);
            return;
        }
        if (!target) {
            console.warn(`No value for ${sourceElem}=${source} in ${filename}`);
            return;
        }
        conversionTable[source] = target;
    });
    console.debug(`Loaded ${Object.keys(conversionTable).length} items`);
    return src => conversionTable[src];
}

function loadXmlMapping(filename, rowElem, sourceElems, targetElem) {
    console.debug(`Loading XML mapping from ${filename}`);
    const reader = XmlReader.create({ stream: true, emitTopLevelOnly: true, parentNodes: false });
    let conversionTable = {};
    reader.on('tag:' + rowElem, row => processMappingXmlRow(filename, row, sourceElems, targetElem, conversionTable));
    const buffer = fs.readFileSync(filename);
    reader.parse(iconv.decode(buffer, 'windows-1250'));
    console.debug(`Loaded ${Object.keys(conversionTable).length} items`);
    return src => conversionTable[src];
}

function processMappingXmlRow(filename, row, sourceElems, targetElem, conversionTable) {
    const sourceIds = sourceElems.map(sourceElem => findXmlTextNode(row, sourceElem));
    const source = sourceIds.join(':');
    const target = findXmlTextNode(row, targetElem);
    if (conversionTable[source]) {
        console.warn(`Duplicate value for ${sourceElem}=${source} in ${filename}`);
        return;
    }
    if (!target) {
        console.warn(`No value for ${sourceElem}=${source} in ${filename}`);
        return;
    }
    conversionTable[source] = target;
}

function importXmlCodebook(filename, rowElem, idElem, dataElems) {
    console.debug(`Loading XML codebook from ${filename}`);
    const reader = XmlReader.create({ stream: true, emitTopLevelOnly: true, parentNodes: false });
    let codebook = {};
    reader.on('tag:' + rowElem, row => processCodebookXmlRow(filename, row, idElem, dataElems, codebook));
    const buffer = fs.readFileSync(filename);
    reader.parse(iconv.decode(buffer, 'windows-1250'));
    return codebook;
}

function processCodebookXmlRow(filename, row, idElem, dataElems, codebook) {
    const id = findXmlTextNode(row, idElem);
    const data = dataElems.map(dataElem => findXmlTextNode(row, dataElem));
    if (codebook[id]) {
        console.warn(`Duplicate value for ${idElem}=${id} in ${filename}`);
        return;
    }
    codebook[id] = data;
}

function importXml(filename, electionId, rowElem, candidateElem, memberElem, nominatingElem) {
    console.debug(`Importing ${filename}`);
    const reader = XmlReader.create({ stream: true, emitTopLevelOnly: true, parentNodes: false });
    reader.on('tag:' + rowElem, row => processXmlRow(row, electionId, candidateElem, memberElem, nominatingElem));
    const buffer = fs.readFileSync(filename);
    reader.parse(iconv.decode(buffer, 'windows-1250'));
}

function processXmlRow(row, electionId, candidateElem, memberElem, nominatingElem) {
    processXmlElement(row, candidateElem, electionId, 'candidate');
    processXmlElement(row, memberElem, electionId, 'member');
    processXmlElement(row, nominatingElem, electionId, 'nominating');
}

function processXmlElement(row, elemInfo, electionId, participationKind) {
    if (!elemInfo) return;

    let partyId;
    if (Array.isArray(elemInfo)) {
        elemNames = elemInfo[0];
        mappingFunction = elemInfo[1];

        const idParts = elemNames.map(elemName => findXmlTextNode(row, elemName));
        const id = idParts.join(':');
        partyId = mappingFunction(id);
        if (!partyId) {
            console.warn(`Unable to map ${id}`);
            return;
        }
    } else {
        partyId = findXmlTextNode(row, elemInfo);
        if (!partyId) {
            // possibly “candidate removed by registration authority”
            // console.debug(`No ${elemInfo} found in ${electionId}: ${JSON.stringify(row)}`);
            return;
        }
    }
    recordParticipation(partyId, electionId, participationKind);
}

function findXmlTextNode(row, elem) {
    for (const child of row.children) {
        if (child.type === 'element' && child.name === elem) {
            if (child.children.length === 1 && child.children[0].type === 'text') {
                return child.children[0].value;
            }
        }
    }
    return null;
}

function recordParticipation(partyId, electionId, participationKind) {
    if (!partyId) {
        console.warn(`Missing party ID for ${participationKind} in ${electionId}`);
        return;
    }
    let partyParticipation = participations[partyId] || {};
    participations[partyId] = partyParticipation;
    let electionRecord = partyParticipation[electionId] || {};
    partyParticipation[electionId] = electionRecord;
    electionRecord[participationKind] = true;
}
