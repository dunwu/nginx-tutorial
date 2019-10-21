package io.github.dunwu.filter;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Pattern;

/**
 * 跨域过滤器，根据正则进行匹配
 */
public class CorsFilter implements Filter {

	private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);

	private final String ORIGIN_KEY = "Origin";

	private String regex;

	private String headerKey;

	private String protocol = "http";

	public void init(FilterConfig filterConfig) {
		// 取配置参数
		regex = filterConfig.getInitParameter("regex");
		headerKey = filterConfig.getInitParameter("headerKey");
		String protocolVal = filterConfig.getInitParameter("protocol");
		if (StringUtils.isNotBlank(protocolVal)) {
			if (StringUtils.equalsIgnoreCase("http", protocolVal) || StringUtils.equalsIgnoreCase("https",
																								  protocolVal)) {
				protocol = protocolVal.toLowerCase();
			} else {
				logger.error("CorsFilter 配置参数 protocol 非法，仍使用默认值 http");
			}
		}
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
		throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		if (StringUtils.isBlank(regex) || StringUtils.isBlank(headerKey)) {
			throw new ServletException("读取跨域过滤器的配置参数失败");
		}

		// 读取请求地址的域
		String domain = httpRequest.getHeader(headerKey);
		String origin = httpRequest.getHeader(ORIGIN_KEY);

		if (StringUtils.isBlank(origin)) {
			logger.debug("origin 为空, 跳过检查");
			chain.doFilter(httpRequest, httpResponse);
			return;
		}

		if (StringUtils.isBlank(domain)) {
			logger.debug("domain 为空, 跳过检查");
			chain.doFilter(httpRequest, httpResponse);
			return;
		}

		if (origin.toLowerCase().contains(domain.toLowerCase())) {
			// 判断请求方和应答方是否同为 http 或 https
			// 如果相同，这里视为同源；否则，视为跨域
			if (origin.startsWith(protocol)) {
				logger.debug("domain={}, origin={}, 二者协议相同，且域名同源，跳过检查", domain, origin);
				chain.doFilter(httpRequest, httpResponse);
				return;
			}
		}

		Pattern pattern = Pattern.compile(regex);
		if (!pattern.matcher(origin).matches()) {
			logger.warn("客户端域 origin={} 不在跨域白名单中", origin);
			httpResponse.sendError(403, "客户端域不在跨域白名单中");
			throw new ServletException("客户端域不在跨域白名单中");
		}

		logger.debug("对 origin={} 放开跨域限制", origin);
		httpResponse.addHeader("Access-Control-Allow-Origin", origin);
		httpResponse.addHeader("Access-Control-Allow-Credentials", "true");
		httpResponse.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
		httpResponse.addHeader("Access-Control-Allow-Headers",
							   "DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since,"
								   + " Cache-Control, Content-Type, Content-Range, Range, X-CSRF-TOKEN");
		httpResponse.addHeader("Access-Control-Expose-Headers",
							   "DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since,"
								   + " Cache-Control, Content-Type, Content-Range, Range");
		if (httpRequest.getMethod().equals("OPTIONS")) {
			httpResponse.setStatus(HttpServletResponse.SC_OK);
			return;
		}
		chain.doFilter(httpRequest, httpResponse);
	}

	public void destroy() {
	}

}
