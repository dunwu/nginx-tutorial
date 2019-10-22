# Nginx 配置

> Nginx 的默认配置文件为 `nginx.conf`。
>
> - `nginx -c xxx.conf` - 以指定的文件作为配置文件，启动 Nginx。

## 配置文件实例

以下为一个 `nginx.conf` 配置文件实例：

```nginx
#定义 nginx 运行的用户和用户组
user www www;

#nginx 进程数，建议设置为等于 CPU 总核心数。
worker_processes 8;

#nginx 默认没有开启利用多核 CPU, 通过增加 worker_cpu_affinity 配置参数来充分利用多核 CPU 以下是 8 核的配置参数
worker_cpu_affinity 00000001 00000010 00000100 00001000 00010000 00100000 01000000 10000000;

#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
error_log /var/log/nginx/error.log info;

#进程文件
pid /var/run/nginx.pid;

#一个 nginx 进程打开的最多文件描述符数目，理论值应该是最多打开文件数（系统的值 ulimit -n）与 nginx 进程数相除，但是 nginx 分配请求并不均匀，所以建议与 ulimit -n 的值保持一致。
worker_rlimit_nofile 65535;

#工作模式与连接数上限
events
{
    #参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll 模型是 Linux 2.6 以上版本内核中的高性能网络 I/O 模型，如果跑在 FreeBSD 上面，就用 kqueue 模型。
    #epoll 是多路复用 IO(I/O Multiplexing) 中的一种方式，但是仅用于 linux2.6 以上内核，可以大大提高 nginx 的性能
    use epoll;

    ############################################################################
    #单个后台 worker process 进程的最大并发链接数
    #事件模块指令，定义 nginx 每个进程最大连接数，默认 1024。最大客户连接数由 worker_processes 和 worker_connections 决定
    #即 max_client=worker_processes*worker_connections, 在作为反向代理时：max_client=worker_processes*worker_connections / 4
    worker_connections 65535;
    ############################################################################
}

#设定 http 服务器
http {
    include mime.types; #文件扩展名与文件类型映射表
    default_type application/octet-stream; #默认文件类型
    #charset utf-8; #默认编码

    server_names_hash_bucket_size 128; #服务器名字的 hash 表大小
    client_header_buffer_size 32k; #上传文件大小限制
    large_client_header_buffers 4 64k; #设定请求缓
    client_max_body_size 8m; #设定请求缓
    sendfile on; #开启高效文件传输模式，sendfile 指令指定 nginx 是否调用 sendfile 函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘 IO 重负载应用，可设置为 off，以平衡磁盘与网络 I/O 处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成 off。
    autoindex on; #开启目录列表访问，合适下载服务器，默认关闭。
    tcp_nopush on; #防止网络阻塞
    tcp_nodelay on; #防止网络阻塞

    ##连接客户端超时时间各种参数设置##
    keepalive_timeout  120;          #单位是秒，客户端连接时时间，超时之后服务器端自动关闭该连接 如果 nginx 守护进程在这个等待的时间里，一直没有收到浏览发过来 http 请求，则关闭这个 http 连接
    client_header_timeout 10;        #客户端请求头的超时时间
    client_body_timeout 10;          #客户端请求主体超时时间
    reset_timedout_connection on;    #告诉 nginx 关闭不响应的客户端连接。这将会释放那个客户端所占有的内存空间
    send_timeout 10;                 #客户端响应超时时间，在两次客户端读取操作之间。如果在这段时间内，客户端没有读取任何数据，nginx 就会关闭连接
    ################################

    #FastCGI 相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;

    ###作为代理缓存服务器设置#######
    ###先写到 temp 再移动到 cache
    #proxy_cache_path /var/tmp/nginx/proxy_cache levels=1:2 keys_zone=cache_one:512m inactive=10m max_size=64m;
    ###以上 proxy_temp 和 proxy_cache 需要在同一个分区中
    ###levels=1:2 表示缓存级别，表示缓存目录的第一级目录是 1 个字符，第二级目录是 2 个字符 keys_zone=cache_one:128m 缓存空间起名为 cache_one 大小为 512m
    ###max_size=64m 表示单个文件超过 128m 就不缓存了  inactive=10m 表示缓存的数据，10 分钟内没有被访问过就删除
    #########end####################

    #####对传输文件压缩###########
    #gzip 模块设置
    gzip on; #开启 gzip 压缩输出
    gzip_min_length 1k; #最小压缩文件大小
    gzip_buffers 4 16k; #压缩缓冲区
    gzip_http_version 1.0; #压缩版本（默认 1.1，前端如果是 squid2.5 请使用 1.0）
    gzip_comp_level 2; #压缩等级，gzip 压缩比，1 为最小，处理最快；9 为压缩比最大，处理最慢，传输速度最快，也最消耗 CPU；
    gzip_types text/plain application/x-javascript text/css application/xml;
    #压缩类型，默认就已经包含 text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个 warn。
    gzip_vary on;
    ##############################

    #limit_zone crawler $binary_remote_addr 10m; #开启限制 IP 连接数的时候需要使用

    upstream blog.ha97.com {
        #upstream 的负载均衡，weight 是权重，可以根据机器配置定义权重。weigth 参数表示权值，权值越高被分配到的几率越大。
        server 192.168.80.121:80 weight=3;
        server 192.168.80.122:80 weight=2;
        server 192.168.80.123:80 weight=3;
    }

    #虚拟主机的配置
    server {
        #监听端口
        listen 80;

        #############https##################
        #listen 443 ssl;
        #ssl_certificate /opt/https/xxxxxx.crt;
        #ssl_certificate_key /opt/https/xxxxxx.key;
        #ssl_protocols SSLv3 TLSv1;
        #ssl_ciphers HIGH:!ADH:!EXPORT57:RC4+RSA:+MEDIUM;
        #ssl_prefer_server_ciphers on;
        #ssl_session_cache shared:SSL:2m;
        #ssl_session_timeout 5m;
        ####################################end

        #域名可以有多个，用空格隔开
        server_name www.ha97.com ha97.com;
        index index.html index.htm index.php;
        root /data/www/ha97;
        location ~ .*.(php|php5)?$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi.conf;
        }

        #图片缓存时间设置
        location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$ {
            expires 10d;
        }

        #JS 和 CSS 缓存时间设置
        location ~ .*.(js|css)?$ {
            expires 1h;
        }

        #日志格式设定
        log_format access '$remote_addr - $remote_user [$time_local] "$request" ' '$status $body_bytes_sent "$http_referer" ' '"$http_user_agent" $http_x_forwarded_for';

        #定义本虚拟主机的访问日志
        access_log /var/log/nginx/ha97access.log access;

        #对 "/" 启用反向代理
        location / {
            proxy_pass http://127.0.0.1:88;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的 Web 服务器可以通过 X-Forwarded-For 获取用户真实 IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            #以下是一些反向代理的配置，可选。
            proxy_set_header Host $host;
            client_max_body_size 10m; #允许客户端请求的最大单文件字节数
            client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数，

            ##代理设置 以下设置是 nginx 和后端服务器之间通讯的设置##
            proxy_connect_timeout 90; #nginx 跟后端服务器连接超时时间（代理连接超时）
            proxy_send_timeout 90; #后端服务器数据回传时间（代理发送超时）
            proxy_read_timeout 90; #连接成功后，后端服务器响应时间（代理接收超时）
            proxy_buffering on;    #该指令开启从后端被代理服务器的响应内容缓冲 此参数开启后 proxy_buffers 和 proxy_busy_buffers_size 参数才会起作用
            proxy_buffer_size 4k;  #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k;   #proxy_buffers 缓冲区，网页平均在 32k 以下的设置
            proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
            proxy_max_temp_file_size 2048m; #默认 1024m, 该指令用于设置当网页内容大于 proxy_buffers 时，临时文件大小的最大值。如果文件大于这个值，它将从 upstream 服务器同步地传递请求，而不是缓冲到磁盘
            proxy_temp_file_write_size 512k; 这是当被代理服务器的响应过大时 nginx 一次性写入临时文件的数据量。
            proxy_temp_path  /var/tmp/nginx/proxy_temp;    ##定义缓冲存储目录，之前必须要先手动创建此目录
            proxy_headers_hash_max_size 51200;
            proxy_headers_hash_bucket_size 6400;
            #######################################################
        }

        #设定查看 nginx 状态的地址
        location /nginxStatus {
            stub_status on;
            access_log on;
            auth_basic "nginxStatus";
            auth_basic_user_file conf/htpasswd;
            #htpasswd 文件的内容可以用 apache 提供的 htpasswd 工具来产生。
        }

        #本地动静分离反向代理配置
        #所有 jsp 的页面均交由 tomcat 或 resin 处理
        location ~ .(jsp|jspx|do)?$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8080;
        }

        #所有静态文件由 nginx 直接读取不经过 tomcat 或 resin
        location ~ .*.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|pdf|xls|mp3|wma)$
        { expires 15d; }

        location ~ .*.(js|css)?$
        { expires 1h; }
    }
}
```

## 基本规则

### 管理 Nginx 配置

> 随着 Nginx 配置的增长，您有必要组织、管理配置内容。
>
> 当您的 Nginx 配置增加时，组织配置的需求也会增加。 井井有条的代码是：
>
> - 易于理解
> - 易于维护
> - 易于使用

> 使用 `include` 指令可将常用服务器配置移动到单独的文件中，并将特定代码附加到全局配置，上下文等中。

> 我总是尝试在配置树的根目录中保留多个目录。 这些目录存储所有附加到主文件的配置文件。 我更喜欢以下结构：
>
> - `html` - 用于默认静态文件，例如 全局 5xx 错误页面
> - `master` - 用于主要配置，例如 ACL，侦听指令和域
>   - `_acls` - 用于访问控制列表，例如 地理或地图模块
>   - `_basic` - 用于速率限制规则，重定向映射或代理参数
>   - `_listen` - 用于所有侦听指令； 还存储 SSL 配置
>   - `_server` - 用于域（localhost）配置； 还存储所有后端定义
> - `modules` - 用于动态加载到 Nginx 中的模块
> - `snippets` - 用于 Nginx 别名，配置模板
>
> 如果有必要，我会将其中一些附加到具有 `server` 指令的文件中。

示例：

```nginx
## Store this configuration in https.conf for example:
listen 10.240.20.2:443 ssl;

ssl_certificate /etc/nginx/master/_server/example.com/certs/nginx_example.com_bundle.crt;
ssl_certificate_key /etc/nginx/master/_server/example.com/certs/example.com.key;

## Include this file to the server section:
server {

  include /etc/nginx/master/_listen/10.240.20.2/https.conf;

  ## And other:
  include /etc/nginx/master/_static/errors.conf;
  include /etc/nginx/master/_server/_helpers/global.conf;

  ...

  server_name domain.com www.domain.com;

  ...
```

### 重加载 Nginx 配置

示例：

```bash
## 1)
systemctl reload nginx

## 2)
service nginx reload

## 3)
/etc/init.d/nginx reload

## 4)
/usr/sbin/nginx -s reload

## 5)
kill -HUP $(cat /var/run/nginx.pid)
## or
kill -HUP $(pgrep -f "nginx: master")

## 6)
/usr/sbin/nginx -g 'daemon on; master_process on;' -s reload
```

### 监听 80 和 443 端口

> 如果您使用完全相同的配置为 HTTP 和 HTTPS 提供服务（单个服务器同时处理 HTTP 和 HTTPS 请求），Nginx 足够智能，可以忽略通过端口 80 加载的 SSL 指令。
>
> Nginx 的最佳实践是使用单独的服务器进行这样的重定向（不与您的主要配置的服务器共享），对所有内容进行硬编码，并且完全不使用正则表达式。
>
> 我不喜欢复制规则，但是单独的监听指令无疑可以帮助您维护和修改配置。
>
> 如果将多个域固定到一个 IP 地址，则很有用。 这使您可以将一个侦听指令（例如，如果将其保留在配置文件中）附加到多个域配置。
>
> 如果您使用的是 HTTPS，则可能还需要对域进行硬编码，因为您必须预先知道要提供的证书。

示例：

```nginx
## For HTTP:
server {

  listen 10.240.20.2:80;

  ...

}

## For HTTPS:
server {

  listen 10.240.20.2:443 ssl;

  ...

}
```

### 显示指定监听的地址和端口

Nginx 的 listen 指令用于监听指定的 IP 地址和端口号，配置形式为：`listen <address>:<port>`。若 IP 地址或端口缺失，Nginx 会以默认值来替换。

而且，仅当需要区分与 listen 指令中的同一级别匹配的服务器块时，才会评估 server_name 指令。

示例：

```nginx
server {

  ## This block will be processed:
  listen 192.168.252.10;  ## --> 192.168.252.10:80

  ...

}

server {

  listen 80;  ## --> *:80 --> 0.0.0.0:80
  server_name api.random.com;

  ...

}
```

### 防止使用未定义的服务器名称处理请求

> Nginx 应该阻止使用未定义的服务器名称（也使用 IP 地址）处理请求。它可以防止配置错误，例如流量转发到不正确的后端。通过创建默认虚拟虚拟主机可以轻松解决该问题，该虚拟虚拟主机可以捕获带有无法识别的主机标头的所有请求。
>
> 如果没有一个 listen 指令具有 default_server 参数，则具有 address：port 对的第一台服务器将是该对的默认服务器（这意味着 Nginx 始终具有默认服务器）。
>
> 如果有人使用 IP 地址而不是服务器名称发出请求，则主机请求标头字段将包含 IP 地址，并且可以使用 IP 地址作为服务器名称来处理请求。
>
> 在现代版本的 Nginx 中，不需要服务器名称\_。如果找不到具有匹配的 listen 和 server_name 的服务器，Nginx 将使用默认服务器。如果您的配置分散在多个文件中，则评估顺序将不明确，因此您需要显式标记默认服务器。
>
> Nginx 使用 Host 标头进行 server_name 匹配。它不使用 TLS SNI。这意味着对于 SSL 服务器，Nginx 必须能够接受 SSL 连接，这归结为具有证书/密钥。证书/密钥可以是任意值，例如自签名。

示例：

```nginx
## Place it at the beginning of the configuration file to prevent mistakes:
server {

  ## For ssl option remember about SSL parameters (private key, certs, cipher suites, etc.);
  ## add default_server to your listen directive in the server that you want to act as the default:
  listen 10.240.20.2:443 default_server ssl;

  ## We catch:
  ##   - invalid domain names
  ##   - requests without the "Host" header
  ##   - and all others (also due to the above setting)
  ##   - default_server in server_name directive is not required - I add this for a better understanding and I think it's an unwritten standard
  ## ...but you should know that it's irrelevant, really, you can put in everything there.
  server_name _ "" default_server;

  ...

  return 444;

  ## We can also serve:
  ## location / {

    ## static file (error page):
    ##   root /etc/nginx/error-pages/404;
    ## or redirect:
    ##   return 301 https://badssl.com;

    ## return 444;

  ## }

}

server {

  listen 10.240.20.2:443 ssl;

  server_name domain.com;

  ...

}

server {

  listen 10.240.20.2:443 ssl;

  server_name domain.org;

  ...

}
```

