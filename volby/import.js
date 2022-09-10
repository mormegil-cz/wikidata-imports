const Dbf = require('dbf-reader').Dbf;
const XmlReader = require('xml-reader');
const fs = require('fs');
const iconv = require('iconv-lite');

let participations = {};

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

importDbf('data/kz/kz2008-kzrk.dbf', 'kz2008', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importDbf('data/kz/kz2012-kzrk.dbf', 'kz2012', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/kz/kz2016-kzrk.xml', 'kz2016', 'KZ_REGKAND_ROW', 'KSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/kz/kz2020-kzrk.xml', 'kz2020', 'KZ_REGKAND_ROW', 'KSTRANA', 'PSTRANA', 'NSTRANA');

importXml('data/kv/kv2006-kvrk.xml', 'kv2006', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2006-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2010-kvrk.xml', 'kv2010', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2010-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2014-kvrk.xml', 'kv2014', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2014-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2018-kvrk.xml', 'kv2018', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2018-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/kv/kv2022-kvrk.xml', 'kv2022', 'KV_REGKAND_ROW', [['KODZASTUP', 'COBVODU', 'OSTRANA'], loadXmlMapping('data/kv/kv2022-kvros.xml', 'KV_ROS_ROW', ['KODZASTUP', 'COBVODU', 'OSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');

importXml('data/ep/ep2004-eprk.xml', 'ep2004', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2004-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ep/ep2009-eprk.xml', 'ep2009', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2009-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ep/ep2014-eprk.xml', 'ep2014', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2014-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ep/ep2019-eprk.xml', 'ep2019', 'EP_REGKAND_ROW', [['ESTRANA'], loadXmlMapping('data/ep/ep2019-eprkl.xml', 'EP_RKL_ROW', ['ESTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');

importXml('data/prez/prez2013-perk.xml', 'prez2013', 'PE_REGKAND_ROW', null, 'PSTRANA', 'NSTRANA');
importXml('data/prez/prez2018-perk.xml', 'prez2018', 'PE_REGKAND_ROW', null, 'PSTRANA', 'NSTRANA');

console.log(participations);

function importDbf(filename, electionId, candidateCol, memberCol, nominatingCol) {
    const buffer = fs.readFileSync(filename);
    const datatable = Dbf.read(buffer);
    if (!datatable) throw new Error('Error reading ' + filename);
    datatable.rows.forEach(row => {
        let candidate = row[candidateCol];
        let member = row[memberCol];
        let nominating = row[nominatingCol];

        recordParticipation(candidate, electionId, 'candidate');
        recordParticipation(member, electionId, 'member');
        recordParticipation(nominating, electionId, 'nominating');
    });
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
    conversionTable[source] = target;
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
