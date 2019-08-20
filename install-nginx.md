# Nginx 安装

<!-- TOC depthFrom:2 depthTo:3 -->

- [Windows 安装](#windows-安装)
- [Linux 安装](#linux-安装)
    - [rpm 包方式（推荐）](#rpm-包方式推荐)
    - [源码编译方式](#源码编译方式)
- [Linux 开机自启动](#linux-开机自启动)
    - [rpm 包方式](#rpm-包方式)
    - [源码编译方式](#源码编译方式-1)
- [脚本](#脚本)
- [参考资料](#参考资料)

<!-- /TOC -->

## Windows 安装

（1）进入[官方下载地址](https://nginx.org/en/download.html)，选择合适版本（nginx/Windows-xxx）。

<br><div align="center"><img src="http://dunwu.test.upcdn.net/snap/20180920181023092347.png"/></div><br>

（2）解压到本地

<br><div align="center"><img src="http://dunwu.test.upcdn.net/snap/20180920181023092044.png"/></div><br>

（3）启动

下面以 C 盘根目录为例说明下：

```
cd C:
cd C:\nginx-0.8.54 start nginx
```

> 注：Nginx / Win32 是运行在一个控制台程序，而非 windows 服务方式的。服务器方式目前还是开发尝试中。

## Linux 安装

### rpm 包方式（推荐）

（1）进入[下载页面](http://nginx.org/packages/)，选择合适版本下载。

```sh
$ wget http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

（2）安装 nginx rpm 包

nginx rpm 包实际上安装的是 nginx 的 yum 源。

```
$ rpm -ivh nginx-*.rpm
```

（3）正式安装 rpm 包

```
$ yum install nginx
```

（4）关闭防火墙

```sh
$ firewall-cmd --zone=public --add-port=80/tcp --permanent
$ firewall-cmd --reload
```

### 源码编译方式

#### 安装编译工具及库文件

Nginx 源码的编译依赖于 gcc 以及一些库文件，所以必须提前安装。

```sh
$ yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

Nginx 依赖 pcre 库，安装步骤如下：

（1）下载解压到本地

进入[pcre 官网下载页面](https://sourceforge.net/projects/pcre/files/pcre/)，选择合适的版本下载。

我选择的是 8.35 版本：

```
wget -O /opt/pcre/pcre-8.35.tar.gz http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz
cd /opt/pcre
tar zxvf pcre-8.35.tar.gz
```

（2）编译安装

执行以下命令：

```
cd /opt/pcre/pcre-8.35
./configure
make && make install
```

（3）检验是否安装成功

执行 `pcre-config --version` 命令。

#### 安装 Nginx

安装步骤如下：

（1）下载解压到本地

进入官网下载地址：http://nginx.org/en/download.html ，选择合适的版本下载。

我选择的是 1.12.2 版本：http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz

```
wget -O /opt/nginx/nginx-1.12.2.tar.gz http://nginx.org/download/nginx-1.12.2.tar.gz
cd /opt/nginx
tar zxvf nginx-1.12.2.tar.gz
```

（2）编译安装

执行以下命令：

```
cd /opt/nginx/nginx-1.12.2
./configure --with-http_stub_status_module --with-http_ssl_module --with-pcre=/opt/pcre/pcre-8.35
```

（3）关闭防火墙

```sh
$ firewall-cmd --zone=public --add-port=80/tcp --permanent
$ firewall-cmd --reload
```

（4） 启动 Nginx

安装成功后，直接执行 `nginx` 命令即可启动 nginx。

启动后，访问站点：

<br><div align="center"><img src="http://dunwu.test.upcdn.net/snap/20180920181016133223.png"/></div><br>

## Linux 开机自启动

Centos7 以上是用 Systemd 进行系统初始化的，Systemd 是 Linux 系统中最新的初始化系统（init），它主要的设计目标是克服 sysvinit 固有的缺点，提高系统的启动速度。Systemd 服务文件以 .service 结尾。

### rpm 包方式

如果是通过 rpm 包安装的，会自动创建 nginx.service 文件。

直接用命令：

```sh
$ systemctl enable nginx.service
```

设置开机启动即可。

### 源码编译方式

如果采用源码编译方式，需要手动创建 nginx.service 文件。

## 脚本

| [安装脚本](https://github.com/dunwu/linux-tutorial/tree/master/codes/linux/soft) |

## 参考资料

- http://www.dohooe.com/2016/03/03/352.html?utm_source=tuicool&utm_medium=referral