### 不要在 listen 或 upstream 中使用 hostname

> 通常，在 listen 或上游指令中使用主机名是一种不好的做法。
>
> 在最坏的情况下，Nginx 将无法绑定到所需的 TCP 套接字，这将完全阻止 Nginx 启动。
>
> 最好和更安全的方法是知道需要绑定的 IP 地址，并使用该地址代替主机名。 这也可以防止 Nginx 查找地址并消除对外部和内部解析器的依赖。
>
> 在 server_name 指令中使用\$ hostname（计算机的主机名）变量也是不当行为的示例（类似于使用主机名标签）。
>
> 我认为也有必要设置 IP 地址和端口号对，以防止可能难以调试的软错误。

示例：

❌ 错误配置

```nginx
upstream {

  server http://x-9s-web01-prod:8080;

}

server {

  listen rev-proxy-prod:80;

  ...

}
```

⭕ 正确配置

```nginx
upstream {

  server http://192.168.252.200:8080;

}

server {

  listen 10.10.100.20:80;

  ...

}
```

### 指令中只配置一个 SSL

> 此规则使调试和维护更加容易。
>
> 请记住，无论 SSL 参数如何，您都可以在同一监听指令（IP 地址）上使用多个 SSL 证书。
>
> 我认为要在多个 HTTPS 服务器之间共享一个 IP 地址，您应该使用一个 SSL 配置（例如协议，密码，曲线）。这是为了防止错误和配置不匹配。
>
> 还请记住有关默认服务器的配置。这很重要，因为如果所有 listen 指令都没有 default_server 参数，则配置中的第一台服务器将是默认服务器。因此，您应该只使用一个 SSL 设置，并且在同一 IP 地址上使用多个名称。
>
> 从 Nginx 文档中：
>
> 这是由 SSL 协议行为引起的。在浏览器发送 HTTP 请求之前，已建立 SSL 连接，nginx 不知道所请求服务器的名称。因此，它可能仅提供默认服务器的证书。
>
> 还要看看这个：
>
> TLS 服务器名称指示扩展名（SNI，RFC 6066）是在单个 IP 地址上运行多个 HTTPS 服务器的更通用的解决方案，它允许浏览器在 SSL 握手期间传递请求的服务器名称，因此，服务器将知道哪个用于连接的证书。
>
> 另一个好主意是将常用服务器设置移到单独的文件（即 common / example.com.conf）中，然后将其包含在单独的服务器块中。

示例：

```nginx
## Store this configuration in e.g. https.conf:
listen 192.168.252.10:443 default_server ssl http2;

ssl_protocols TLSv1.2;
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384";

ssl_prefer_server_ciphers on;

ssl_ecdh_curve secp521r1:secp384r1;

...

## Include this file to the server context (attach domain-a.com for specific listen directive):
server {

  include             /etc/nginx/https.conf;

  server_name         domain-a.com;

  ssl_certificate     domain-a.com.crt;
  ssl_certificate_key domain-a.com.key;

  ...

}

## Include this file to the server context (attach domain-b.com for specific listen directive):
server {

  include             /etc/nginx/https.conf;

  server_name         domain-b.com;

  ssl_certificate     domain-b.com.crt;
  ssl_certificate_key domain-b.com.key;

  ...

}
```

### 使用 geo/map 模块替代 allow/deny

> 使用地图或地理模块（其中之一）可以防止用户滥用您的服务器。这样就可以创建变量，其值取决于客户端 IP 地址。
>
> 由于仅在使用变量时才对其进行求值，因此甚至仅存在大量已声明的变量。地理位置变量不会为请求处理带来任何额外费用。
>
> 这些指令提供了阻止无效访问者的完美方法，例如使用 ngx_http_geoip_module。例如，geo 模块非常适合有条件地允许或拒绝 IP。
>
> geo 模块（注意：不要将此模块误认为是 GeoIP）在加载配置时会构建内存基数树。这与路由中使用的数据结构相同，并且查找速度非常快。如果每个网络有许多唯一值，那么较长的加载时间是由在数组中搜索数据重复项引起的。否则，可能是由于插入基数树引起的。
>
> 我将两个模块都用于大型列表。您应该考虑一下，因为此规则要求使用多个 if 条件。我认为，对于简单的列表，毕竟允许/拒绝指令是更好的解决方案。看下面的例子：

```nginx
## Allow/deny:
location /internal {

  include acls/internal.conf;
  allow   192.168.240.0/24;
  deny    all;

  ...

## vs geo/map:
location /internal {

  if ($globals_internal_map_acl) {
    set $pass 1;
  }

  if ($pass = 1) {
    proxy_pass http://localhost:80;
  }

  if ($pass != 1) {
    return 403;
  }

  ...

}
```

示例：

```nginx
## Map module:
map $remote_addr $globals_internal_map_acl {

  ## Status code:
  ##  - 0 = false
  ##  - 1 = true
  default 0;

  ### INTERNAL ###
  10.255.10.0/24 1;
  10.255.20.0/24 1;
  10.255.30.0/24 1;
  192.168.0.0/16 1;

}

## Geo module:
geo $globals_internal_geo_acl {

  ## Status code:
  ##  - 0 = false
  ##  - 1 = true
  default 0;

  ### INTERNAL ###
  10.255.10.0/24 1;
  10.255.20.0/24 1;
  10.255.30.0/24 1;
  192.168.0.0/16 1;

}
```

### Map 所有事物

> 使用地图管理大量重定向，并使用它们来自定义键/值对。
>
> map 指令可映射字符串，因此可以表示例如 192.168.144.0/24 作为正则表达式，并继续使用 map 指令。
>
> Map 模块提供了一种更优雅的解决方案，用于清晰地解析大量正则表达式，例如 用户代理，引荐来源。
>
> 您还可以对地图使用 include 指令，这样配置文件看起来会很漂亮。

示例：

```nginx
map $http_user_agent $device_redirect {

  default "desktop";

  ~(?i)ip(hone|od) "mobile";
  ~(?i)android.*(mobile|mini) "mobile";
  ~Mobile.+Firefox "mobile";
  ~^HTC "mobile";
  ~Fennec "mobile";
  ~IEMobile "mobile";
  ~BB10 "mobile";
  ~SymbianOS.*AppleWebKit "mobile";
  ~Opera\sMobi "mobile";

}

## Turn on in a specific context (e.g. location):
if ($device_redirect = "mobile") {

  return 301 https://m.domain.com$request_uri;

}
```

### 为所有未匹配的路径设置根路径

> 为请求设置服务器指令内部的全局根路径。 它为未定义的位置指定根路径。
>
> 根据官方文档：
>
> 如果您在每个位置块中添加一个根路径，则不匹配的位置块将没有根路径。因此，重要的是，根指令必须在您的位置块之前发生，然后根目录指令可以在需要时覆盖该指令。

示例：

```nginx
server {

  server_name domain.com;

  root /var/www/domain.com/public;

  location / {

    ...

  }

  location /api {

    ...

  }

  location /static {

    root /var/www/domain.com/static;

    ...

  }

}
```

### 使用 return 指令进行 URL 重定向（301、302）

> 这是一个简单的规则。 您应该使用服务器块和 return 语句，因为它们比评估 RegEx 更快。
>
> 因为 Nginx 停止处理请求（而不必处理正则表达式），所以它更加简单快捷。

示例

```nginx
server {

  server_name www.example.com;

  ## return    301 https://$host$request_uri;
  return      301 $scheme://www.example.com$request_uri;

}
```

### 配置日志轮换策略

> 日志文件为您提供有关服务器活动和性能以及可能出现的任何问题的反馈。 它们记录了有关请求和 Nginx 内部的详细信息。 不幸的是，日志使用了更多的磁盘空间。
>
> 您应该定义一个过程，该过程将定期存档当前日志文件并启动一个新日志文件，重命名并有选择地压缩当前日志文件，删除旧日志文件，并强制日志记录系统开始使用新日志文件。
>
> 我认为最好的工具是 logrotate。 如果我想自动管理日志，也想睡个好觉，那么我会在任何地方使用它。 这是一个旋转日志的简单程序，使用 crontab 可以工作。 它是计划的工作，而不是守护程序，因此无需重新加载其配置。

示例：

- 手动旋转

  ```bash
  ## Check manually (all log files):
  logrotate -dv /etc/logrotate.conf

  ## Check manually with force rotation (specific log file):
  logrotate -dv --force /etc/logrotate.d/nginx
  ```

- 自动旋转

  ```bash
  cat > /etc/logrotate.d/nginx << __EOF__
  /var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
    sharedscripts
    prerotate
      if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
        run-parts /etc/logrotate.d/httpd-prerotate; \
      fi \
    endscript
    postrotate
      ## test ! -f /var/run/nginx.pid || kill -USR1 `cat /var/run/nginx.pid`
      invoke-rc.d nginx reload >/dev/null 2>&1
    endscript
  }

  /var/log/nginx/localhost/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
    sharedscripts
    prerotate
      if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
        run-parts /etc/logrotate.d/httpd-prerotate; \
      fi \
    endscript
    postrotate
      ## test ! -f /var/run/nginx.pid || kill -USR1 `cat /var/run/nginx.pid`
      invoke-rc.d nginx reload >/dev/null 2>&1
    endscript
  }

  /var/log/nginx/domains/example.com/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
    sharedscripts
    prerotate
      if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
        run-parts /etc/logrotate.d/httpd-prerotate; \
      fi \
    endscript
    postrotate
      ## test ! -f /var/run/nginx.pid || kill -USR1 `cat /var/run/nginx.pid`
      invoke-rc.d nginx reload >/dev/null 2>&1
    endscript
  }
  __EOF__
  ```

### 不要重复索引指令，只能在 http 块中使用

> 一次使用 index 指令。 它只需要在您的 http 上下文中发生，并将在下面继承。
>
> 我认为我们在复制相同规则时应格外小心。 但是，当然，规则的重复有时是可以的，或者不一定是大麻烦。

示例：

❌ 错误配置

```nginx
http {

  ...

  index index.php index.htm index.html;

  server {

    server_name www.example.com;

    location / {

      index index.php index.html index.$geo.html;

      ...

    }

  }

  server {

    server_name www.example.com;

    location / {

      index index.php index.htm index.html;

      ...

    }

    location /data {

      index index.php;

      ...

    }

    ...

}
```

⭕ 正确配置

```nginx
http {

  ...

  index index.php index.htm index.html index.$geo.html;

  server {

    server_name www.example.com;

    location / {

      ...

    }

  }

  server {

    server_name www.example.com;

    location / {

      ...

    }

    location /data {

      ...

    }

    ...

}
```

## Debugging

### 使用自定义日志格式

> 您可以在 Nginx 配置中作为变量访问的任何内容都可以记录，包括非标准的 HTTP 标头等。因此，这是一种针对特定情况创建自己的日志格式的简单方法。
>
> 这对于调试特定的 `location` 指令非常有帮助。

示例：

```nginx
## Default main log format from the Nginx repository:
log_format main
                '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';

## Extended main log format:
log_format main-level-0
                '$remote_addr - $remote_user [$time_local] '
                '"$request_method $scheme://$host$request_uri '
                '$server_protocol" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent" '
                '$request_time';

## Debug log formats:
log_format debug-level-0
                '$remote_addr - $remote_user [$time_local] '
                '"$request_method $scheme://$host$request_uri '
                '$server_protocol" $status $body_bytes_sent '
                '$request_id $pid $msec $request_time '
                '$upstream_connect_time $upstream_header_time '
                '$upstream_response_time "$request_filename" '
                '$request_completion';
```

### 使用调试模式来跟踪意外行为

> 通常，`error_log` 指令是在 `main` 中指定的，但是也可以在 `server` 或 `location` 块中指定，全局设置将被覆盖，并且这个 `error_log` 指令将设置其自己的日志文件路径和日志记录级别。
>
> 如果要记录 `ngx_http_rewrite_module` (at the notice level) ，应该在 `http`、`server` 或 `location` 块中开启 `rewrite_log on;`。
>
> 注意：
>
> - 永远不要将调试日志记录留在生产环境中的文件上
> - 不要忘记在流量非常高的站点上恢复 `error_log` 的调试级别
> - 必须使用日志回滚政策

示例：

- 将 debug 信息写入文件

```nginx
## Turn on in a specific context, e.g.:
##   - global    - for global logging
##   - http      - for http and all locations logging
##   - location  - for specific location
error_log /var/log/nginx/error-debug.log debug;
```

- 将 debug 信息写入内存

```nginx
error_log memory:32m debug;
```

- IP 地址/范围的调试日志：

```nginx
events {

  debug_connection    192.168.252.15/32;
  debug_connection    10.10.10.0/24;

}
```

- 为不同服务器设置不同 Debug 配置

```nginx
error_log /var/log/nginx/debug.log debug;

...

http {

  server {

    ## To enable debugging:
    error_log /var/log/nginx/domain.com/domain.com-debug.log debug;
    ## To disable debugging:
    error_log /var/log/nginx/domain.com/domain.com-debug.log;

    ...

  }

}
```

### 核心转储

> 核心转储基本上是程序崩溃时内存的快照。
>
> Nginx 是一个非常稳定的守护程序，但是有时可能会发生正在运行的 Nginx 进程独特终止的情况。
>
> 如果要保存内存转储，它可以确保应启用两个重要的指令，但是，为了正确处理内存转储，需要做一些事情。 有关它的完整信息，请参见转储进程的内存（来自本手册）。
>
> 当您的 Nginx 实例收到意外错误或崩溃时，应始终启用核心转储。

示例：

```nginx
worker_rlimit_core    500m;
worker_rlimit_nofile  65535;
working_directory     /var/dump/nginx;
```

## 性能

### 工作进程数

> `worker_processes` - 用于设置 Nginx 的工作进程数。

- worker_processes 的默认值为 1。
- 设置 worker_processes 的安全做法是将其设为 auto，则启动 Nginx 时会自动分配工作进程数。当然，也可以显示的设置一个工作进程数值。
- 一般一个进程足够了，你可以把连接数设得很大。（worker_processes: 1，worker_connections: 10,000）如果有 SSL、gzip 这些比较消耗 CPU 的工作，而且是多核 CPU 的话，可以设为和 CPU 的数量一样。或者要处理很多很多的小文件，而且文件总大小比内存大很多的时候，也可以把进程数增加，以充分利用 IO 带宽（主要似乎是 IO 操作有 block）

