rem -------------------------------------------------
rem  启动 Demo1
rem  1. 启动 Nginx
rem  2. 启动一个 JavaApp，访问地址为：localhost:9010
rem -------------------------------------------------
@echo off
echo ">>>> 1. Start nginx"
cd "../nginx-1.14.0"
call nginx-start.bat

echo ">>>> 2. Start javaapp - localhost:9010"
cd "../javaapp"
java -Dtomcat.connector.port=9010 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
pause


