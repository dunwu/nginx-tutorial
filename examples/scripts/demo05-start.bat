@echo off
rem -----------------------------------------------------------------------------
rem  Demo05 - 使用 Nginx 搭建文件服务器
rem  1. 启动 Nginx
rem  2. 访问地址：
rem     localhost:9050
rem -----------------------------------------------------------------------------

echo ">>>> 1. Start nginx"
pushd %~dp0..\nginx-1.14.0
call nginx-start.bat
popd


