const Dbf = require('dbf-reader').Dbf;
const XmlReader = require('xml-reader');
const fs = require('fs');
const iconv = require('iconv-lite');

let participations = {};

importXml('data/prez/prez2013-perk.xml', 'prez2013', 'PE_REGKAND_ROW', null, 'PSTRANA', 'NSTRANA');
importXml('data/prez/prez2018-perk.xml', 'prez2018', 'PE_REGKAND_ROW', null, 'PSTRANA', 'NSTRANA');

importDbf('data/ps/ps2006-psrk.dbf', 'ps2006', [['KSTRANA'], loadDbfMapping('data/ps/ps2006-psrkl.dbf', ['KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importDbf('data/ps/ps2010-psrk.dbf', 'ps2010', [['KSTRANA'], loadDbfMapping('data/ps/ps2010-psrkl.dbf', ['KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importDbf('data/ps/ps2013-psrk.dbf', 'ps2013', [['KSTRANA'], loadDbfMapping('data/ps/ps2013-psrkl.dbf', ['KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ps/ps2017nss-psrk.xml', 'ps2017nss', 'PS_REGKAND_ROW', [['KSTRANA'], loadXmlMapping('data/ps/ps2017nss-psrkl.xml', 'PS_RKL_ROW', ['KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');
importXml('data/ps/ps2021-psrk.xml', 'ps2021', 'PS_REGKAND_ROW', [['KSTRANA'], loadXmlMapping('data/ps/ps2021-psrkl.xml', 'PS_RKL_ROW', ['KSTRANA'], 'VSTRANA')], 'PSTRANA', 'NSTRANA');

importXml('data/se/se2008-serk.xml', 'se2008', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2010-serk.xml', 'se2010', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2011-serk.xml', 'se2011', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2012-serk.xml', 'se2012', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2014leden-serk.xml', 'se2014leden', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2014zari-serk.xml', 'se2014zari', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2014-serk.xml', 'se2014', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2016-serk.xml', 'se2016', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2017-serk.xml', 'se2017', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
importXml('data/se/se2018leden-serk.xml', 'se2018leden', 'SE_REGKAND_ROW', 'VSTRANA', 'PSTRANA', 'NSTRANA');
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

// console.log(participations);

let partyCodebook = importXmlCodebook('data/current-cvs.xml', 'CVS_ROW', 'VSTRANA', ['NAZEVCELK', 'NAZEV_STRV', 'ZKRATKAV30', 'ZKRATKAV8', 'ZKRATKA_OF', 'POCSTR_SLO', 'TYPVS']);
addSpecialParty(partyCodebook, '0', ['Žádná strana', '(Kandidát byl pravděpodobně stažen)'])

addSpecialParty(partyCodebook, '997', ['Poslanci', '(Kandidát byl navržen poslanci)'])
addSpecialParty(partyCodebook, '998', ['Senátoři', '(Kandidát byl navržen senátory)'])
addSpecialParty(partyCodebook, '999', ['Občan', '(Kandidát byl navržen peticí občanů)'])

addSpecialParty(partyCodebook, '9991', ['Conservative'])
addSpecialParty(partyCodebook, '9992', ['Piraten'])

const electionCodebook = {
    'prez2013': { title: 'Volba prezidenta republiky konaná ve dnech 11.01. – 12.01.2013', link: 'https://www.volby.cz/pls/prez2013/pe', date: '20130111' },
    'prez2018': { title: 'Volba prezidenta republiky konaná ve dnech 12.01. – 13.01.2018', link: 'https://www.volby.cz/pls/prez2018/pe', date: '20180112' },

    'ps2006': { title: 'Volby do Poslanecké sněmovny Parlamentu České republiky konané ve dnech 02.06. – 03.06.2006', link: 'https://www.volby.cz/pls/ps2006/ps?xjazyk=CZ', date: '20060602' },
    'ps2010': { title: 'Volby do Poslanecké sněmovny Parlamentu České republiky konané ve dnech 28.05. – 29.05.2010', link: 'https://www.volby.cz/pls/ps2010/ps?xjazyk=CZ', date: '20100528' },
    'ps2013': { title: 'Volby do Poslanecké sněmovny Parlamentu České republiky konané ve dnech 25.10. – 26.10.2013', link: 'https://www.volby.cz/pls/ps2013/ps?xjazyk=CZ', date: '20131025' },
    'ps2017nss': { title: 'Volby do Poslanecké sněmovny Parlamentu České republiky konané ve dnech 20.10. – 21.10.2017', link: 'https://www.volby.cz/pls/ps2017nss/ps?xjazyk=CZ', date: '20171020' },
    'ps2021': { title: 'Volby do Poslanecké sněmovny Parlamentu České republiky konané ve dnech 8.10. – 9.10.2021', link: 'https://www.volby.cz/pls/ps2021/ps?xjazyk=CZ', date: '20211008' },

    'se2008': { title: 'Volby do Senátu Parlamentu ČR konané dne 17.10. – 18.10.2008', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20081017', date: '20081017' },
    'se2010': { title: 'Volby do Senátu Parlamentu ČR konané dne 15.10. – 16.10.2010', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20101015', date: '20101015' },
    'se2011': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 18.3. – 19.3.2011', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20110318', date: '20110318' },
    'se2012': { title: 'Volby do Senátu Parlamentu ČR konané dne 12.10. – 13.10.2012', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20121012', date: '20121012' },
    'se2014leden': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 10.1. – 11.1.2014', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20140110', date: '20140110' },
    'se2014zari': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 19.9. – 20.9.2014', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20140919', date: '20140919' },
    'se2014': { title: 'Volby do Senátu Parlamentu ČR konané dne 10.10. – 11.10.2014', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20141010', date: '20141010' },
    'se2016': { title: 'Volby do Senátu Parlamentu ČR konané dne 7.10. – 8.10.2016', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20161007', date: '20161007' },
    'se2017': { title: 'Opakované volby do Senátu Parlamentu ČR konané dne 27.1. – 28.1.2017', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20170127', date: '20170127' },
    'se2018leden': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 5.1. – 6.1.2018', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20180105', date: '20180105' },
    'se2018kveten': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 18.5. – 19.5.2018', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20180518', date: '20180518' },
    'se2018': { title: 'Volby do Senátu Parlamentu ČR konané dne 5.10. – 6.10.2018', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20181005', date: '20181005' },
    'se2019': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 5.4. – 6.4.2019', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20190405', date: '20190405' },
    'se2020cerven': { title: 'Doplňovací volby do Senátu Parlamentu ČR konané dne 5.6. – 6.6.2020', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20200605', date: '20200605' },
    'se2020': { title: 'Volby do Senátu Parlamentu ČR konané dne 2.10. – 3.10.2020', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20201002', date: '20201002' },
    'se2022': { title: 'Volby do Senátu Parlamentu ČR konané dne 23.9. – 24.9.2022', link: 'https://www.volby.cz/pls/senat/se?xjazyk=CZ&xdatum=20220923', date: '20220923' },

    'kz2008': { title: 'Volby do zastupitelstev krajů konané dne 17.10. – 18.10.2008', link: 'https://www.volby.cz/pls/kz2008/kz?xjazyk=CZ&xdatum=20081017', date: '20081017' },
    'kz2012': { title: 'Volby do zastupitelstev krajů konané dne 12.10. – 13.10.2012', link: 'https://www.volby.cz/pls/kz2012/kz?xjazyk=CZ&xdatum=20121012', date: '20121012' },
    'kz2016': { title: 'Volby do zastupitelstev krajů konané dne 7.10. – 8.10.2016', link: 'https://www.volby.cz/pls/kz2016/kz?xjazyk=CZ&xdatum=20161007', date: '20161007' },
    'kz2020': { title: 'Volby do zastupitelstev krajů konané dne 2.10. – 3.10.2020', link: 'https://www.volby.cz/pls/kz2020/kz?xjazyk=CZ', date: '20201002' },

    'kv2006': { title: 'Volby do zastupitelstev obcí 20.10. - 21.10.2006', link: 'https://www.volby.cz/pls/kv2006/kv?xjazyk=CZ&xid=1', date: '20061020' },
    'kv2010': { title: 'Volby do zastupitelstev obcí 15.10. - 16.10.2010', link: 'https://www.volby.cz/pls/kv2010/kv?xjazyk=CZ&xid=1', date: '20101015' },
    'kv2014': { title: 'Volby do zastupitelstev obcí 10.10. - 11.10.2014', link: 'https://www.volby.cz/pls/kv2014/kv?xjazyk=CZ&xid=1', date: '20141010' },
    'kv2018': { title: 'Volby do zastupitelstev obcí 05.10. - 06.10.2018', link: 'https://www.volby.cz/pls/kv2018/kv?xjazyk=CZ&xid=1', date: '20181005' },
    'kv2022': { title: 'Volby do zastupitelstev obcí konané 23.09. – 24.09.2022', link: 'https://www.volby.cz/pls/kv2022/kv?xjazyk=CZ&xid=1', date: '20220923' },

    'ep2004': { title: 'Volby do Evropského parlamentu konané na území České republiky ve dnech 11.06. – 12.06.2004', link: 'https://www.volby.cz/pls/ep2004/ep?xjazyk=CZ', date: '20040611' },
    'ep2009': { title: 'Volby do Evropského parlamentu konané na území České republiky ve dnech 05.06. – 06.06.2009', link: 'https://www.volby.cz/pls/ep2009/ep?xjazyk=CZ', date: '20090605' },
    'ep2014': { title: 'Volby do Evropského parlamentu konané na území České republiky ve dnech 23.05. – 24.05.2014', link: 'https://www.volby.cz/pls/ep2014/ep?xjazyk=CZ', date: '20140523' },
    'ep2019': { title: 'Volby do Evropského parlamentu konané na území České republiky ve dnech 24.05. – 25.05.2019', link: 'https://www.volby.cz/pls/ep2019/ep?xjazyk=CZ', date: '20190524' },
};

const partyType = {
    'S': 'politická strana, hnutí',
    'K': 'koalice',
    'N': 'samostatný nezávislý kandidát',
    'M': 'sdružení nezávislých kandidátů',
    'D': 'sdružení nezávislých kandidátů a politických stran, hnutí'
};

for (const partyId of Object.keys(participations)) {
    let partyInfo = partyCodebook[partyId];
    if (!partyInfo) {
        console.error(`No party data for ${partyId}`);
        return;
    }
    let output = [];

    output.push(`<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(partyInfo[0])} – účast ve volbách</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>${escapeHtml(partyInfo[0])}</h1>

  <dl>`);
    addDef(output, 'Zkrácený název volební strany (50 znaků)', partyInfo[1]);
    addDef(output, 'Zkrácený název (30 znaků)', partyInfo[2]);
    addDef(output, 'Zkratka názvu (8 znaků)', partyInfo[3]);
    addDef(output, 'Oficiální zkratka názvu volební strany', partyInfo[4]);
    addDef(output, 'Typ volební strany', partyType[partyInfo[6]] || '?');

    const partyCount = +partyInfo[5];
    if (partyCount > 1) {
        addDef(output, 'Počet politických subjektů ve složení volební strany', partyCount);
    }

    output.push(`
  </dl>

  <h2>Účast ve volbách</h2>
  <ul>`);

    const elections = participations[partyId];

    let electionIds = Object.keys(elections);
    electionIds.sort((a, b) => {
        const ad = (electionCodebook[a] || {}).date || '?';
        const bd = (electionCodebook[b] || {}).date || '?';
        if (ad > bd) return +1;
        if (ad < bd) return -1;
        return 0;
    });

    for (let electionId of electionIds) {
        const electionFlags = elections[electionId];
        const electionInfo = electionCodebook[electionId] || { title: electionId, link: '#' };
        output.push(`
    <li><a href="${electionInfo.link}">${escapeHtml(electionInfo.title)}</a> (`);
        let flagNames = [];
        if (electionFlags.candidate) flagNames.push('přímá účast');
        if (electionFlags.member) flagNames.push('kandidoval člen');
        if (electionFlags.nominating) flagNames.push('navržen kandidát');
        output.push(flagNames.join(', '));
        output.push(')</li>');
    }

    output.push(`
  </ul>

  <h2>Externí odkazy</h2>
  <ul>
    <li><a href="https://hub.toolforge.org/P11031:${partyId}?site=wikidata">Hledat na Wikidatech pomocí Hubu</a></li>
    <li><a href="https://query.wikidata.org/embed.html#SELECT%20%3Fitem%20%3FitemLabel%20%3Frank%20WHERE%20%7B%0A%20%20%3Fitem%20p%3AP11031%20%3Fprop.%0A%20%20%3Fprop%20ps%3AP11031%20%22${partyId}%22%3B%0A%20%20%20%20wikibase%3Arank%20%3Frank.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22cs%22.%20%7D%0A%7D">Hledat na Wikidatech pomocí WQS</a></li>
  </ul>

  <hr>
  <footer>
    Vygenerováno automaticky na základě <a href="https://www.volby.cz/opendata/opendata.htm">Otevřených dat pro volební výsledky</a> publikovaných ČSÚ. Pro zdrojový kód, připomínky a hlášení chyb vizte <a href="https://github.com/mormegil-cz/wikidata-imports/tree/master/volby">GitHub</a>.
  </footer>
</body>
</html>
`);

    fs.writeFileSync(`output/${partyId}.htm`, output.join(''));
}

function addDef(output, heading, value) {
    if (!value) return;
    output.push(`
    <dt>${heading}</dt>
    <dd>${escapeHtml(value)}</dd>`);
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function addSpecialParty(codebook, partyId, data) {
    if (codebook[partyId]) {
        console.error(`${partyId} already defined in codebook`);
        return;
    }
    codebook[partyId] = data;
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
    let partyId;
    if (Array.isArray(col)) {
        colNames = col[0];
        mappingFunction = col[1];

        const idParts = colNames.map(colName => row[colName]);
        const id = idParts.join(':');
        partyId = mappingFunction(id);
        if (!partyId) {
            console.warn(`Unable to map ${id}`);
            return;
        }
    } else {
        partyId = row[col];
        if (!partyId) {
            // possibly “candidate removed by registration authority”
            // console.debug(`No ${elemInfo} found in ${electionId}: ${JSON.stringify(row)}`);
            return;
        }
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
    reader.parse(iconv.decode(buffer, 'utf-8'));
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
                return (child.children[0].value ?? '').replace(/&quot;/g, '"');
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
