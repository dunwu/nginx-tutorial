rem -----------------------------------------------------------------------------
rem  Demo02 - 负载均衡配置（Nginx/demos/nginx-1.14.0/conf/demos/demo02.conf）
rem  1. 启动 Nginx
rem  2. 启动三个 JavaApp，访问地址分别为：
rem     localhost:9011
rem     localhost:9012
rem     localhost:9013
rem -----------------------------------------------------------------------------
@echo off
echo ">>>> 1. Start nginx"
cd "../nginx-1.14.0"
call nginx-start.bat

echo ">>>> 2. Start 3 java app: localhost:9011/localhost:9012/localhost:9013"
cd "../javaapp"
start /min java -Dtomcat.connector.port=9011 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.app.Main
start /min java -Dtomcat.connector.port=9012 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.app.Main
start /min java -Dtomcat.connector.port=9013 -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.app.Main
pause


