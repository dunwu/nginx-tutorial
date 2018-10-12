# Nginx 示例教程

<!-- TOC depthFrom:2 depthTo:3 -->

- [教程说明](#教程说明)
    - [环境要求](#环境要求)
    - [javaapp](#javaapp)
    - [nginx-1.14.0](#nginx-1140)
    - [scripts](#scripts)
    - [添加 hosts](#添加-hosts)
- [示例说明](#示例说明)
    - [Demo01 - 简单的反向代理示例](#demo01---简单的反向代理示例)
    - [Demo02 - 负载均衡示例](#demo02---负载均衡示例)
    - [Demo03 - 多 webapp 示例](#demo03---多-webapp-示例)
    - [Demo04 - 前后端分离示例](#demo04---前后端分离示例)
    - [Demo05 - 配置文件服务器示例](#demo05---配置文件服务器示例)

<!-- /TOC -->

## 教程说明

### 环境要求

- Maven
- JDK8
- Nginx-1.14.0（内置）

### javaapp

我写了一个嵌入式 Tomcat 的 Java 服务，代码在 javaapp 目录，基于 maven 管理。这个服务可以通过在启动时指定 `-Dtomcat.connector.port` 和 `-Dtomcat.context.path` 来分别指定服务启动时的端口号和 context。这样可以很方便的模拟多个服务器的场景。

例如：

```
java -Dtomcat.connector.port=9030 -Dtomcat.context.path=/app -cp "JavaWebApp/WEB-INF/classes;JavaWebApp/WEB-INF/lib/*" io.github.dunwu.app.Main
```

- `io.github.dunwu.app.Main` 是这个 Java 服务的启动类。
- `JavaWebApp/WEB-INF/classes;JavaWebApp/WEB-INF/lib/*` 是 class 路径和 lib 路径，必须指定，否则无法识别启动类。

如上的配置参数，可以启动一个端口号为 9030，上下文为 `/app` 的服务。访问路径为：http://localhost:9030/app。

### nginx-1.14.0

nginx-1.14.0 是 Nginx 的 windows 环境的 1.14.0 官方版本。之所以把它完整的放入本项目中也是为了方便演示。

我添加了两个 bat 脚本，可以启动和关闭 nginx 服务。

- [nginx-start.bat](nginx-1.14.0/nginx-start.bat)
- [nginx-stop.bat](nginx-1.14.0/nginx-stop.bat)

在 Nginx 默认配置文件 [nginx.conf](nginx-1.14.0/conf/nginx.conf) 中我通过配置 `include demos/*.conf;` 将 [Nginx/demos/nginx-1.14.0/conf/demos](nginx-1.14.0/conf/conf.d) 目录中所有 Nginx 配置示例都引入。

### scripts

`scripts` 中包含了运行示例的启动脚本。目前只支持 windows 下运行，当然想基于此教程改造为在 Linux 下运行也不难，将 nginx-1.14.0 替换为 Linux 版本，bat 脚本修改为 shell 即可。

运行步骤：

1.  首先必须执行 [build-javaapp.bat](scripts/build-javaapp.bat) 构建 javaapp
2.  想运行哪个 demo，就执行对应的 demoxx-start.bat 脚本。

### 添加 hosts

因为示例中使用的不是公网域名，域名服务器不能识别。所以，要演示示例，还需要修改本地 hosts。

- windows 的 host 路径一般在：`C:\Windows\System32\drivers\etc\hosts`
- linxu 的 host 路径一般在：`/etc/hosts`

## 示例说明

### Demo01 - 简单的反向代理示例

本示例启动一个 JavaApp，访问地址为：localhost:9010。
在 Nginx 中配置它的反向代理 host 为 www.demo01.com。Nginx 配置文件：[demo01.conf](nginx-1.14.0/conf/conf.d/demo01.conf)

运行步骤：

1.  执行 [demo01-start.bat](scripts/demo01-start.bat) 脚本。
2.  配置 hosts：`127.0.0.1 www.demo01.com`
3.  在浏览器中访问：www.demo01.com

<div align="center">
<img src="https://upload-images.jianshu.io/upload_images/3101171-5c01eb12cba5e895.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width="500"/>
</div>

### Demo02 - 负载均衡示例

本示例启动三个 JavaApp，访问地址分别为：

- localhost:9021
- localhost:9022
- localhost:9023

在 Nginx 中统一配置它们的反向代理 host 为 www.demo02.com，并设置相应权重，以便做负载均衡。Nginx 配置文件：[demo02.conf](nginx-1.14.0/conf/conf.d/demo02.conf)

运行步骤：

1.  执行 [demo02-start.bat](scripts/demo02-start.bat) 脚本。
2.  配置 hosts：`127.0.0.1 www.demo02.com`
3.  在浏览器中访问：www.demo02.com

如图所示：三次访问的端口号各不相同，说明三个服务器各自均有不同机率（基于权重）被访问。

<div align="center">
<img src="https://upload-images.jianshu.io/upload_images/3101171-c11b9d9f4b47c689.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width="600"/>
</div>

### Demo03 - 多 webapp 示例

当一个网站功能越来越丰富时，往往需要将一些功能相对独立的模块剥离出来，独立维护。这样的话，通常，会有多个 webapp。

http 的默认端口号是 80，如果在一台服务器上同时启动这 3 个 webapp 应用，都用 80 端口，肯定是不成的。所以，这三个应用需要分别绑定不同的端口号。

本示例启动三个 JavaApp，访问地址分别为：

- localhost:9030/
- localhost:9031/product
- localhost:9032/user

Nginx 中的配置要点就是为每个 server 配置一个 upstream。并在 server 配置下的 location 中指定 context 对应的 upstream。

Nginx 配置文件：[demo03.conf](nginx-1.14.0/conf/conf.d/demo03.conf)

运行步骤：

1.  执行 [demo03-start.bat](scripts/demo03-start.bat) 脚本。
2.  配置 hosts：`127.0.0.1 www.demo03.com`
3.  在浏览器中访问：www.demo03.com

如图所示：三次访问的 context 和端口号各不相同。说明 Nginx 根据不同的 context 将请求分发到指定的服务器上。

<div align="center">
<img src="https://upload-images.jianshu.io/upload_images/3101171-ed726bdd60bea9ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width="600"/>
</div>

### Demo04 - 前后端分离示例

做 web 开发，常常会把前后端分离，减少耦合。那么，前后端之间如何通信呢？可以使用 Nginx 来代理。

本例中，后端是一个 java web 项目；前端是一个 react 项目。

Nginx 中的配置要点

指定 root 参数为 react 项目构建后的静态文件存储路径。
指定后端应用的访问地址

```
location ~ ^/api/ {
    proxy_pass http://backend;
    rewrite "^/api/(.*)$" /$1 break;
}
```

Nginx 配置文件：[demo04.conf](nginx-1.14.0/conf/conf.d/demo04.conf)

运行准备：由于我的配置中设置 root 的路径为我自己机器中的绝对路径，所以，各位在运行本例的时候要根据自己的实际情况替换。

运行步骤：

1.  执行 [demo04-start.bat](scripts/demo04-start.bat) 脚本。
2.  配置 hosts：`127.0.0.1 www.demo04.com`
3.  在浏览器中访问：www.demo04.com

效果图：

![](http://oyz7npk35.bkt.clouddn.com/images/20180920181012180110.png)

按 F12 打开浏览器控制台，输入用户名/密码（admin/123456）执行登录操作。如下图所示，可以看到登录后的访问请求被转发到了 Nginx 配置的服务器地址。
![](http://oyz7npk35.bkt.clouddn.com/images/20180920181012180317.png)

### Demo05 - 配置文件服务器示例

有时候，团队需要归档一些数据或资料，那么文件服务器必不可少。使用 Nginx 可以非常快速便捷的搭建一个简易的文件服务。

Nginx 中的配置要点：

- 将 autoindex 开启可以显示目录，默认不开启。
- 将 autoindex_exact_size 开启可以显示文件的大小。
- 将 autoindex_localtime 开启可以显示文件的修改时间。
- root 用来设置开放为文件服务的根路径。
- charset 设置为 `charset utf-8,gbk;`，可以避免中文乱码问题（windows 服务器下设置后，依然乱码，本人暂时没有找到解决方法）。

Nginx 配置文件：[demo05.conf](nginx-1.14.0/conf/conf.d/demo05.conf)

运行准备：由于我的配置中设置 root 的路径为我自己机器中的绝对路径，所以，各位在运行本例的时候要根据自己的实际情况替换。

运行步骤：

1.  执行 [demo05-start.bat](scripts/demo05-start.bat) 脚本。
2.  配置 hosts：`127.0.0.1 www.demo05.com`
3.  在浏览器中访问：www.demo05.com

效果图如下：

![](http://oyz7npk35.bkt.clouddn.com/images/20180920181012181357.png)