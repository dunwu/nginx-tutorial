@echo off
rem -------------------------------------------------
rem The script is use to package JavaWebApp
rem Env: Nodejs 8.x
rem -------------------------------------------------

pushd %~dp0..\reactapp

echo ">>>> 1. Delete node_modules"
rd /s /q node_modules

echo ">>>> 2. npm install"
rem 安装本地依赖
call npm install

echo ">>>> 3. npm run prod"
rem 构建生产环境，构建的静态资源文件在 dist 目录
call npm run prod

popd

pause
