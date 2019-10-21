@echo off
rem -----------------------------------------------------------------------------
rem  Demo06 - 使用 Nginx 访问静态站点
rem  1. 启动 Nginx
rem  2. 访问地址：
rem     www.demo06.com
rem -----------------------------------------------------------------------------

echo ">>>> 1. Start nginx"
pushd %~dp0..\nginx-1.14.0
call nginx-start.bat
popd


