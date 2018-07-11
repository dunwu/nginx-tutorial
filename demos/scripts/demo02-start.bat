rem -----------------------------------------------------------------------------
rem  Demo02 - 负载均衡配置（Nginx/demos/nginx-1.14.0/conf/demos/demo02.conf）
rem  1. 启动 Nginx
rem  2. 启动三个 JavaApp，访问地址分别为：
rem     localhost:9021
rem     localhost:9022
rem     localhost:9023
rem -----------------------------------------------------------------------------
@echo off
echo ">>>> 1. Start nginx"
cd "../nginx-1.14.0"
call nginx-start.bat

echo ">>>> 2. Start 3 java app: localhost:9021, localhost:9022, localhost:9023"
cd "../javaapp"
start /min java -Dtomcat.connector.port=9021 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
start /min java -Dtomcat.connector.port=9022 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
start /min java -Dtomcat.connector.port=9023 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
pause


