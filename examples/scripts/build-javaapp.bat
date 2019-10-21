@echo off
rem -------------------------------------------------
rem  本脚本用于编译打包 JavaWebApp
rem  环境要求：Maven + JDK8
rem -------------------------------------------------

pushd %~dp0..\javaapp
call mvn clean package -Dmaven.test.skip=true
popd

pause
