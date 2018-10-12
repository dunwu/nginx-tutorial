@echo off
rem -----------------------------------------------------------------------------
rem  Demo04 - 动静分离
rem  1. 启动 Nginx
rem  2. 启动一个 JavaApp，访问地址分别为：
rem     localhost:9040
rem -----------------------------------------------------------------------------

echo ">>>> 1. Start nginx"
pushd %~dp0..\nginx-1.14.0
call nginx-start.bat
popd

echo ">>>> 2. Start 3 java app: localhost:9040"
pushd %~dp0..\javaapp
start /min java -Dtomcat.connector.port=9040 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
popd
pause


