@echo off
rem -------------------------------------------------
rem  启动 Demo1
rem  1. 启动 Nginx
rem  2. 启动一个 JavaApp，访问地址为：localhost:9010
rem -------------------------------------------------

echo ">>>> 1. Start nginx"
pushd %~dp0..\nginx-1.14.0
call nginx-start.bat
popd

echo ">>>> 2. Start javaapp - localhost:9010"
pushd %~dp0..\javaapp
call java -Dtomcat.connector.port=9010 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
popd

pause


