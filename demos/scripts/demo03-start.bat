rem -----------------------------------------------------------------------------
rem  Demo03 - 网站有多个 webapp 的配置（Nginx/demos/nginx-1.14.0/conf/demos/demo03.conf）
rem  1. 启动 Nginx
rem  2. 启动三个 JavaApp，访问地址分别为：
rem     localhost:9030/
rem     localhost:9031/product
rem     localhost:9032/user
rem -----------------------------------------------------------------------------
@echo off
echo ">>>> 1. Start nginx"
cd "../nginx-1.14.0"
call nginx-start.bat

echo ">>>> 2. Start 3 java app: localhost:9030, localhost:9031/product, localhost:9032/user"
cd "../javaapp"
start /min java -Dtomcat.connector.port=9030 -Dtomcat.context.path=/ -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
start /min java -Dtomcat.connector.port=9031 -Dtomcat.context.path=/product -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
start /min java -Dtomcat.connector.port=9032 -Dtomcat.context.path=/user -cp "target/JavaWebApp/WEB-INF/classes;target/JavaWebApp/WEB-INF/lib/*" io.github.dunwu.Main
pause


