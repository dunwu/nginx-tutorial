@echo off

rem 1. 如果目录不存在 logs 目录，则创建
if not exist %~dp0logs (
  echo %~dp0logs is not exists, create it.
  md %~dp0logs
)

rem 2. 如果目录不存在 temp 目录，则创建
if not exist %~dp0temp (
  echo %~dp0temp is not exists, create it.
  md %~dp0temp
)

rem 3. 指定 conf/nginx.conf ，启动 nginx
nginx.exe -t -c conf/nginx.conf
start nginx
