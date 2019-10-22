# Nginx 问题集

## Nginx 出现大量 TIME_WAIT

### 检测TIME_WAIT状态的语句

```bash
$ netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'  
SYN_RECV 7
ESTABLISHED 756
FIN_WAIT1 21
SYN_SENT 3
TIME_WAIT 2000
```

状态解析：

- `CLOSED` - 无连接是活动的或正在进行
- `LISTEN` - 服务器在等待进入呼叫
- `SYN_RECV` - 一个连接请求已经到达，等待确认
- `SYN_SENT` - 应用已经开始，打开一个连接
- `ESTABLISHED` - 正常数据传输状态
- `FIN_WAIT1` - 应用说它已经完成
- `FIN_WAIT2` - 另一边已同意释放
- `ITMED_WAIT` - 等待所有分组死掉
- `CLOSING` - 两边同时尝试关闭
- `TIME_WAIT` - 另一边已初始化一个释放
- `LAST_ACK` - 等待所有分组死掉

### 解决方法

执行 `vim /etc/sysctl.conf`，并添加下面字段

```properties
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_fin_timeout = 30
```

执行 /`sbin/sysctl -p` 让修改生效。

## 上传文件大小限制

### 问题现象

显示错误信息：**413 Request Entity Too Large**。

意思是请求的内容过大，浏览器不能正确显示。常见的情况是发送 `POST` 请求来上传大文件。

### 解决方法

- 可以在 `http` 模块中设置：`client_max_body_size  20m;`
- 可以在 `server` 模块中设置：`client_max_body_size  20m;`
- 可以在 `location` 模块中设置：`client_max_body_size  20m;`

三者区别是：

- 如果文大小限制设置在 `http` 模块中，则对所有 Nginx 收到的请求。
- 如果文大小限制设置在 `server` 模块中，则只对该 `server` 收到的请求生效。
- 如果文大小限制设置在 `location` 模块中，则只对匹配了 `location` 路由规则的请求生效。 

## 请求时间限制

### 问题现象

请求时间较长，链接被重置页面刷新。常见的情况是：上传、下载大文件。

### 解决方法

修改超时时间

