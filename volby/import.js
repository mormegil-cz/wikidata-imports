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

function importXml(filename, electionId, rowElem, candidateElem, memberElem, nominatingElem) {
    const reader = XmlReader.create({ stream: true, emitTopLevelOnly: true, parentNodes: false });
    reader.on('tag:' + rowElem, row => processXmlRow(row, electionId, candidateElem, memberElem, nominatingElem));
    const buffer = fs.readFileSync(filename);
    reader.parse(iconv.decode(buffer, 'windows-1250'));
}

function processXmlRow(row, electionId, candidateElem, memberElem, nominatingElem) {
    const candidate = findXmlTextNode(row, candidateElem);
    const member = findXmlTextNode(row, memberElem);
    const nominating = findXmlTextNode(row, nominatingElem);

    recordParticipation(candidate, electionId, 'candidate');
    recordParticipation(member, electionId, 'member');
    recordParticipation(nominating, electionId, 'nominating');
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
        console.warn(electionId, participationKind);
        return;
    }
    let partyParticipation = participations[partyId] || {};
    participations[partyId] = partyParticipation;
    let electionRecord = partyParticipation[electionId] || {};
    partyParticipation[electionId] = electionRecord;
    electionRecord[participationKind] = true;
}
