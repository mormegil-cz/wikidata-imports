@echo off

if exist download.tmp.zip del download.tmp.zip


call :process "https://www.volby.cz/opendata/se2022/SE2022ciselniky20220902.zip" "." "cvs.xml" "current-cvs.xml"

call :process "https://www.volby.cz/opendata/prez2013/PREZ2013reg20130126.zip" "prez" "perk.xml" "prez2013-perk.xml"
call :process "https://www.volby.cz/opendata/prez2018/PREZ2018reg20180127.zip" "prez" "perk.xml" "prez2018-perk.xml"

call :process "https://www.volby.cz/opendata/ps2006/PS2006reg2006.zip" "ps" "PSRK.dbf" "ps2006-psrk.dbf" "PSRKL.dbf" "ps2006-psrkl.dbf"
call :process "https://www.volby.cz/opendata/ps2010/PS2010reg2010.zip" "ps" "PSRK.dbf" "ps2010-psrk.dbf" "PSRKL.dbf" "ps2010-psrkl.dbf"
call :process "https://www.volby.cz/opendata/ps2013/PS2013reg20131026.zip" "ps" "PSRK.dbf" "ps2013-psrk.dbf" "PSRKL.dbf" "ps2013-psrkl.dbf"
call :process "https://www.volby.cz/opendata/ps2017nss/PS2017reg20171122.zip" "ps" "psrk.xml" "ps2017nss-psrk.xml" "psrkl.xml" "ps2017nss-psrkl.xml"
call :process "https://www.volby.cz/opendata/ps2021/PS2021reg20211111.zip" "ps" "psrk.xml" "ps2021-psrk.xml" "psrkl.xml" "ps2021-psrkl.xml"

call :process "https://www.volby.cz/opendata/se2008/SE2008reg.zip" "se" "serk.xml" "se2008-serk.xml"
call :process "https://www.volby.cz/opendata/se2010/SE2010reg.zip" "se" "serk.xml" "se2010-serk.xml"
call :process "https://www.volby.cz/opendata/se2011/SE2011reg.zip" "se" "serk.xml" "se2011-serk.xml"
call :process "https://www.volby.cz/opendata/se2012/SE2012reg.zip" "se" "serk.xml" "se2012-serk.xml"
call :process "https://www.volby.cz/opendata/se2014leden/SE2014LEDENreg.zip" "se" "serk.xml" "se2014leden-serk.xml"
call :process "https://www.volby.cz/opendata/se2014zari/SE2014ZARIreg20140927.zip" "se" "serk.xml" "se2014zari-serk.xml"
call :process "https://www.volby.cz/opendata/se2014/SE2014reg20141018.zip" "se" "serk.xml" "se2014-serk.xml"
call :process "https://volby.cz/opendata/se2016/SE2016reg20161015.zip" "se" "serk.xml" "se2016-serk.xml"
call :process "https://volby.cz/opendata/se2017/SE2017reg20170128.zip" "se" "serk.xml" "se2017-serk.xml"
call :process "https://volby.cz/opendata/se2018leden/SE2018reg20180113.zip" "se" "serk.xml" "se2017-serk.xml"
call :process "https://www.volby.cz/opendata/se2018leden/SE2018reg20180113.zip" "se" "serk.xml" "se2018leden-serk.xml"
call :process "https://volby.cz/opendata/se2018kveten/SE2018reg20180526.zip" "se" "serk.xml" "se2018kveten-serk.xml"
call :process "https://volby.cz/opendata/se2018/SE2018reg20181013.zip" "se" "serk.xml" "se2018-serk.xml"
call :process "https://volby.cz/opendata/se2019duben/SE2019reg20190413.zip" "se" "serk.xml" "se2019-serk.xml"
call :process "https://volby.cz/opendata/se2020cerven/SE2020reg20200613.zip" "se" "serk.xml" "se2020cerven-serk.xml"
call :process "https://www.volby.cz/opendata/se2020/SE2020reg20201010.zip" "se" "serk.xml" "se2020-serk.xml"
call :process "https://volby.cz/opendata/se2022/SE2022reg20220902.zip" "se" "serk.xml" "se2022-serk.xml"

call :process "https://www.volby.cz/opendata/kz2008/kz2008_data_dbf.zip" "kz" "KZRK.DBF" "kz2008-kzrk.dbf" "KZRKL.dbf" "kz2008-kzrkl.dbf"
call :process "https://www.volby.cz/opendata/kz2012/kz2012_data_dbf.zip" "kz" "KZRK.dbf" "kz2012-kzrk.dbf" "KZRKL.dbf" "kz2012-kzrkl.dbf"
call :process "https://www.volby.cz/opendata/kz2016/KZ2016reg20161008.zip" "kz" "kzrk.xml" "kz2016-kzrk.xml" "kzrkl.xml" "kz2016-kzrkl.xml"
call :process "https://www.volby.cz/opendata/kz2020/KZ2020reg20201004a.zip" "kz" "kzrk.xml" "kz2020-kzrk.xml" "kzrkl.xml" "kz2020-kzrkl.xml"

call :process "https://volby.cz/opendata/kv2006/KV2006reg20140909.zip" "kv" "kvrk.xml" "kv2006-kvrk.xml" "kvros.xml" "kv2006-kvros.xml"
call :process "https://www.volby.cz/opendata/kv2010/KV2010reg20140903.zip" "kv" "kvrk.xml" "kv2010-kvrk.xml" "kvros.xml" "kv2010-kvros.xml"
call :process "https://www.volby.cz/opendata/kv2014/KV2014reg20141014.zip" "kv" "kvrk.xml" "kv2014-kvrk.xml" "kvros.xml" "kv2014-kvros.xml"
call :process "https://www.volby.cz/opendata/kv2018/KV2018reg20181008.zip" "kv" "kvrk.xml" "kv2018-kvrk.xml" "kvros.xml" "kv2018-kvros.xml"
call :process "https://www.volby.cz/opendata/kv2022/KV2022reg20220902.zip" "kv" "kvrk.xml" "kv2022-kvrk.xml" "kvros.xml" "kv2022-kvros.xml"

call :process "https://www.volby.cz/opendata/ep2004/EP2004reg.zip" "ep" "eprk.xml" "ep2004-eprk.xml" "eprkl.xml" "ep2004-eprkl.xml"
call :process "https://www.volby.cz/opendata/ep2009/EP2009reg.zip" "ep" "eprk.xml" "ep2009-eprk.xml" "eprkl.xml" "ep2009-eprkl.xml"
call :process "https://www.volby.cz/opendata/ep2014/EP2014reg20140525.zip" "ep" "eprk.xml" "ep2014-eprk.xml" "eprkl.xml" "ep2014-eprkl.xml"
call :process "https://www.volby.cz/opendata/ep2019/EP2019reg20190526.zip" "ep" "eprk.xml" "ep2019-eprk.xml" "eprkl.xml" "ep2019-eprkl.xml"


goto :eof


:process
wget -O download.tmp.zip "%1"
if errorlevel 1 exit /B

:extract_loop
if "x%3x"=="xx" goto :process_done

unzip download.tmp.zip "%3" -d "%2"
if errorlevel 1 exit /B
if exist "%2\%4" del "%2\%4"
ren "%2\%3" "%4"

shift /3
shift /3
goto :extract_loop

:process_done
del download.tmp.zip
goto :eof



:eof
