package io.github.dunwu;

import org.apache.catalina.Server;
import org.apache.catalina.startup.Catalina;
import org.apache.catalina.startup.Tomcat;
import org.apache.tomcat.util.digester.Digester;
import org.apache.tomcat.util.scan.Constants;

import java.io.File;

public class Main {

	private static final String CONNECTOR_PORT = "8080";

	// 以下设置轻易不要改动
	private static final String RELATIVE_DEV_BASE_DIR = "src/main/resources/tomcat/";

	private static final String RELATIVE_BASE_DIR = "WEB-INF/classes/tomcat/";

	private static final String RELATIVE_DEV_DOCBASE_DIR = "src/main/webapp";

	private static final String RELATIVE_DOCBASE_DIR = "";

	private static final String CONTEXT_PATH = "/";

	public static void main(String[] args) throws Exception {
		System.setProperty("tomcat.util.http.parser.HttpParser.requestTargetAllow", "{}|");

		System.setProperty("tomcat.host.appBase", getAbsolutePath());
		File checkFile = new File(System.getProperty("tomcat.host.appBase") + "/WEB-INF");
		if (!checkFile.exists()) {
			System.setProperty("catalina.base", getAbsolutePath() + RELATIVE_DEV_BASE_DIR);
			System.setProperty("tomcat.context.docBase", RELATIVE_DEV_DOCBASE_DIR);
		} else {
			System.setProperty("catalina.base", getAbsolutePath() + RELATIVE_BASE_DIR);
			System.setProperty("tomcat.context.docBase", RELATIVE_DOCBASE_DIR);
		}

		if (isBlank(System.getProperty("tomcat.connector.port"))) {
			System.setProperty("tomcat.connector.port", CONNECTOR_PORT);
		}
		if (isBlank(System.getProperty("tomcat.server.shutdownPort"))) {
			System.setProperty("tomcat.server.shutdownPort",
							   String.valueOf(Integer.valueOf(System.getProperty("tomcat.connector.port")) + 10000));
		}
		if (isBlank(System.getProperty("tomcat.context.path"))) {
			System.setProperty("tomcat.context.path", CONTEXT_PATH);
		}

		System.out.println("====================ENV setting====================");
		System.out.println("spring.profiles.active:" + System.getProperty("spring.profiles.active"));
		System.out.println("catalina.base:" + System.getProperty("catalina.base"));
		System.out.println("tomcat.host.appBase:" + System.getProperty("tomcat.host.appBase"));
		System.out.println("tomcat.context.docBase:" + System.getProperty("tomcat.context.docBase"));
		System.out.println("tomcat.context.path:" + System.getProperty("tomcat.context.path"));
		System.out.println("tomcat.connector.port:" + System.getProperty("tomcat.connector.port"));
		System.out.println("tomcat.server.shutdownPort:" + System.getProperty("tomcat.server.shutdownPort"));

		ExtendedTomcat tomcat = new ExtendedTomcat();
		tomcat.start();
		tomcat.getServer().await();
	}

	private static String getAbsolutePath() {
		String path = null;
		String folderPath = Main.class.getProtectionDomain().getCodeSource().getLocation().getPath();
		if (folderPath.indexOf("WEB-INF") > 0) {
			path = folderPath.substring(0, folderPath.indexOf("WEB-INF"));
		} else if (folderPath.indexOf("target") > 0) {
			path = folderPath.substring(0, folderPath.indexOf("target"));
		}
		return path;
	}

	private static boolean isBlank(String str) {
		if (str == null || str.isEmpty()) {
			return true;
		}
		return false;
	}

	static class ExtendedTomcat extends Tomcat {

		private static final String RELATIVE_SERVERXML_PATH = "/conf/server.xml";

		@Override
		public Server getServer() {
			if (server != null) {
				return server;
			}
			// 默认不开启JNDI. 开启时, 注意maven必须添加tomcat-dbcp依赖
			System.setProperty("catalina.useNaming", "false");
			ExtendedCatalina extendedCatalina = new ExtendedCatalina();

			// 覆盖默认的skip和scan jar包配置
			System.setProperty(Constants.SKIP_JARS_PROPERTY, "");
			System.setProperty(Constants.SCAN_JARS_PROPERTY, "");

			Digester digester = extendedCatalina.createStartDigester();
			digester.push(extendedCatalina);
			try {
				server = ((ExtendedCatalina) digester.parse(
					new File(System.getProperty("catalina.base") + RELATIVE_SERVERXML_PATH))).getServer();
				// 设置catalina.base和catalna.home
				this.initBaseDir();
				return server;
			} catch (Exception e) {
				System.err.println("Error while parsing server.xml" + e.getMessage());
				throw new RuntimeException(
					"server未创建,请检查server.xml(路径:" + System.getProperty("catalina.base") + RELATIVE_SERVERXML_PATH
						+ ")配置是否正确");
			}
		}


		private class ExtendedCatalina extends Catalina {

			@Override
			public Digester createStartDigester() {
				return super.createStartDigester();
			}

		}

	}

}
