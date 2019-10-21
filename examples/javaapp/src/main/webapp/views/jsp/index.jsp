<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
	String domain = request.getScheme() + "://" + request.getServerName() + request.getContextPath();
	String host = request.getRemoteHost();
	//    int port = request.getServerPort();
	Integer port = Integer.valueOf(System.getProperty("tomcat.connector.port"));


%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
	<title>spring-embed-tomcat-demo</title>
</head>

<body>
<h1>spring-embed-tomcat-demo</h1>
<h2><%out.print("当前服务器信息：");%></h2>
<ul>
	<li><%out.print("domain：" + domain);%></li>
	<li><%out.print("host：" + host);%></li>
	<li><%out.print("port：" + port);%></li>
</ul>
</body>
</html>
