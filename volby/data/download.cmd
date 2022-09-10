@echo off

if exist download.tmp.zip del download.tmp.zip

goto :here

:here
call :process "https://volby.cz/opendata/se2016/SE2016reg20161015.zip" "se" "serk.xml" "se2016-serk.xml"
call :process "https://volby.cz/opendata/se2017/SE2017reg20170128.zip" "se" "serk.xml" "se2017-serk.xml"
call :process "https://volby.cz/opendata/se2018leden/SE2018reg20180113.zip" "se" "serk.xml" "se2017-serk.xml"
call :process "https://volby.cz/opendata/se2018kveten/SE2018reg20180526.zip" "se" "serk.xml" "se2018kveten-serk.xml"
call :process "https://volby.cz/opendata/se2018/SE2018reg20181013.zip" "se" "serk.xml" "se2018-serk.xml"
call :process "https://volby.cz/opendata/se2019duben/SE2019reg20190413.zip" "se" "serk.xml" "se2019-serk.xml"
call :process "https://volby.cz/opendata/se2020cerven/SE2020reg20200613.zip" "se" "serk.xml" "se2020cerven-serk.xml"
call :process "https://volby.cz/opendata/se2020/SE2020ciselnik20200918.zip" "se" "serk.xml" "se2020-serk.xml"
call :process "https://volby.cz/opendata/se2022/SE2022reg20220902.zip" "se" "serk.xml" "se2022-serk.xml"

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
