@echo off

if exist download.tmp.zip del download.tmp.zip

goto :here

call :process "https://volby.cz/opendata/se2016/SE2016reg20161015.zip" "serk.xml" "se" "se2016-serk.xml"
call :process "https://volby.cz/opendata/se2017/SE2017reg20170128.zip" "serk.xml" "se" "se2017-serk.xml"
call :process "https://volby.cz/opendata/se2018leden/SE2018reg20180113.zip" "serk.xml" "se" "se2017-serk.xml"
call :process "https://volby.cz/opendata/se2018kveten/SE2018reg20180526.zip" "serk.xml" "se" "se2018kveten-serk.xml"
call :process "https://volby.cz/opendata/se2018/SE2018reg20181013.zip" "serk.xml" "se" "se2018-serk.xml"
call :process "https://volby.cz/opendata/se2019duben/SE2019reg20190413.zip" "serk.xml" "se" "se2019-serk.xml"
call :process "https://volby.cz/opendata/se2020cerven/SE2020reg20200613.zip" "serk.xml" "se" "se2020cerven-serk.xml"
call :process "https://volby.cz/opendata/se2020/SE2020ciselnik20200918.zip" "serk.xml" "se" "se2020-serk.xml"
call :process "https://volby.cz/opendata/se2022/SE2022reg20220902.zip" "serk.xml" "se" "se2022-serk.xml"

:here
call :process "https://volby.cz/opendata/kv2006/KV2006reg20140909.zip" "kvrk.xml" "kv" "kv2006-kvrk.xml" "kvros.xml" "kv2006-kvros.xml"




goto :eof


:process
wget -O download.tmp.zip "%1"
if errorlevel 1 exit

unzip download.tmp.zip "%2" -d "%3"
if exist "%3\%4" del "%3\%4"
ren "%3\%2" "%4"

if "x%5x"=="xx" goto :process_done

unzip download.tmp.zip "%5" -d "%3"
if exist "%3\%6" del "%3\%6"
ren "%3\%5" "%6"

:process_done
del download.tmp.zip
goto :eof



:eof