示例：

```nginx
## The safest way:
worker_processes auto;

## VCPU = 4 , expr $(nproc --all) - 1
worker_processes 3;
```

### 最大连接数

> `worker_connections` - 单个 Nginx 工作进程允许同时建立的外部连接的数量。数字越大，能同时处理的连接越多。

`worker_connections` 不是随便设置的，而是与两个指标有重要关联：

- 内存
  - 每个连接数分别对应一个 read_event、一个 write_event 事件，一个连接数大概占用 232 字节，2 个事件总占用 96 字节，那么一个连接总共占用 328 字节，通过数学公式可以算出 100000 个连接数大概会占用 31M = 100000 \* 328 / 1024 / 1024，当然这只是 nginx 启动时，worker_connections 连接数所占用的 nginx。
- 操作系统级别”进程最大可打开文件数“。
  - 进程最大可打开文件数受限于操作系统，可通过 `ulimit -n` 命令查询，以前是 1024，现在是 65535。
  - nginx 提供了 worker_rlimit_nofile 指令，这是除了 ulimit 的一种设置可用的描述符的方式。 该指令与使用 ulimit 对用户的设置是同样的效果。此指令的值将覆盖 ulimit 的值，如：worker_rlimit_nofile 20960; 设置 ulimits：ulimit -SHn 65535

### 使用 HTTP/2

> HTTP / 2 将使我们的应用程序更快，更简单且更可靠。 HTTP / 2 的主要目标是通过启用完整的请求和响应多路复用来减少延迟，通过有效压缩 HTTP 标头字段来最小化协议开销，并增加对请求优先级和服务器推送的支持。
>
> HTTP / 2 与 HTTP / 1.1 向后兼容，因此有可能完全忽略它，并且一切都会像以前一样继续工作，因为如果不支持 HTTP / 2 的客户端永远不会向服务器请求 HTTP / 2 通讯升级：它们之间的通讯将完全是 HTTP1 / 1。
>
> 请注意，HTTP / 2 在单个 TCP 连接中多路复用许多请求。 通常，当使用 HTTP / 2 时，将与服务器建立单个 TCP 连接。
>
> 您还应该包括 ssl 参数，这是必需的，因为浏览器不支持未经加密的 HTTP / 2。
>
> HTTP / 2 对旧的和不安全的密码有一个非常大的黑名单，因此您应该避免使用它们。

示例：

```nginx
server {

  listen 10.240.20.2:443 ssl http2;

  ...
```

### 维护 SSL 会话

> 客户端每次发出请求时都进行新的 SSL 握手的需求。默认情况下，内置会话缓存并不是最佳选择，因为它只能由一个工作进程使用，并且可能导致内存碎片，最好使用共享缓存。
>
> 使用 `ssl_session_cache` 时，通过 SSL 保持连接的性能可能会大大提高。10M 的值是一个很好的起点（1MB 共享缓存可以容纳大约 4,000 个会话）。通过共享，所有工作进程之间共享一个缓存（可以在多个虚拟服务器中使用相同名称的缓存）。
>
> 但是，大多数服务器不清除会话或票证密钥，因此增加了服务器受到损害将泄漏先前（和将来）连接中的数据的风险。

示例：

```nginx
ssl_session_cache   shared:NGX_SSL_CACHE:10m;
ssl_session_timeout 12h;
ssl_session_tickets off;
ssl_buffer_size     1400;
```

#### 尽可能在 server_name 指令中使用确切名称

> 确切名称，以星号开头的通配符名称和以星号结尾的通配符名称存储在绑定到侦听端口的三个哈希表中。
>
> 首先搜索确切名称哈希表。 如果未找到名称，则搜索具有以星号开头的通配符名称的哈希表。 如果未在此处找到名称，则搜索带有通配符名称以星号结尾的哈希表。 搜索通配符名称哈希表比搜索精确名称哈希表要慢，因为名称是按域部分搜索的。
>
> 正则表达式是按顺序测试的，因此是最慢的方法，并且不可缩放。由于这些原因，最好在可能的地方使用确切的名称。

示例：

```nginx
## It is more efficient to define them explicitly:
server {

    listen       192.168.252.10:80;

    server_name  example.org  www.example.org  *.example.org;

    ...

}

## Than to use the simplified form:
server {

    listen       192.168.252.10:80;

    server_name  .example.org;

    ...

}
```

### 避免使用 `if` 检查 `server_name`

> 当 Nginx 收到请求时，无论请求的是哪个子域，无论是 www.example.com 还是普通的 example.com，如果始终对 if 指令进行评估。 由于您是在请求 Nginx 检查每个请求的 Host 标头。 效率极低。
>
> 而是使用两个服务器指令，如下面的示例。 这种方法降低了 Nginx 的处理要求。

示例：

❌ 错误配置

```nginx
server {

  server_name                 domain.com www.domain.com;

  if ($host = www.domain.com) {

    return                    301 https://domain.com$request_uri;

  }

  server_name                 domain.com;

  ...

}
```

⭕ 正确配置

```nginx
server {

    server_name               www.domain.com;

    return                    301 $scheme://domain.com$request_uri;

    ## If you force your web traffic to use HTTPS:
    ##                         301 https://domain.com$request_uri;

    ...

}

server {

    listen                    192.168.252.10:80;

    server_name               domain.com;

    ...

}
```

### 使用 `$request_uri` 来避免使用正则表达式

> 使用内置变量 `$request_uri`，我们可以完全避免进行任何捕获或匹配。默认情况下，正则表达式的代价较高，并且会降低性能。
>
> 此规则用于解决将 URL 不变地传递到新主机，确保仅通过现有 URI 进行返回的效率更高。

示例：

❌ 错误配置

```nginx
## 1)
rewrite ^/(.*)$ https://example.com/$1 permanent;

## 2)
rewrite ^ https://example.com$request_uri? permanent;
```

⭕ 正确配置

```nginx
return 301 https://example.com$request_uri;
```

### 使用 `try_files` 指令确认文件是否存在

> `try_files` is definitely a very useful thing. You can use `try_files` directive to check a file exists in a specified order.

> You should use `try_files` instead of `if` directive. It's definitely better way than using `if` for this action because `if` directive is extremely inefficient since it is evaluated every time for every request.

> The advantage of using `try_files` is that the behavior switches immediately with one command. I think the code is more readable also.

> `try_files` allows you:
>
> - to check if the file exists from a predefined list
> - to check if the file exists from a specified directory
> - to use an internal redirect if none of the files are found

示例：

❌ 错误配置

```nginx

  ...

  root /var/www/example.com;

  location /images {

    if (-f $request_filename) {

      expires 30d;
      break;

    }

  ...

}
```

⭕ 正确配置

```nginx

  ...

  root /var/www/example.com;

  location /images {

    try_files $uri =404;

  ...

}
```

### 使用 return 代替 rewrite 来做重定向

> 您应该使用服务器块和 return 语句，因为它们比通过位置块评估 RegEx 更简单，更快捷。 该指令停止处理，并将指定的代码返回给客户端。

示例：

❌ 错误配置

```nginx
server {

  ...

  if ($host = api.domain.com) {

    rewrite     ^/(.*)$ http://example.com/$1 permanent;

  }

  ...
```

⭕ 正确配置

```nginx
server {

  ...

  if ($host = api.domain.com) {

    return      403;

    ## or other examples:
    ##   return    301 https://domain.com$request_uri;
    ##   return    301 $scheme://$host$request_uri;

  }

  ...
```

### 开启 PCRE JIT 来加速正则表达式处理

> 允许使用 JIT 的正则表达式来加速他们的处理。
>
> 通过与 PCRE 库编译 Nginx 的，你可以用你的 location 块进行复杂的操作和使用功能强大的 return 和 rewrite。
>
> PCRE JIT 可以显著加快正则表达式的处理。 Nginx 的与 pcre_jit 比没有更快的幅度。
>
> 如果你试图在使用 pcre_jit;没有可用的 JIT，或者 Nginx 的与现有 JIT，但当前加载 PCRE 库编译不支持 JIT，将配置解析时发出警告。
>
> 当您编译使用 NGNIX 配置 PCRE 库时，才需要--with-PCRE-JIT 时（./configure --with-PCRE =）。当使用系统 PCRE 库 JIT 是否被支持依赖于库是如何被编译。
>
> 从 Nginx 的文档：
>
> JIT 正在从与--enable-JIT 配置参数内置 8.20 版本开始 PCRE 库提供。当 PCRE 库与 nginx 的内置（--with-PCRE =）时，JIT 支持经由--with-PCRE-JIT 配置参数使能。

示例：

```nginx
## In global context:
pcre_jit on;
```

#### 进行精确的位置匹配以加快选择过程

> 精确的位置匹配通常用于通过立即结束算法的执行来加快选择过程。

示例：

```nginx
## Matches the query / only and stops searching:
location = / {

  ...

}

## Matches the query /v9 only and stops searching:
location = /v9 {

  ...

}

...

## Matches any query due to the fact that all queries begin at /,
## but regular expressions and any longer conventional blocks will be matched at first place:
location / {

  ...

}
```

#### 使用 `limit_conn` 改善对下载速度的限制

> Nginx provides two directives to limiting download speed:
>
> Nginx 提供了两个指令来限制下载速度：
>
> - `limit_rate_after` - 设置 limit_rate 指令生效之前传输的数据量
> - `limit_rate` - 允许您限制单个客户端连接的传输速率

> 此解决方案限制了每个连接的 Nginx 下载速度，因此，如果一个用户打开多个（例如） 视频文件，则可以下载 `X * 连接到视频文件的次数` 。

示例：

```nginx
## Create limit connection zone:
limit_conn_zone $binary_remote_addr zone=conn_for_remote_addr:1m;

## Add rules to limiting the download speed:
limit_rate_after 1m;  ## run at maximum speed for the first 1 megabyte
limit_rate 250k;      ## and set rate limit after 1 megabyte

## Enable queue:
location /videos {

  ## Max amount of data by one client: 10 megabytes (limit_rate_after * 10)
  limit_conn conn_for_remote_addr 10;

  ...
```

## Hardening

