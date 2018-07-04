rem -------------------------------------------------
rem 本脚本用于编译打包 JavaWebApp
rem 环境要求：Maven + JDK8
rem -------------------------------------------------

@echo off
cd "../javaapp"
mvn clean package -Dmaven.test.skip=true
pause