- **[⬆ Hardening](https://github.com/trimstray/nginx-admins-handbook#toc-hardening-2)**
  - [Always keep Nginx up-to-date](#beginner-always-keep-nginx-up-to-date)
  - [Run as an unprivileged user](#beginner-run-as-an-unprivileged-user)
  - [Disable unnecessary modules](#beginner-disable-unnecessary-modules)
  - [Protect sensitive resources](#beginner-protect-sensitive-resources)
  - [Hide Nginx version number](#beginner-hide-nginx-version-number)
  - [Hide Nginx server signature](#beginner-hide-nginx-server-signature)
  - [Hide upstream proxy headers](#beginner-hide-upstream-proxy-headers)
  - [Force all connections over TLS](#beginner-force-all-connections-over-tls)
  - [Use only the latest supported OpenSSL version](#beginner-use-only-the-latest-supported-openssl-version)
  - [Use min. 2048-bit private keys](#beginner-use-min-2048-bit-private-keys)
  - [Keep only TLS 1.3 and TLS 1.2](#beginner-keep-only-tls-13-and-tls-12)
  - [Use only strong ciphers](#beginner-use-only-strong-ciphers)
  - [Use more secure ECDH Curve](#beginner-use-more-secure-ecdh-curve)
  - [Use strong Key Exchange with Perfect Forward Secrecy](#beginner-use-strong-key-exchange-with-perfect-forward-secrecy)
  - [Prevent Replay Attacks on Zero Round-Trip Time](#beginner-prevent-replay-attacks-on-zero-round-trip-time)
  - [Defend against the BEAST attack](#beginner-defend-against-the-beast-attack)
  - [Mitigation of CRIME/BREACH attacks](#beginner-mitigation-of-crimebreach-attacks)
  - [HTTP Strict Transport Security](#beginner-http-strict-transport-security)
  - [Reduce XSS risks (Content-Security-Policy)](#beginner-reduce-xss-risks-content-security-policy)
  - [Control the behaviour of the Referer header (Referrer-Policy)](#beginner-control-the-behaviour-of-the-referer-header-referrer-policy)
  - [Provide clickjacking protection (X-Frame-Options)](#beginner-provide-clickjacking-protection-x-frame-options)
  - [Prevent some categories of XSS attacks (X-XSS-Protection)](#beginner-prevent-some-categories-of-xss-attacks-x-xss-protection)
  - [Prevent Sniff Mimetype middleware (X-Content-Type-Options)](#beginner-prevent-sniff-mimetype-middleware-x-content-type-options)
  - [Deny the use of browser features (Feature-Policy)](#beginner-deny-the-use-of-browser-features-feature-policy)
  - [Reject unsafe HTTP methods](#beginner-reject-unsafe-http-methods)
  - [Prevent caching of sensitive data](#beginner-prevent-caching-of-sensitive-data)
  - [Control Buffer Overflow attacks](#beginner-control-buffer-overflow-attacks)
  - [Mitigating Slow HTTP DoS attacks (Closing Slow Connections)](#beginner-mitigating-slow-http-dos-attacks-closing-slow-connections)

In this chapter I will talk about some of the Nginx hardening approaches and security standards.

### :beginner: Always keep Nginx up-to-date

#### Rationale

> Nginx is a very secure and stable but vulnerabilities in the main binary itself do pop up from time to time. It's the main reason for keep Nginx up-to-date as hard as you can.

> A very safe way to plan the update is once a new stable version is released but for me the most common way to handle Nginx updates is to wait a few weeks after the stable release.

> Before update/upgrade Nginx remember about do it on the testing environment.

> Most modern GNU/Linux distros will not push the latest version of Nginx into their default package lists so maybe you should consider install it from sources.

#### External resources

- [Installing from prebuilt packages (from this handbook)](HELPERS.md#installing-from-prebuilt-packages)
- [Installing from source (from this handbook)](HELPERS.md#installing-from-source)

### :beginner: Run as an unprivileged user

#### Rationale

> There is no real difference in security just by changing the process owner name. On the other hand in security, the principle of least privilege states that an entity should be given no more permission than necessary to accomplish its goals within a given system. This way only master process runs as root.

> This is the default Nginx behaviour, but remember to check it.

#### Example

```bash
## Edit nginx.conf:
user nginx;

## Set owner and group for root (app, default) directory:
chown -R nginx:nginx /var/www/domain.com
```

#### External resources

- [Why does nginx starts process as root?](https://unix.stackexchange.com/questions/134301/why-does-nginx-starts-process-as-root)

### :beginner: Disable unnecessary modules

#### Rationale

> It is recommended to disable any modules which are not required as this will minimise the risk of any potential attacks by limiting the operations allowed by the web server.

> The best way to unload unused modules is use the `configure` option during installation. If you have static linking a shared module you should re-compile Nginx.

> Use only high quality modules and remember about that:
>
> _Unfortunately, many third‑party modules use blocking calls, and users (and sometimes even the developers of the modules) aren’t aware of the drawbacks. Blocking operations can ruin Nginx performance and must be avoided at all costs._

#### Example

```nginx
## 1) During installation:
./configure --without-http_autoindex_module

## 2) Comment modules in the configuration file e.g. modules.conf:
## load_module                 /usr/share/nginx/modules/ndk_http_module.so;
## load_module                 /usr/share/nginx/modules/ngx_http_auth_pam_module.so;
## load_module                 /usr/share/nginx/modules/ngx_http_cache_purge_module.so;
## load_module                 /usr/share/nginx/modules/ngx_http_dav_ext_module.so;
load_module                   /usr/share/nginx/modules/ngx_http_echo_module.so;
## load_module                 /usr/share/nginx/modules/ngx_http_fancyindex_module.so;
load_module                   /usr/share/nginx/modules/ngx_http_geoip_module.so;
load_module                   /usr/share/nginx/modules/ngx_http_headers_more_filter_module.so;
## load_module                 /usr/share/nginx/modules/ngx_http_image_filter_module.so;
## load_module                 /usr/share/nginx/modules/ngx_http_lua_module.so;
load_module                   /usr/share/nginx/modules/ngx_http_perl_module.so;
## load_module                 /usr/share/nginx/modules/ngx_mail_module.so;
## load_module                 /usr/share/nginx/modules/ngx_nchan_module.so;
## load_module                 /usr/share/nginx/modules/ngx_stream_module.so;
```

#### External resources

- [nginx-modules](https://github.com/nginx-modules)

### :beginner: Protect sensitive resources

#### Rationale

> Hidden directories and files should never be web accessible - sometimes critical data are published during application deploy. If you use control version system you should defninitely drop the access to the critical hidden directories like a `.git` or `.svn` to prevent expose source code of your application.

> Sensitive resources contains items that abusers can use to fully recreate the source code used by the site and look for bugs, vulnerabilities, and exposed passwords.

#### Example

```nginx
if ($request_uri ~ "/\.git") {

  return 403;

}

## or
location ~ /\.git {

  deny all;

}

## or
location ~* ^.*(\.(?:git|svn|htaccess))$ {

  return 403;

}

## or all . directories/files excepted .well-known
location ~ /\.(?!well-known\/) {

  deny all;

}
```

#### External resources

- [Hidden directories and files as a source of sensitive information about web application](https://github.com/bl4de/research/tree/master/hidden_directories_leaks)

### :beginner: Hide Nginx version number

#### Rationale

> Disclosing the version of Nginx running can be undesirable, particularly in environments sensitive to information disclosure.

But the "Official Apache Documentation (Apache Core Features)" (yep, it's not a joke...) say:

> _Setting ServerTokens to less than minimal is not recommended because it makes it more difficult to debug interoperational problems. Also note that disabling the Server: header does nothing at all to make your server more secure. The idea of "security through obscurity" is a myth and leads to a false sense of safety._

#### Example

```nginx
server_tokens off;
```

#### External resources

- [Remove Version from Server Header Banner in nginx](https://geekflare.com/remove-server-header-banner-nginx/)
- [Reduce or remove server headers](https://www.tunetheweb.com/security/http-security-headers/server-header/)

### :beginner: Hide Nginx server signature

#### Rationale

> One of the easiest first steps to undertake, is to prevent the web server from showing its used software via the server header. Certainly, there are several reasons why you would like to change the server header. It could be security, it could be redundant systems, load balancers etc.

> In my opinion there is no real reason or need to show this much information about your server. It is easy to look up particular vulnerabilities once you know the version number.

> You should compile Nginx from sources with `ngx_headers_more` to used `more_set_headers` directive or use a [nginx-remove-server-header.patch](https://gitlab.com/buik/nginx/blob/master/nginx-remove-server-header.patch).

#### Example

```nginx
more_set_headers "Server: Unknown";
```

#### External resources

- [Shhh... don’t let your response headers talk too loudly](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)
- [How to change (hide) the Nginx Server Signature?](https://stackoverflow.com/questions/24594971/how-to-changehide-the-nginx-server-signature)

### :beginner: Hide upstream proxy headers

#### Rationale

> Securing a server goes far beyond not showing what's running but I think less is more is better.

> When Nginx is used to proxy requests to an upstream server (such as a PHP-FPM instance), it can be beneficial to hide certain headers sent in the upstream response (e.g. the version of PHP running).

#### Example

```nginx
proxy_hide_header X-Powered-By;
proxy_hide_header X-AspNetMvc-Version;
proxy_hide_header X-AspNet-Version;
proxy_hide_header X-Drupal-Cache;
```

#### External resources

- [Remove insecure http headers](https://veggiespam.com/headers/)

### :beginner: Force all connections over TLS

#### Rationale

> TLS provides two main services. For one, it validates the identity of the server that the user is connecting to for the user. It also protects the transmission of sensitive information from the user to the server.

> In my opinion you should always use HTTPS instead of HTTP to protect your website, even if it doesn’t handle sensitive communications. The application can have many sensitive places that should be protected.

> Always put login page, registration forms, all subsequent authenticated pages, contact forms, and payment details forms in HTTPS to prevent injection and sniffing. Them must be accessed only over TLS to ensure your traffic is secure.

> If page is available over TLS, it must be composed completely of content which is transmitted over TLS. Requesting subresources using the insecure HTTP protocol weakens the security of the entire page and HTTPS protocol. Modern browsers should blocked or report all active mixed content delivered via HTTP on pages by default.

> Also remember to implement the [HTTP Strict Transport Security (HSTS)](#beginner-http-strict-transport-security).

> We have currently the first free and open CA - [Let's Encrypt](https://letsencrypt.org/) - so generating and implementing certificates has never been so easy. It was created to provide free and easy-to-use TLS and SSL certificates.

#### Example

- force all traffic to use TLS:

  ```nginx
  server {

    listen 10.240.20.2:80;

    server_name domain.com;

    return 301 https://$host$request_uri;

  }

  server {

    listen 10.240.20.2:443 ssl;

    server_name domain.com;

    ...

  }
  ```

- force e.g. login page to use TLS:

  ```nginx
  server {

    listen 10.240.20.2:80;

    server_name domain.com;

    ...

    location ^~ /login {

      return 301 https://domain.com$request_uri;

    }

  }
  ```

#### External resources

- [Should we force user to HTTPS on website?](https://security.stackexchange.com/questions/23646/should-we-force-user-to-https-on-website)
- [Force a user to HTTPS](https://security.stackexchange.com/questions/137542/force-a-user-to-https)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

### :beginner: Use only the latest supported OpenSSL version

#### Rationale

> Before start see [Release Strategy Policies](https://www.openssl.org/policies/releasestrat.html) and [Changelog](https://www.openssl.org/news/changelog.html) on the OpenSSL website.

> Criteria for choosing OpenSSL version can vary and it depends all on your use.

> The latest versions of the major OpenSSL library are (may be changed):
>
> - the next version of OpenSSL will be 3.0.0
> - version 1.1.1 will be supported until 2023-09-11 (LTS)
>   - last minor version: 1.1.1c (May 23, 2019)
> - version 1.1.0 will be supported until 2019-09-11
>   - last minor version: 1.1.0k (May 28, 2018)
> - version 1.0.2 will be supported until 2019-12-31 (LTS)
>   - last minor version: 1.0.2s (May 28, 2018)
> - any other versions are no longer supported

> In my opinion the only safe way is based on the up-to-date and still supported version of the OpenSSL. And what's more, I recommend to hang on to the latest versions (e.g. 1.1.1).

> If your system repositories do not have the newest OpenSSL, you can do the [compilation](https://github.com/trimstray/nginx-admins-handbook#installing-from-source) process (see OpenSSL sub-section).

#### External resources

- [OpenSSL Official Website](https://www.openssl.org/)
- [OpenSSL Official Blog](https://www.openssl.org/blog/)
- [OpenSSL Official Newslog](https://www.openssl.org/news/newslog.html)

### :beginner: Use min. 2048-bit private keys

#### Rationale

> Advisories recommend 2048 for now. Security experts are projecting that 2048 bits will be sufficient for commercial use until around the year 2030 (as per NIST).

> The latest version of FIPS-186 also say the U.S. Federal Government generate (and use) digital signatures with 1024, 2048, or 3072 bit key lengths.

> Generally there is no compelling reason to choose 4096 bit keys over 2048 provided you use sane expiration intervals.

> If you want to get **A+ with 100%s on SSL Lab** (for Key Exchange) you should definitely use 4096 bit private keys. That's the main reason why you should use them.

> Longer keys take more time to generate and require more CPU and power when used for encrypting and decrypting, also the SSL handshake at the start of each connection will be slower. It also has a small impact on the client side (e.g. browsers).

> You can test above on your server with `openssl speed rsa` but remember: in OpenSSL speed tests you see difference on block cipher speed, while in real life most cpu time is spent on asymmetric algorithms during ssl handshake. On the other hand, modern processors are capable of executing at least 1k of RSA 1024-bit signs per second on a single core, so this isn't usually an issue.

> Use of alternative solution: [ECC Certificate Signing Request (CSR)](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) - `ECDSA` certificates contain an `ECC` public key. `ECC` keys are better than `RSA & DSA` keys in that the `ECC` algorithm is harder to break.

The "SSL/TLS Deployment Best Practices" book say:

> _The cryptographic handshake, which is used to establish secure connections, is an operation whose cost is highly influenced by private key size. Using a key that is too short is insecure, but using a key that is too long will result in "too much" security and slow operation. For most web sites, using RSA keys stronger than 2048 bits and ECDSA keys stronger than 256 bits is a waste of CPU power and might impair user experience. Similarly, there is little benefit to increasing the strength of the ephemeral key exchange beyond 2048 bits for DHE and 256 bits for ECDHE._

Konstantin Ryabitsev (Reddit):

> _Generally speaking, if we ever find ourselves in a world where 2048-bit keys are no longer good enough, it won't be because of improvements in brute-force capabilities of current computers, but because RSA will be made obsolete as a technology due to revolutionary computing advances. If that ever happens, 3072 or 4096 bits won't make much of a difference anyway. This is why anything above 2048 bits is generally regarded as a sort of feel-good hedging theatre._

**My recommendation:**

> Use 2048-bit key instead of 4096-bit at this moment.

#### Example

```bash
### Example (RSA):
( _fd="domain.com.key" ; _len="2048" ; openssl genrsa -out ${_fd} ${_len} )

## Let's Encrypt:
certbot certonly -d domain.com -d www.domain.com --rsa-key-size 2048

### Example (ECC):
## _curve: prime256v1, secp521r1, secp384r1
( _fd="domain.com.key" ; _fd_csr="domain.com.csr" ; _curve="prime256v1" ; \
openssl ecparam -out ${_fd} -name ${_curve} -genkey ; \
openssl req -new -key ${_fd} -out ${_fd_csr} -sha256 )

## Let's Encrypt (from above):
certbot --csr ${_fd_csr} -[other-args]
```

For `x25519`:

```bash
( _fd="private.key" ; _curve="x25519" ; \
openssl genpkey -algorithm ${_curve} -out ${_fd} )
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>100%</b>

```bash
( _fd="domain.com.key" ; _len="2048" ; openssl genrsa -out ${_fd} ${_len} )

## Let's Encrypt:
certbot certonly -d domain.com -d www.domain.com
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>90%</b>

#### External resources

- [Key Management Guidelines by NIST](https://csrc.nist.gov/Projects/Key-Management/Key-Management-Guidelines)
- [Recommendation for Transitioning the Use of Cryptographic Algorithms and Key Lengths](https://csrc.nist.gov/publications/detail/sp/800-131a/archive/2011-01-13)
- [FIPS PUB 186-4 - Digital Signature Standard (DSS)](http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf) <sup>[pdf]</sup>
- [Cryptographic Key Length Recommendations](https://www.keylength.com/)
- [So you're making an RSA key for an HTTPS certificate. What key size do you use?](https://certsimple.com/blog/measuring-ssl-rsa-keys)
- [RSA Key Sizes: 2048 or 4096 bits?](https://danielpocock.com/rsa-key-sizes-2048-or-4096-bits/)
- [Create a self-signed ECC certificate](https://msol.io/blog/tech/create-a-self-signed-ecc-certificate/)

### :beginner: Keep only TLS 1.3 and TLS 1.2

#### Rationale

> It is recommended to run TLS 1.2/1.3 and fully disable SSLv2, SSLv3, TLS 1.0 and TLS 1.1 that have protocol weaknesses and uses older cipher suites (do not provide any modern ciper modes).

> TLS 1.0 and TLS 1.1 must not be used (see [Deprecating TLSv1.0 and TLSv1.1](https://tools.ietf.org/id/draft-moriarty-tls-oldversions-diediedie-00.html)) and were superceded by TLS 1.2, which has now itself been superceded by TLS 1.3. They are also actively being deprecated in accordance with guidance from government agencies (e.g. NIST SP 80052r2) and industry consortia such as the Payment Card Industry Association (PCI) [PCI-TLS1].

> TLS 1.2 and TLS 1.3 are both without security issues. Only these versions provides modern cryptographic algorithms. TLS 1.3 is a new TLS version that will power a faster and more secure web for the next few years. What's more, TLS 1.3 comes without a ton of stuff (was removed): renegotiation, compression, and many legacy algorithms: `DSA`, `RC4`, `SHA1`, `MD5`, `CBC` MAC-then-Encrypt ciphers. TLS 1.0 and TLS 1.1 protocols will be removed from browsers at the beginning of 2020.

> TLS 1.2 does require careful configuration to ensure obsolete cipher suites with identified vulnerabilities are not used in conjunction with it. TLS 1.3 removes the need to make these decisions. TLS 1.3 version also improves TLS 1.2 security, privace and performance issues.

> Before enabling specific protocol version, you should check which ciphers are supported by the protocol. So if you turn on TLS 1.2 and TLS 1.3 both remember about [the correct (and strong)](#beginner-use-only-strong-ciphers) ciphers to handle them. Otherwise, they will not be anyway works without supported ciphers (no TLS handshake will succeed).

> I think the best way to deploy secure configuration is: enable TLS 1.2 without any `CBC` Ciphers (is safe enough) only TLS 1.3 is safer because of its handling improvement and the exclusion of everything that went obsolete since TLS 1.2 came up.

> If you told Nginx to use TLS 1.3, it will use TLS 1.3 only where is available. Nginx supports TLS 1.3 since version 1.13.0 (released in April 2017), when built against OpenSSL 1.1.1 or more.

> For TLS 1.3, think about using [`ssl_early_data`](#beginner-prevent-replay-attacks-on-zero-round-trip-time) to allow TLS 1.3 0-RTT handshakes.

**My recommendation:**

> Use only [TLSv1.3 and TLSv1.2](#keep-only-tls1.2-tls13).

#### Example

TLS 1.3 + 1.2:

```nginx
ssl_protocols TLSv1.3 TLSv1.2;
```

TLS 1.2:

```nginx
ssl_protocols TLSv1.2;
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>100%</b>

TLS 1.3 + 1.2 + 1.1:

```nginx
ssl_protocols TLSv1.3 TLSv1.2 TLSv1.1;
```

TLS 1.2 + 1.1:

```nginx
ssl_protocols TLSv1.2 TLSv1.1;
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>95%</b>

#### External resources

- [The Transport Layer Security (TLS) Protocol Version 1.2](https://www.ietf.org/rfc/rfc5246.txt)
- [The Transport Layer Security (TLS) Protocol Version 1.3](https://tools.ietf.org/html/draft-ietf-tls-tls13-18)
- [TLS1.2 - Every byte explained and reproduced](https://tls12.ulfheim.net/)
- [TLS1.3 - Every byte explained and reproduced](https://tls13.ulfheim.net/)
- [TLS1.3 - OpenSSLWiki](https://wiki.openssl.org/index.php/TLS1.3)
- [TLS v1.2 handshake overview](https://medium.com/@ethicalevil/tls-handshake-protocol-overview-a39e8eee2cf5)
- [An Overview of TLS 1.3 - Faster and More Secure](https://kinsta.com/blog/tls-1-3/)
- [A Detailed Look at RFC 8446 (a.k.a. TLS 1.3)](https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/)
- [Differences between TLS 1.2 and TLS 1.3](https://www.wolfssl.com/differences-between-tls-1-2-and-tls-1-3/)
- [TLS 1.3 in a nutshell](https://assured.se/2018/08/29/tls-1-3-in-a-nut-shell/)
- [TLS 1.3 is here to stay](https://www.ssl.com/article/tls-1-3-is-here-to-stay/)
- [How to enable TLS 1.3 on Nginx](https://ma.ttias.be/enable-tls-1-3-nginx/)
- [How to deploy modern TLS in 2019?](https://blog.probely.com/how-to-deploy-modern-tls-in-2018-1b9a9cafc454)
- [Deploying TLS 1.3: the great, the good and the bad](https://media.ccc.de/v/33c3-8348-deploying_tls_1_3_the_great_the_good_and_the_bad)
- [Downgrade Attack on TLS 1.3 and Vulnerabilities in Major TLS Libraries](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2019/february/downgrade-attack-on-tls-1.3-and-vulnerabilities-in-major-tls-libraries/)
- [Phase two of our TLS 1.0 and 1.1 deprecation plan](https://www.fastly.com/blog/phase-two-our-tls-10-and-11-deprecation-plan)
- [Deprecating TLS 1.0 and 1.1 - Enhancing Security for Everyone](https://www.keycdn.com/blog/deprecating-tls-1-0-and-1-1)
- [TLS/SSL Explained – Examples of a TLS Vulnerability and Attack, Final Part](https://www.acunetix.com/blog/articles/tls-vulnerabilities-attacks-final-part/)
- [This POODLE bites: exploiting the SSL 3.0 fallback](https://security.googleblog.com/2014/10/this-poodle-bites-exploiting-ssl-30.html)
- [Are You Ready for 30 June 2018? Saying Goodbye to SSL/early TLS](https://blog.pcisecuritystandards.org/are-you-ready-for-30-june-2018-sayin-goodbye-to-ssl-early-tls)
- [Deprecating TLSv1.0 and TLSv1.1](https://tools.ietf.org/id/draft-moriarty-tls-oldversions-diediedie-00.html)

### :beginner: Use only strong ciphers

#### Rationale

> This parameter changes quite often, the recommended configuration for today may be out of date tomorrow.

> To check ciphers supported by OpenSSL on your server: `openssl ciphers -s -v`, `openssl ciphers -s -v ECDHE` or `openssl ciphers -s -v DHE`.

> For more security use only strong and not vulnerable cipher suites. Place `ECDHE` and `DHE` suites at the top of your list. The order is important because `ECDHE` suites are faster, you want to use them whenever clients supports them. Ephemeral `DHE/ECDHE` are recommended and support Perfect Forward Secrecy.

> For backward compatibility software components you should use less restrictive ciphers. Not only that you have to enable at least one special `AES128` cipher for HTTP/2 support regarding to [RFC7540: TLS 1.2 Cipher Suites](https://tools.ietf.org/html/rfc7540#section-9.2.2), you also have to allow `prime256` elliptic curves which reduces the score for key exchange by another 10% even if a secure server preferred order is set.

> Also modern cipher suites (e.g. from Mozilla recommendations) suffers from compatibility troubles mainly because drops `SHA-1`. But be careful if you want to use ciphers with `HMAC-SHA-1` - there's a perfectly good [explanation](https://crypto.stackexchange.com/a/26518) why.

> If you want to get **A+ with 100%s on SSL Lab** (for Cipher Strength) you should definitely disable `128-bit` ciphers. That's the main reason why you should not use them.

> In my opinion `128-bit` symmetric encryption doesn’t less secure. Moreover, there are about 30% faster and still secure. For example TLS 1.3 use `TLS_AES_128_GCM_SHA256 (0x1301)` (for TLS-compliant applications).

> It is not possible to control ciphers for TLS 1.3 without support from client to use new API for TLS 1.3 cipher suites. Nginx isn't able to influence that so at this moment it's always on (also if you disable potentially weak cipher from Nginx). On the other hand the ciphers in TLSv1.3 have been restricted to only a handful of completely secure ciphers by leading crypto experts.

> For TLS 1.2 you should consider disable weak ciphers without forward secrecy like ciphers with `CBC` algorithm. Using them also reduces the final grade because they don't use ephemeral keys. In my opinion you should use ciphers with `AEAD` (TLS 1.3 supports only these suites) encryption because they don't have any known weaknesses.

> Recently new vulnerabilities like Zombie POODLE, GOLDENDOODLE, 0-Length OpenSSL and Sleeping POODLE were published for websites that use `CBC` (Cipher Block Chaining) block cipher modes. These vulnerabilities are applicable only if the server uses TLS 1.2 or TLS 1.1 or TLS 1.0 with `CBC` cipher modes. Look at [Zombie POODLE, GOLDENDOODLE, & How TLSv1.3 Can Save Us All](https://i.blackhat.com/asia-19/Fri-March-29/bh-asia-Young-Zombie-Poodle-Goldendoodle-and-How-TLSv13-Can-Save-Us-All.pdf) presentation from Black Hat Asia 2019.

> Disable TLS cipher modes (all ciphers that start with `TLS_RSA_WITH_*`) that use RSA encryption because they are vulnerable to [ROBOT](https://robotattack.org/) attack. Not all servers that support RSA key exchange are vulnerable, but it is recommended to disable RSA key exchange ciphers as it does not support forward secrecy.

> You should also absolutely disable weak ciphers regardless of the TLS version do you use, like those with `DSS`, `DSA`, `DES/3DES`, `RC4`, `MD5`, `SHA1`, `null`, anon in the name.

> We have a nice online tool for testing compatibility cipher suites with user agents: [CryptCheck](https://cryptcheck.fr/suite/). I think it will be very helpful for you.

**My recommendation:**

> Use only [TLSv1.3 and TLSv1.2](#keep-only-tls1.2-tls13) with below cipher suites:

```nginx
ssl_ciphers "TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384:TLS13-AES-128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256";
```

#### Example

Cipher suites for TLS 1.3:

```nginx
ssl_ciphers "TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384";
```

Cipher suites for TLS 1.2:

```nginx
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-SHA384";
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>100%</b>

Cipher suites for TLS 1.3:

```nginx
ssl_ciphers "TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-256-GCM-SHA384:TLS13-AES-128-GCM-SHA256";
```

Cipher suites for TLS 1.2:

```nginx
## 1)
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-SHA384";

## 2)
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256";

## 3)
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256";

## 4)
ssl_ciphers "EECDH+CHACHA20:EDH+AESGCM:AES256+EECDH:AES256+EDH";
```

Cipher suites for TLS 1.1 + 1.2:

```nginx
## 1)
ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256";

## 2)
ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:!AES256-GCM-SHA256:!AES256-GCM-SHA128:!aNULL:!MD5";
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>90%</b>

This will also give a baseline for comparison with [Mozilla SSL Configuration Generator](https://mozilla.github.io/server-side-tls/ssl-config-generator/):

- Modern profile with OpenSSL 1.1.0b (TLSv1.2)

```nginx
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
```

- Intermediate profile with OpenSSL 1.1.0b (TLSv1, TLSv1.1 and TLSv1.2)

```nginx
ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
```

#### External resources

- [RFC 7525 - TLS Recommendations](https://tools.ietf.org/html/rfc7525)
- [TLS Cipher Suites](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4)
- [SSL/TLS: How to choose your cipher suite](https://technology.amis.nl/2017/07/04/ssltls-choose-cipher-suite/)
- [HTTP/2 and ECDSA Cipher Suites](https://sparanoid.com/note/http2-and-ecdsa-cipher-suites/)
- [Which SSL/TLS Protocol Versions and Cipher Suites Should I Use?](https://www.securityevaluators.com/ssl-tls-protocol-versions-cipher-suites-use/)
- [Recommendations for a cipher string by OWASP](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/TLS_Cipher_String_Cheat_Sheet.md)
- [Recommendations for TLS/SSL Cipher Hardening by Acunetix](https://www.acunetix.com/blog/articles/tls-ssl-cipher-hardening/)
- [Mozilla’s Modern compatibility suite](https://wiki.mozilla.org/Security/Server_Side_TLS#Modern_compatibility)
- [Why use Ephemeral Diffie-Hellman](https://tls.mbed.org/kb/cryptography/ephemeral-diffie-hellman)
- [Cipher Suite Breakdown](https://blogs.technet.microsoft.com/askpfeplat/2017/12/26/cipher-suite-breakdown/)
- [Zombie POODLE and GOLDENDOODLE Vulnerabilities](https://blog.qualys.com/technology/2019/04/22/zombie-poodle-and-goldendoodle-vulnerabilities)
- [OpenSSL IANA Mapping](https://testssl.sh/openssl-iana.mapping.html)
- [Goodbye TLS_RSA](https://lightshipsec.com/goodbye-tls_rsa/)

### :beginner: Use more secure ECDH Curve

#### Rationale

> In my opinion your main source of knowledge should be [The SafeCurves web site](https://safecurves.cr.yp.to/). This site reports security assessments of various specific curves.

> For a SSL server certificate, an "elliptic curve" certificate will be used only with digital signatures (`ECDSA` algorithm). Nginx provides directive to specifies a curve for `ECDHE` ciphers.

> `x25519` is a more secure (also with SafeCurves requirements) but slightly less compatible option. I think to maximise interoperability with existing browsers and servers, stick to `P-256 prime256v1` and `P-384 secp384r1` curves. Of course there's tons of different opinions about `P-256` and `P-384` curves.

> NSA Suite B says that NSA uses curves `P-256` and `P-384` (in OpenSSL, they are designated as, respectively, `prime256v1` and `secp384r1`). There is nothing wrong with `P-521`, except that it is, in practice, useless. Arguably, `P-384` is also useless, because the more efficient `P-256` curve already provides security that cannot be broken through accumulation of computing power.

> Bernstein and Lange believe that the NIST curves are not optimal and there are better (more secure) curves that work just as fast, e.g. `x25519`.

> Keep an eye also on this:
>
> _Secure implementations of the standard curves are theoretically possible but very hard._
>
> The SafeCurves say:
>
> - `NIST P-224`, `NIST P-256` and `NIST P-384` are UNSAFE
>
> From the curves described here only `x25519` is a curve meets all SafeCurves requirements.

> I think you can use `P-256` to minimise trouble. If you feel that your manhood is threatened by using a 256-bit curve where a 384-bit curve is available, then use `P-384`: it will increases your computational and network costs.

> If you use TLS 1.3 you should enable `prime256v1` signature algorithm. Without this SSL Lab reports `TLS_AES_128_GCM_SHA256 (0x1301)` signature as weak.

> If you do not set `ssl_ecdh_curve`, then Nginx will use its default settings, e.g. Chrome will prefer `x25519`, but it is **not recommended** because you can not control default settings (seems to be `P-256`) from the Nginx.

> Explicitly set `ssl_ecdh_curve X25519:prime256v1:secp521r1:secp384r1;` **decreases the Key Exchange SSL Labs rating**.

> Definitely do not use the `secp112r1`, `secp112r2`, `secp128r1`, `secp128r2`, `secp160k1`, `secp160r1`, `secp160r2`, `secp192k1` curves. They have a too small size for security application according to NIST recommendation.

**My recommendation:**

> Use only [TLSv1.3 and TLSv1.2](#keep-only-tls1.2-tls13) and [only strong ciphers](#use-only-strong-ciphers) with above curves:

```nginx
ssl_ecdh_curve X25519:secp521r1:secp384r1:prime256v1;
```

#### Example

Curves for TLS 1.2:

```nginx
ssl_ecdh_curve secp521r1:secp384r1:prime256v1;
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>100%</b>

```nginx
## Alternative (this one doesn’t affect compatibility, by the way; it’s just a question of the preferred order).

## This setup downgrade Key Exchange score but is recommended for TLS 1.2 + 1.3:
ssl_ecdh_curve X25519:secp521r1:secp384r1:prime256v1;
```

#### External resources

- [Elliptic Curves for Security](https://tools.ietf.org/html/rfc7748)
- [Standards for Efficient Cryptography Group](http://www.secg.org/)
- [SafeCurves: choosing safe curves for elliptic-curve cryptography](https://safecurves.cr.yp.to/)
- [A note on high-security general-purpose elliptic curves](https://eprint.iacr.org/2013/647)
- [P-521 is pretty nice prime](https://blog.cr.yp.to/20140323-ecdsa.html)
- [Safe ECC curves for HTTPS are coming sooner than you think](https://certsimple.com/blog/safe-curves-and-openssl)
- [Cryptographic Key Length Recommendations](https://www.keylength.com/)
- [Testing for Weak SSL/TLS Ciphers, Insufficient Transport Layer Protection (OTG-CRYPST-001)](<https://www.owasp.org/index.php/Testing_for_Weak_SSL/TLS_Ciphers,_Insufficient_Transport_Layer_Protection_(OTG-CRYPST-001)>)
- [Elliptic Curve performance: NIST vs Brainpool](https://tls.mbed.org/kb/cryptography/elliptic-curve-performance-nist-vs-brainpool)
- [Which elliptic curve should I use?](https://security.stackexchange.com/questions/78621/which-elliptic-curve-should-i-use/91562)
- [Elliptic Curve Cryptography for those who are afraid of maths](http://www.lapsedordinary.net/files/ECC_BSidesLDN_2015.pdf)

### :beginner: Use strong Key Exchange with Perfect Forward Secrecy

#### Rationale

> To use a signature based authentication you need some kind of DH exchange (fixed or ephemeral/temporary), to exchange the session key. If you use it, Nginx will use the default Ephemeral Diffie-Hellman (`DHE`) paramaters to define how performs the Diffie-Hellman (DH) key-exchange. This uses a weak key (by default: `1024 bit`) that gets lower scores.

> You should always use the Elliptic Curve Diffie Hellman Ephemeral (`ECDHE`). Due to increasing concern about pervasive surveillance, key exchanges that provide Forward Secrecy are recommended, see for example [RFC 7525](https://tools.ietf.org/html/rfc7525#section-6.3).

> For greater compatibility but still for security in key exchange, you should prefer the latter E (ephemeral) over the former E (EC). There is recommended configuration: `ECDHE` > `DHE` (with min. `2048 bit` size) > `ECDH`. With this if the initial handshake fails, another handshake will be initiated using `DHE`.

> `DHE` is slower than `ECDHE`. If you are concerned about performance, prioritize `ECDHE-ECDSA` over `DHE`. OWASP estimates that the TLS handshake with `DHE` hinders the CPU by a factor of 2.4 compared to `ECDHE`.

> Diffie-Hellman requires some set-up parameters to begin with. Parameters from `ssl_dhparam` (which are generated with `openssl dhparam ...`) define how OpenSSL performs the Diffie-Hellman (DH) key-exchange. They include a field prime `p` and a generator `g`. The purpose of the availability to customize these parameter is to allow everyone to use own parameters for this. This can be used to prevent being affected from the Logjam attack.

> Modern clients prefer `ECDHE` instead other variants and if your Nginx accepts this preference then the handshake will not use the DH param at all since it will not do a `DHE` key exchange but an `ECDHE` key exchange. Thus, if no plain `DH/DHE` ciphers are configured at your server but only Eliptic curve DH (e.g. `ECDHE`) then you don't need to set your own `ssl_dhparam` directive. Enabling `DHE` requires us to take care of our DH primes (a.k.a. `dhparams`) and to trust in `DHE`.

> Elliptic curve Diffie-Hellman is a modified Diffie-Hellman exchange which uses Elliptic curve cryptography instead of the traditional RSA-style large primes. So while I'm not sure what parameters it may need (if any), I don't think it needs the kind you're generating (`ECDH` is based on curves, not primes, so I don't think the traditional DH params will do you any good).

> Cipher suites using `DHE` key exchange in OpenSSL require `tmp_DH` parameters, which the `ssl_dhparam` directive provides. The same is true for `DH_anon` key exchange, but in practice nobody uses those. The OpenSSL wiki page for Diffie Hellman Parameters it says: _To use perfect forward secrecy cipher suites, you must set up Diffie-Hellman parameters (on the server side)._ Look also at [SSL_CTX_set_tmp_dh_callback](https://www.openssl.org/docs/man1.0.2/man3/SSL_CTX_set_tmp_dh.html).

> If you use `ECDH/ECDHE` key exchange please see [Use more secure ECDH Curve](#beginner-use-more-secure-ecdh-curve) rule.

> Default key size in OpenSSL is `1024 bits` - it's vulnerable and breakable. For the best security configuration use your own DH Group (min. `2048 bit`) or use known safe ones pre-defined DH groups (it's recommended) from the [Mozilla](https://wiki.mozilla.org/Security/Server_Side_TLS#ffdhe4096).

> The `2048 bit` is generally expected to be safe and is already very far into the "cannot break it zone". However years ago people expected 1024 bit to be safe so if you are after long term resistance You would go up to `4096 bit` (for both RSA keys and DH parameters). It's also important if you want to get 100% on Key Exchange of the SSL Labs test.

> You should remember that the `4096 bit` modulus will make DH computations slower and won’t actually improve security.

There is [good explanation](https://security.stackexchange.com/questions/47204/dh-parameters-recommended-size/47207#47207) about DH parameters recommended size:

> _Current recommendations from various bodies (including NIST) call for a `2048-bit` modulus for DH. Known DH-breaking algorithms would have a cost so ludicrously high that they could not be run to completion with known Earth-based technology. See this site for pointers on that subject._

> _You don't want to overdo the size because the computational usage cost rises relatively sharply with prime size (somewhere between quadratic and cubic, depending on some implementation details) but a `2048-bit` DH ought to be fine (a basic low-end PC can do several hundreds of `2048-bit` DH per second)._

Look also at this answer by [Matt Palmer](https://www.hezmatt.org/~mpalmer/blog/):

> _Indeed, characterising `2048 bit` DH parameters as "weak as hell" is quite misleading. There are no known feasible cryptographic attacks against arbitrary strong 2048 bit DH groups. To protect against future disclosure of a session key due to breaking DH, sure, you want your DH parameters to be as long as is practical, but since `1024 bit` DH is only just getting feasible, `2048 bits` should be OK for most purposes for a while yet._

**My recommendation:**

> If you use only TLS 1.3 - `ssl_dhparam` is not required (not used). Also, if you use `ECDHE/ECDH` - `ssl_dhparam` is not required (not used). If you use `DHE/DH` - `ssl_dhparam` with DH parameters is required (min. `2048 bit`). By default no parameters are set, and therefore `DHE` ciphers will not be used.

#### Example

```bash
## To generate a DH parameters:
openssl dhparam -out /etc/nginx/ssl/dhparam_4096.pem 4096

## To produce "DSA-like" DH parameters:
openssl dhparam -dsaparam -out /etc/nginx/ssl/dhparam_4096.pem 4096

## Nginx configuration only for DH/DHE:
ssl_dhparam /etc/nginx/ssl/dhparams_4096.pem;
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>100%</b>

```bash
## To generate a DH parameters:
openssl dhparam -out /etc/nginx/ssl/dhparam_2048.pem 2048

## To produce "DSA-like" DH parameters:
openssl dhparam -dsaparam -out /etc/nginx/ssl/dhparam_2048.pem 2048

## Nginx configuration only for DH/DHE:
ssl_dhparam /etc/nginx/ssl/dhparam_2048.pem;
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>90%</b>

#### External resources

- [Weak Diffie-Hellman and the Logjam Attack](https://weakdh.org/)
- [Guide to Deploying Diffie-Hellman for TLS](https://weakdh.org/sysadmin.html)
- [Pre-defined DHE groups](https://wiki.mozilla.org/Security/Server_Side_TLS#ffdhe4096)
- [Instructs OpenSSL to produce "DSA-like" DH parameters](https://security.stackexchange.com/questions/95178/diffie-hellman-parameters-still-calculating-after-24-hours/95184#95184)
- [OpenSSL generate different types of self signed certificate](https://security.stackexchange.com/questions/44251/openssl-generate-different-types-of-self-signed-certificate)
- [Public Diffie-Hellman Parameter Service/Tool](https://2ton.com.au/dhtool/)
- [Vincent Bernat's SSL/TLS & Perfect Forward Secrecy](http://vincent.bernat.im/en/blog/2011-ssl-perfect-forward-secrecy.html)
- [RSA and ECDSA performance](https://securitypitfalls.wordpress.com/2014/10/06/rsa-and-ecdsa-performance/)
- [SSL/TLS: How to choose your cipher suite](https://technology.amis.nl/2017/07/04/ssltls-choose-cipher-suite/)
- [Diffie-Hellman and its TLS/SSL usage](https://security.stackexchange.com/questions/41205/diffie-hellman-and-its-tls-ssl-usage)

### :beginner: Prevent Replay Attacks on Zero Round-Trip Time

#### Rationale

> This rules is only important for TLS 1.3. By default enabling TLS 1.3 will not enable 0-RTT support. After all, you should be fully aware of all the potential exposure factors and related risks with the use of this option.

> 0-RTT Handshakes is part of the replacement of TLS Session Resumption and was inspired by the QUIC Protocol.

> 0-RTT creates a significant security risk. With 0-RTT, a threat actor can intercept an encrypted client message and resend it to the server, tricking the server into improperly extending trust to the threat actor and thus potentially granting the threat actor access to sensitive data.

> On the other hand, including 0-RTT (Zero Round Trip Time Resumption) results in a significant increase in efficiency and connection times. TLS 1.3 has a faster handshake that completes in 1-RTT. Additionally, it has a particular session resumption mode where, under certain conditions, it is possible to send data to the server on the first flight (0-RTT).

> For example, Cloudflare only supports 0-RTT for [GET requests with no query parameters](https://new.blog.cloudflare.com/introducing-0-rtt/) in an attempt to limit the attack surface. Moreover, in order to improve identify connection resumption attempts, they relay this information to the origin by adding an extra header to 0-RTT requests. This header uniquely identifies the request, so if one gets repeated, the origin will know it's a replay attack (the application needs to track values received from that and reject duplicates on non-idempotent endpoints).

> To protect against such attacks at the application layer, the `$ssl_early_data` variable should be used. You'll also need to ensure that the `Early-Data` header is passed to your application. `$ssl_early_data` returns 1 if TLS 1.3 early data is used and the handshake is not complete.

> However, as part of the upgrade, you should disable 0-RTT until you can audit your application for this class of vulnerability.

> In order to send early-data, client and server [must support PSK exchange mode](https://tools.ietf.org/html/rfc8446#section-2.3) (session cookies).

> In addition, I would like to recommend [this](https://news.ycombinator.com/item?id=16667036) great discussion about TLS 1.3 and 0-RTT.

If you are unsure to enable 0-RTT, look what Cloudflare say about it:

> _Generally speaking, 0-RTT is safe for most web sites and applications. If your web application does strange things and you’re concerned about its replay safety, consider not using 0-RTT until you can be certain that there are no negative effects. [...] TLS 1.3 is a big step forward for web performance and security. By combining TLS 1.3 with 0-RTT, the performance gains are even more dramatic._

#### Example

Test 0-RTT with OpenSSL:

```bash
## 1)
_host="example.com"

cat > req.in << __EOF__
HEAD / HTTP/1.1
Host: $_host
Connection: close
__EOF__
## or:
## echo -e "GET / HTTP/1.1\r\nHost: $_host\r\nConnection: close\r\n\r\n" > req.in

openssl s_client -connect ${_host}:443 -tls1_3 -sess_out session.pem -ign_eof < req.in
openssl s_client -connect ${_host}:443 -tls1_3 -sess_in session.pem -early_data req.in

## 2)
python -m sslyze --early_data "$_host"
```

Enable 0-RTT with `$ssl_early_data` variable:

```nginx
server {

  ...

  ssl_protocols   TLSv1.2 TLSv1.3;
  ## To enable 0-RTT (TLS 1.3):
  ssl_early_data  on;

  location / {

    proxy_pass       http://backend_x20;
    ## It protect against such attacks at the application layer:
    proxy_set_header Early-Data $ssl_early_data;

  }

  ...

}
```

#### External resources

- [Security Review of TLS1.3 0-RTT](https://github.com/tlswg/tls13-spec/issues/1001)
- [Introducing Zero Round Trip Time Resumption (0-RTT)](https://new.blog.cloudflare.com/introducing-0-rtt/)
- [What Application Developers Need To Know About TLS Early Data (0RTT)](https://blog.trailofbits.com/2019/03/25/what-application-developers-need-to-know-about-tls-early-data-0rtt/)
- [Replay Attacks on Zero Round-Trip Time: The Case of the TLS 1.3 Handshake Candidates](https://eprint.iacr.org/2017/082.pdf)
- [0-RTT and Anti-Replay](https://tools.ietf.org/html/rfc8446#section-8)
- [Using Early Data in HTTP (2017)](https://tools.ietf.org/id/draft-thomson-http-replay-00.html_)
- [Using Early Data in HTTP (2018)](https://tools.ietf.org/html/draft-ietf-httpbis-replay-04)
- [0-RTT Handshakes](https://ldapwiki.com/wiki/0-RTT%20Handshakes)

### :beginner: Defend against the BEAST attack

#### Rationale

> Generally the BEAST attack relies on a weakness in the way `CBC` mode is used in SSL/TLS.

> More specifically, to successfully perform the BEAST attack, there are some conditions which needs to be met:
>
> - vulnerable version of SSL must be used using a block cipher (`CBC` in particular)
> - JavaScript or a Java applet injection - should be in the same origin of the web site
> - data sniffing of the network connection must be possible

> To prevent possible use BEAST attacks you should enable server-side protection, which causes the server ciphers should be preferred over the client ciphers, and completely excluded TLS 1.0 from your protocol stack.

#### Example

```nginx
ssl_prefer_server_ciphers on;
```

#### External resources

- [An Illustrated Guide to the BEAST Attack](https://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art027)
- [Is BEAST still a threat?](https://blog.ivanristic.com/2013/09/is-beast-still-a-threat.html)
- [Beat the BEAST with TLS 1.1/1.2 and More](https://blogs.cisco.com/security/beat-the-beast-with-tls)
- [Use only strong ciphers (from this handbook)](#beginner-use-only-strong-ciphers)

### :beginner: Mitigation of CRIME/BREACH attacks

#### Rationale

> Disable HTTP compression or compress only zero sensitive content.

> You should probably never use TLS compression. Some user agents (at least Chrome) will disable it anyways. Disabling SSL/TLS compression stops the attack very effectively. A deployment of HTTP/2 over TLS 1.2 must disable TLS compression (please see [RFC 7540: 9.2. Use of TLS Features](https://tools.ietf.org/html/rfc7540#section-9.2)).

> CRIME exploits SSL/TLS compression which is disabled since nginx 1.3.2. BREACH exploits HTTP compression

> Some attacks are possible (e.g. the real BREACH attack is a complicated) because of gzip (HTTP compression not TLS compression) being enabled on SSL requests. In most cases, the best action is to simply disable gzip for SSL.

> Compression is not the only requirement for the attack to be done so using it does not mean that the attack will succeed. Generally you should consider whether having an accidental performance drop on HTTPS sites is better than HTTPS sites being accidentally vulnerable.

> You shouldn't use HTTP compression on private responses when using TLS.

> I would gonna to prioritise security over performance but compression can be (I think) okay to HTTP compress publicly available static content like css or js and HTML content with zero sensitive info (like an "About Us" page).

> Remember: by default, Nginx doesn't compress image files using its per-request gzip module.

> Gzip static module is better, for 2 reasons:
>
> - you don't have to gzip for each request
> - you can use a higher gzip level

> You should put the `gzip_static on;` inside the blocks that configure static files, but if you’re only running one site, it’s safe to just put it in the http block.

#### Example

```nginx
## Disable dynamic HTTP compression:
gzip off;

## Enable dynamic HTTP compression for specific location context:
location / {

  gzip on;

  ...

}

## Enable static gzip compression:
location ^~ /assets/ {

  gzip_static on;

  ...

}
```

#### External resources

- [Is HTTP compression safe?](https://security.stackexchange.com/questions/20406/is-http-compression-safe)
- [HTTP compression continues to put encrypted communications at risk](https://www.pcworld.com/article/3051675/http-compression-continues-to-put-encrypted-communications-at-risk.html)
- [SSL/TLS attacks: Part 2 – CRIME Attack](http://niiconsulting.com/checkmate/2013/12/ssltls-attacks-part-2-crime-attack/)
- [Defending against the BREACH Attack](https://blog.qualys.com/ssllabs/2013/08/07/defending-against-the-breach-attack)
- [To avoid BREACH, can we use gzip on non-token responses?](https://security.stackexchange.com/questions/172581/to-avoid-breach-can-we-use-gzip-on-non-token-responses)
- [Don't Worry About BREACH](https://blog.ircmaxell.com/2013/08/dont-worry-about-breach.html)
- [Module ngx_http_gzip_static_module](http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html)
- [Offline Compression with Nginx](https://theartofmachinery.com/2016/06/06/nginx_gzip_static.html)

### :beginner: HTTP Strict Transport Security

#### Rationale

> Generally HSTS is a way for websites to tell browsers that the connection should only ever be encrypted. This prevents MITM attacks, downgrade attacks, sending plain text cookies and session ids.

> The header indicates for how long a browser should unconditionally refuse to take part in unsecured HTTP connection for a specific domain.

> When a browser knows that a domain has enabled HSTS, it does two things:
>
> - always uses an `https://` connection, even when clicking on an `http://` link or after typing a domain into the location bar without specifying a protocol
> - removes the ability for users to click through warnings about invalid certificates

> I recommend to set the `max-age` to a big value like `31536000` (12 months) or `63072000` (24 months).

> There are a few simple best practices for HSTS (from [ The Importance of a Proper HTTP Strict Transport Security Implementation on Your Web Server](https://blog.qualys.com/securitylabs/2016/03/28/the-importance-of-a-proper-http-strict-transport-security-implementation-on-your-web-server)):
>
> - The strongest protection is to ensure that all requested resources use only TLS with a well-formed HSTS header. Qualys recommends providing an HSTS header on all HTTPS resources in the target domain
>
> - It is advisable to assign the max-age directive’s value to be greater than `10368000` seconds (120 days) and ideally to `31536000` (one year). Websites should aim to ramp up the max-age value to ensure heightened security for a long duration for the current domain and/or subdomains
>
> - [RFC 6797](https://tools.ietf.org/html/rfc6797), section 14.4 advocates that a web application must aim to add the `includeSubDomain` directive in the policy definition whenever possible. The directive’s presence ensures the HSTS policy is applied to the domain of the issuing host and all of its subdomains, e.g. `example.com` and `www.example.com`
>
> - The application should never send an HSTS header over a plaintext HTTP header, as doing so makes the connection vulnerable to SSL stripping attacks
>
> - It is not recommended to provide an HSTS policy via the http-equiv attribute of a meta tag. According to HSTS RFC 6797, user agents don’t heed `http-equiv="Strict-Transport-Security"` attribute on `<meta>` elements on the received content`

> To meet the HSTS preload list standard a root domain needs to return a `strict-transport-security` header that includes both the `includeSubDomains` and `preload` directives and has a minimum `max-age` of one year. Your site must also serve a valid SSL certificate on the root domain and all subdomains, as well as redirect all HTTP requests to HTTPS on the same host.

> You had better be pretty sure that your website is indeed all HTTPS before you turn this on because HSTS adds complexity to your rollback strategy. Google recommend enabling HSTS this way:
>
> 1. Roll out your HTTPS pages without HSTS first
> 2. Start sending HSTS headers with a short `max-age`. Monitor your traffic both from users and other clients, and also dependents' performance, such as ads
> 3. Slowly increase the HSTS `max-age`
> 4. If HSTS doesn't affect your users and search engines negatively, you can, if you wish, ask your site to be added to the HSTS preload list used by most major browsers

#### Example

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains" always;
```

&nbsp;&nbsp;:arrow_right: ssllabs score: <b>A+</b>

#### External resources

- [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [Security HTTP Headers - Strict-Transport-Security](https://zinoui.com/blog/security-http-headers#strict-transport-security)
- [HTTP Strict Transport Security](https://https.cio.gov/hsts/)
- [HTTP Strict Transport Security Cheat Sheet](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security_Cheat_Sheet)
- [HSTS Cheat Sheet](https://scotthelme.co.uk/hsts-cheat-sheet/)
- [HSTS Preload and Subdomains](https://textslashplain.com/2018/04/09/hsts-preload-and-subdomains/)
- [HTTP Strict Transport Security (HSTS) and Nginx](https://www.nginx.com/blog/http-strict-transport-security-hsts-and-nginx/)
- [Is HSTS as a proper substitute for HTTP-to-HTTPS redirects?](https://www.reddit.com/r/bigseo/comments/8zw45d/is_hsts_as_a_proper_substitute_for_httptohttps/)
- [How to configure HSTS on www and other subdomains](https://www.danielmorell.com/blog/how-to-configure-hsts-on-www-and-other-subdomains)
- [HSTS: Is includeSubDomains on main domain sufficient?](https://serverfault.com/questions/927336/hsts-is-includesubdomains-on-main-domain-sufficient)
- [The HSTS preload list eligibility](https://www.danielmorell.com/blog/how-to-configure-hsts-on-www-and-other-subdomains)
- [Check HSTS preload status and eligibility](https://hstspreload.org/)
- [HSTS Deployment Recommendations](https://hstspreload.org/#deployment-recommendations)
- [How does HSTS handle mixed content?](https://serverfault.com/questions/927145/how-does-hsts-handle-mixed-content)

### :beginner: Reduce XSS risks (Content-Security-Policy)

#### Rationale

> CSP reduce the risk and impact of XSS attacks in modern browsers.

> Whitelisting known-good resource origins, refusing to execute potentially dangerous inline scripts, and banning the use of eval are all effective mechanisms for mitigating cross-site scripting attacks.

> The inclusion of CSP policies significantly impedes successful XSS attacks, UI Redressing (Clickjacking), malicious use of frames or CSS injections.

> CSP is a good defence-in-depth measure to make exploitation of an accidental lapse in that less likely.

> The default policy that starts building a header is: block everything. By modifying the CSP value, the programmer loosens restrictions for specific groups of resources (e.g. separately for scripts, images, etc.).

> Before enable this header you should discuss with developers about it. They probably going to have to update your application to remove any inline script and style, and make some additional modifications there.

> Strict policies will significantly increase security, and higher code quality will reduce the overall number of errors. CSP can never replace secure code - new restrictions help reduce the effects of attacks (such as XSS), but they are not mechanisms to prevent them!

> You should always validate CSP before implement: [CSP Evaluator](https://csp-evaluator.withgoogle.com/) and [Content Security Policy (CSP) Validator](https://cspvalidator.org/).

> For generate a policy: [https://report-uri.com/home/generate](https://report-uri.com/home/generate). Remember, however, that these types of tools may become outdated or have errors.

#### Example

```nginx
## This policy allows images, scripts, AJAX, and CSS from the same origin, and does not allow any other resources to load:
add_header Content-Security-Policy "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';" always;
```

#### External resources

- [Content Security Policy (CSP) Quick Reference Guide](https://content-security-policy.com/)
- [Content Security Policy Cheat Sheet – OWASP](https://www.owasp.org/index.php/Content_Security_Policy_Cheat_Sheet)
- [Content Security Policy – OWASP](https://www.owasp.org/index.php/Content_Security_Policy)
- [Content Security Policy - An Introduction - Scott Helme](https://scotthelme.co.uk/content-security-policy-an-introduction/)
- [CSP Cheat Sheet - Scott Helme](https://scotthelme.co.uk/csp-cheat-sheet/)
- [Security HTTP Headers - Content-Security-Policy](https://zinoui.com/blog/security-http-headers#content-security-policy)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Content Security Policy (CSP) Validator](https://cspvalidator.org/)
- [Can I Use CSP](https://caniuse.com/#search=CSP)
- [CSP Is Dead, Long Live CSP!](https://ai.google/research/pubs/pub45542)

### :beginner: Control the behaviour of the Referer header (Referrer-Policy)

#### Rationale

> Determine what information is sent along with the requests.

#### Example

```nginx
add_header Referrer-Policy "no-referrer";
```

#### External resources

- [A new security header: Referrer Policy](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [Security HTTP Headers - Referrer-Policy](https://zinoui.com/blog/security-http-headers#referrer-policy)

### :beginner: Provide clickjacking protection (X-Frame-Options)

#### Rationale

> Helps to protect your visitors against clickjacking attacks. It is recommended that you use the `x-frame-options` header on pages which should not be allowed to render a page in a frame.

#### Example

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
```

#### External resources

- [HTTP Header Field X-Frame-Options](https://tools.ietf.org/html/rfc7034)
- [Clickjacking Defense Cheat Sheet](https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet)
- [Security HTTP Headers - X-Frame-Options](https://zinoui.com/blog/security-http-headers#x-frame-options)
- [X-Frame-Options - Scott Helme](https://scotthelme.co.uk/hardening-your-http-response-headers/#x-frame-options)

### :beginner: Prevent some categories of XSS attacks (X-XSS-Protection)

#### Rationale

> Enable the cross-site scripting (XSS) filter built into modern web browsers.

#### Example

```nginx
add_header X-XSS-Protection "1; mode=block" always;
```

#### External resources

- [XSS (Cross Site Scripting) Prevention Cheat Sheet](<https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet>)
- [DOM based XSS Prevention Cheat Sheet](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet)
- [X-XSS-Protection HTTP Header](https://www.tunetheweb.com/security/http-security-headers/x-xss-protection/)
- [Security HTTP Headers - X-XSS-Protection](https://zinoui.com/blog/security-http-headers#x-xss-protection)

### :beginner: Prevent Sniff Mimetype middleware (X-Content-Type-Options)

#### Rationale

> It prevents the browser from doing MIME-type sniffing (prevents "mime" based attacks).

#### Example

```nginx
add_header X-Content-Type-Options "nosniff" always;
```

#### External resources

- [X-Content-Type-Options HTTP Header](https://www.keycdn.com/support/x-content-type-options)
- [Security HTTP Headers - X-Content-Type-Options](https://zinoui.com/blog/security-http-headers#x-content-type-options)
- [X-Content-Type-Options - Scott Helme](https://scotthelme.co.uk/hardening-your-http-response-headers/#x-content-type-options)

### :beginner: Deny the use of browser features (Feature-Policy)

#### Rationale

> This header protects your site from third parties using APIs that have security and privacy implications, and also from your own team adding outdated APIs or poorly optimised images.

#### Example

```nginx
add_header Feature-Policy "geolocation 'none'; midi 'none'; notifications 'none'; push 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; vibrate 'none'; fullscreen 'none'; payment 'none'; usb 'none';";
```

#### External resources

- [Feature Policy Explainer](https://docs.google.com/document/d/1k0Ua-ZWlM_PsFCFdLMa8kaVTo32PeNZ4G7FFHqpFx4E/edit)
- [Policy Controlled Features](https://github.com/w3c/webappsec-feature-policy/blob/master/features.md)
- [Security HTTP Headers - Feature-Policy](https://zinoui.com/blog/security-http-headers#feature-policy)

### :beginner: Reject unsafe HTTP methods

#### Rationale

> Set of methods support by a resource. An ordinary web server supports the `HEAD`, `GET` and `POST` methods to retrieve static and dynamic content. Other (e.g. `OPTIONS`, `TRACE`) methods should not be supported on public web servers, as they increase the attack surface.

#### Example

```nginx
add_header Allow "GET, POST, HEAD" always;

if ($request_method !~ ^(GET|POST|HEAD)$) {

  return 405;

}
```

#### External resources

- [Vulnerability name: Unsafe HTTP methods](https://www.onwebsecurity.com/security/unsafe-http-methods.html)

### :beginner: Prevent caching of sensitive data

#### Rationale

> This policy should be implemented by the application architect, however, I know from experience that this does not always happen.

> Don' to cache or persist sensitive data. As browsers have different default behaviour for caching HTTPS content, pages containing sensitive information should include a `Cache-Control` header to ensure that the contents are not cached.

> One option is to add anticaching headers to relevant HTTP/1.1 and HTTP/2 responses, e.g. `Cache-Control: no-cache, no-store` and `Expires: 0`.

> To cover various browser implementations the full set of headers to prevent content being cached should be:
>
> `Cache-Control: no-cache, no-store, private, must-revalidate, max-age=0, no-transform` > `Pragma: no-cache` > `Expires: 0`

#### Example

```nginx
location /api {

  expires 0;
  add_header Cache-Control "no-cache, no-store";

}
```

#### External resources

- [RFC 2616 - Hypertext Transfer Protocol (HTTP/1.1): Standards Track](https://tools.ietf.org/html/rfc2616)
- [RFC 7234 - Hypertext Transfer Protocol (HTTP/1.1): Caching](https://tools.ietf.org/html/rfc7234)
- [HTTP Cache Headers - A Complete Guide](https://www.keycdn.com/blog/http-cache-headers)
- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
- [Increasing Application Performance with HTTP Cache Headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers)
- [HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)

### :beginner: Control Buffer Overflow attacks

#### Rationale

> Buffer overflow attacks are made possible by writing data to a buffer and exceeding that buffers’ boundary and overwriting memory fragments of a process. To prevent this in Nginx we can set buffer size limitations for all clients.

#### Example

```nginx
client_body_buffer_size 100k;
client_header_buffer_size 1k;
client_max_body_size 100k;
large_client_header_buffers 2 1k;
```

#### External resources

- [SCG WS nginx](https://www.owasp.org/index.php/SCG_WS_nginx)

### :beginner: Mitigating Slow HTTP DoS attacks (Closing Slow Connections)

#### Rationale

> Close connections that are writing data too infrequently, which can represent an attempt to keep connections open as long as possible.

> You can close connections that are writing data too infrequently, which can represent an attempt to keep connections open as long as possible (thus reducing the server’s ability to accept new connections).

#### Example

```nginx
client_body_timeout 10s;
client_header_timeout 10s;
keepalive_timeout 5s 5s;
send_timeout 10s;
```

#### External resources

- [Mitigating DDoS Attacks with Nginx and Nginx Plus](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)
- [SCG WS nginx](https://www.owasp.org/index.php/SCG_WS_nginx)
- [How to Protect Against Slow HTTP Attacks](https://blog.qualys.com/securitylabs/2011/11/02/how-to-protect-against-slow-http-attacks)
- [Effectively Using and Detecting The Slowloris HTTP DoS Tool](https://ma.ttias.be/effectively-using-detecting-the-slowloris-http-dos-tool/)

## 反向代理

### 使用与后端协议兼容的 pass 指令

> All `proxy_*` directives are related to the backends that use the specific backend protocol.

> You should use `proxy_pass` only for HTTP servers working on the backend layer (set also the `http://` protocol before referencing the HTTP backend) and other `*_pass` directives only for non-HTTP backend servers (like a uWSGI or FastCGI).

> Directives such as `uwsgi_pass`, `fastcgi_pass`, or `scgi_pass` are designed specifically for non-HTTP apps and you should use them instead of the `proxy_pass` (non-HTTP talking).

> For example: `uwsgi_pass` uses an uwsgi protocol. `proxy_pass` uses normal HTTP to talking with uWSGI server. uWSGI docs claims that uwsgi protocol is better, faster and can benefit from all of uWSGI special features. You can send to uWSGI information what type of data you are sending and what uWSGI plugin should be invoked to generate response. With http (`proxy_pass`) you won't get that.

示例：

❌ 错误配置

```nginx
server {

  location /app/ {

    ## For this, you should use uwsgi_pass directive.
    proxy_pass      192.168.154.102:4000;         ## backend layer: uWSGI Python app.

  }

  ...

}
```

⭕ 正确配置

```nginx
server {

  location /app/ {

    proxy_pass      http://192.168.154.102:80;    ## backend layer: OpenResty as a front for app.

  }

  location /app/v3 {

    uwsgi_pass      192.168.154.102:8080;         ## backend layer: uWSGI Python app.

  }

  location /app/v4 {

    fastcgi_pass    192.168.154.102:8081;         ## backend layer: php-fpm app.

  }
  ...

}
```

### 小心 `proxy_pass` 指令中的斜杠

> 注意尾随斜杠，因为 Nginx 会逐字替换部分，并且您可能会得到一些奇怪的 URL。
>
> 如果 proxy_pass 不带 URI 使用（即 server:port 之后没有路径），Nginx 会将原始请求中的 URI 与所有双斜杠 `../` 完全一样。
>
> `proxy_pass` 中的 URI 就像别名指令一样，意味着 Nginx 将用 `proxy_pass` 指令中的 URI 替换与位置前缀匹配的部分（我故意将其与位置前缀相同），因此 URI 将与请求的相同，但被规范化（没有小写斜杠和其他所有内容） 员工）。

示例：

```nginx
location = /a {

  proxy_pass http://127.0.0.1:8080/a;

  ...

}

location ^~ /a/ {

  proxy_pass http://127.0.0.1:8080/a/;

  ...

}
```

#### 仅使用 `$host` 变量设置和传递 Host 头

> 几乎应该始终将 `$host` 用作传入的主机变量，因为无论用户代理如何行为，它都是保证具有某种意义的唯一变量，除非您特别需要其他变量之一的语义。
>
> 变量 `$host` 是请求行或http头中的主机名。 变量 `$server_name` 是我们当前所在的服务器块的名称。

> 区别：
>
> - `$host` 包含“按此优先顺序：请求行中的主机名，或“主机”请求标头字段中的主机名，或与请求匹配的服务器名”
> - 如果请求中包含HTTP主机标头字段，则 `$http_host` 包含该内容（始终等于HTTP_HOST请求标头）
> - `$server_name` contains the `server_name` of the virtual host which processed the request, as it was defined in the Nginx configuration. If a server contains multiple server names, only the first one will be present in this variable

> `http_host`, moreover, is better than `$host:$server_port` because it uses the port as present in the URL, unlike `$server_port` which uses the port that Nginx listens on.

示例：

```nginx
proxy_set_header    Host    $host;
```

### 正确设置 `X-Forwarded-For` 头的值

#### Rationale

> In the light of the latest httpoxy vulnerabilities, there is really a need for a full example, how to use `HTTP_X_FORWARDED_FOR` properly. In short, the load balancer sets the 'most recent' part of the header. In my opinion, for security reasons, the proxy servers must be specified by the administrator manually.

> `X-Forwarded-For` is the custom HTTP header that carries along the original IP address of a client so the app at the other end knows what it is. Otherwise it would only see the proxy IP address, and that makes some apps angry.

> The `X-Forwarded-For` depends on the proxy server, which should actually pass the IP address of the client connecting to it. Where a connection passes through a chain of proxy servers, `X-Forwarded-For` can give a comma-separated list of IP addresses with the first being the furthest downstream (that is, the user). Because of this, servers behind proxy servers need to know which of them are trustworthy.

> The proxy used can set this header to anything it wants to, and therefore you can't trust its value. Most proxies do set the correct value though. This header is mostly used by caching proxies, and in those cases you're in control of the proxy and can thus verify that is gives you the correct information. In all other cases its value should be considered untrustworthy.

> Some systems also use `X-Forwarded-For` to enforce access control. A good number of applications rely on knowing the actual IP address of a client to help prevent fraud and enable access.

> Value of the `X-Forwarded-For` header field can be set at the client's side - this can also be termed as `X-Forwarded-For` spoofing. However, when the web request is made via a proxy server, the proxy server modifies the `X-Forwarded-For` field by appending the IP address of the client (user). This will result in 2 comma separated IP addresses in the `X-Forwarded-For` field.

> A reverse proxy is not source IP address transparent. This is a pain when you need the client source IP address to be correct in the logs of the backend servers. I think the best solution of this problem is configure the load balancer to add/modify an `X-Forwarded-For` header with the source IP of the client and forward it to the backend in the correct form.

> Unfortunately, on the proxy side we are not able to solve this problem (all solutions can be spoofable), it is important that this header is correctly interpreted by application servers. Doing so ensures that the apps or downstream services have accurate information on which to make their decisions, including those regarding access and authorization.

There is also an interesing idea what to do in this situation:

> _To prevent this we must distrust that header by default and follow the IP address breadcrumbs backwards from our server. First we need to make sure the `REMOTE_ADDR` is someone we trust to have appended a proper value to the end of `X-Forwarded-For`. If so then we need to make sure we trust the `X-Forwarded-For` IP to have appended the proper IP before it, so on and so forth. Until, finally we get to an IP we don’t trust and at that point we have to assume that’s the IP of our user._ - it comes from [Proxies & IP Spoofing](https://xyu.io/2013/07/04/proxies-ip-spoofing/) by [Xiao Yu](https://github.com/xyu).

#### Example

```nginx
## The whole purpose that it exists is to do the appending behavior:
proxy_set_header    X-Forwarded-For    $proxy_add_x_forwarded_for;
## Above is equivalent for this:
proxy_set_header    X-Forwarded-For    $http_x_forwarded_for,$remote_addr;
## The following is also equivalent for above but in this example we use http_realip_module:
proxy_set_header    X-Forwarded-For    "$http_x_forwarded_for, $realip_remote_addr";
```

#### External resources

- [Prevent X-Forwarded-For Spoofing or Manipulation](https://totaluptime.com/kb/prevent-x-forwarded-for-spoofing-or-manipulation/)
- [Bypass IP blocks with the X-Forwarded-For header](https://www.sjoerdlangkemper.nl/2017/03/01/bypass-ip-block-with-x-forwarded-for-header/)
- [Forwarded header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded)

### 不要在反向代理后面使用带有 `$scheme` 的 `X-Forwarded-Proto`

> 反向代理可以设置 `X-Forwarded-Proto`，以告知应用程序它是HTTPS还是HTTP甚至是无效名称。schema 变量仅在需要的时候才会被评估（仅用于当前请求）。
>
> 如果设置了 $schema 变量且沿途遇上多个代理，则会导致变形。例如：如果客户端转到https://example.com，则代理将方案值存储为HTTPS。 如果代理与下一级代理之间的通信是通过HTTP进行的，则后端会将方案视为HTTP。

示例：

```nginx
## 1) client <-> proxy <-> backend
proxy_set_header    X-Forwarded-Proto  $scheme;

## 2) client <-> proxy <-> proxy <-> backend
## proxy_set_header  X-Forwarded-Proto  https;
proxy_set_header    X-Forwarded-Proto  $proxy_x_forwarded_proto;
```

#### 始终将 Host，X-Real-IP 和 X-Forwarded 标头传递给后端

#### Rationale

> When using Nginx as a reverse proxy you may want to pass through some information of the remote client to your backend web server. I think it's good practices because gives you more control of forwarded headers.

> It's very important for servers behind proxy because it allow to interpret the client correctly. Proxies are the "eyes" of such servers, they should not allow a curved perception of reality. If not all requests are passed through a proxy, as a result, requests received directly from clients may contain e.g. inaccurate IP addresses in headers.

> `X-Forwarded` headers are also important for statistics or filtering. Other example could be access control rules on your app, because without these headers filtering mechanism may not working properly.

> If you use a front-end service like Apache or whatever else as the front-end to your APIs, you will need these headers to understand what IP or hostname was used to connect to the API.

> Forwarding these headers is also important if you use the https protocol (it has become a standard nowadays).

> However, I would not rely on either the presence of all `X-Forwarded` headers, or the validity of their data.

#### Example

```nginx
location / {

  proxy_pass          http://bk_upstream_01;

  ## The following headers also should pass to the backend:
  ##   - Host - host name from the request line, or host name from the Host request header field, or the server name matching a request
  ## proxy_set_header  Host               $host:$server_port;
  ## proxy_set_header  Host               $http_host;
  proxy_set_header    Host               $host;

  ##   - X-Real-IP - forwards the real visitor remote IP address to the proxied server
  proxy_set_header    X-Real-IP          $remote_addr;

  ## X-Forwarded headers stack:
  ##   - X-Forwarded-For - mark origin IP of client connecting to server through proxy
  ## proxy_set_header  X-Forwarded-For    $remote_addr;
  ## proxy_set_header  X-Forwarded-For    $http_x_forwarded_for,$remote_addr;
  ## proxy_set_header  X-Forwarded-For    "$http_x_forwarded_for, $realip_remote_addr";
  proxy_set_header    X-Forwarded-For    $proxy_add_x_forwarded_for;

  ##   - X-Forwarded-Host - mark origin host of client connecting to server through proxy
  ## proxy_set_header  X-Forwarded-Host   $host:443;
  proxy_set_header    X-Forwarded-Host   $host:$server_port;

  ##   - X-Forwarded-Server - the hostname of the proxy server
  proxy_set_header    X-Forwarded-Server $host;

  ##   - X-Forwarded-Port - defines the original port requested by the client
  ## proxy_set_header  X-Forwarded-Port   443;
  proxy_set_header    X-Forwarded-Port   $server_port;

  ##   - X-Forwarded-Proto - mark protocol of client connecting to server through proxy
  ## proxy_set_header  X-Forwarded-Proto  https;
  ## proxy_set_header  X-Forwarded-Proto  $proxy_x_forwarded_proto;
  proxy_set_header    X-Forwarded-Proto  $scheme;

}
```

### prefix 使用不带 `X-` 前缀的自定义头

#### Rationale

> Internet Engineering Task Force released a new RFC ([RFC-6648](https://tools.ietf.org/html/rfc6648)), recommending deprecation of `X-` prefix.

> The `X-` in front of a header name customarily has denoted it as experimental/non-standard/vendor-specific. Once it's a standard part of HTTP, it'll lose the prefix.

> If it’s possible for new custom header to be standardized, use a non-used and meaningful header name.

> The use of custom headers with `X-` prefix is not forbidden but discouraged. In other words, you can keep using `X-` prefixed headers, but it's not recommended and you may not document them as if they are public standard.

#### Example

Not recommended configuration:

```nginx
add_header X-Backend-Server $hostname;
```

Recommended configuration:

```nginx
add_header Backend-Server   $hostname;
```

#### External resources

- [Use of the "X-" Prefix in Application Protocols](https://tools.ietf.org/html/draft-saintandre-xdash-00)
- [Custom HTTP headers : naming conventions](https://stackoverflow.com/questions/3561381/custom-http-headers-naming-conventions/3561399#3561399)

## 负载均衡

负载平衡是一种有用的机制，可将传入的流量分布在几个有能力的服务器之间。

### 健康检查

> 健康监控对于所有类型的负载平衡都非常重要，主要是为了业务连续性。 被动检查会按照客户端的请求监视通过 Nginx 的连接失败或超时。
>
> 默认情况下启用此功能，但是此处提到的参数允许您调整其行为。 默认值为：`max_fails = 1` 和 `fail_timeout = 10s`。

示例：

```nginx
upstream backend {

  server bk01_node:80 max_fails=3 fail_timeout=5s;
  server bk02_node:80 max_fails=3 fail_timeout=5s;

}
```

### down 参数

> 有时我们需要关闭后端，例如 在维护时。 我认为良好的解决方案是使用 down 参数将服务器标记为永久不可用，即使停机时间很短也是如此。
>
> 如果您使用 IP 哈希负载平衡技术，那也很重要。 如果其中一台服务器需要临时删除，则应使用此参数进行标记，以保留客户端 IP 地址的当前哈希值。
>
> 注释对于真正永久禁用服务器或要出于历史目的而保留信息非常有用。
>
> Nginx 还提供了一个备份参数，将该服务器标记为备份服务器。 当主服务器不可用时，将传递请求。 仅当我确定后端将在维护时正常工作时，我才很少将此选项用于上述目的。

#### 示例

```nginx
upstream backend {

  server bk01_node:80 max_fails=3 fail_timeout=5s down;
  server bk02_node:80 max_fails=3 fail_timeout=5s;

}
```

## 安全

### 防盗链

```nginx
location ~* \.(gif|jpg|png)$ {
    # 只允许 192.168.0.1 请求资源
    valid_referers none blocked 192.168.0.1;
    if ($invalid_referer) {
       rewrite ^/ http://$host/logo.png;
    }
}
```

## 参考资料

- [nginx 这一篇就够了](https://juejin.im/post/5d81906c518825300a3ec7ca)