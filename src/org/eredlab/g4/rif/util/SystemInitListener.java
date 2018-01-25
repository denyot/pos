package org.eredlab.g4.rif.util;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.springframework.context.ApplicationContext;

public class SystemInitListener implements ServletContextListener {
	private static Log log = LogFactory.getLog(SystemInitListener.class);
	private boolean success = true;
	private ApplicationContext wac = null;

	public void contextDestroyed(ServletContextEvent sce) {
	}

	public void contextInitialized(ServletContextEvent sce) {
		systemStartup(sce.getServletContext());
	}

	private void systemStartup(ServletContext servletContext) {
		PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
		String forceLoad = pHelper.getValue("forceLoad", "0");
		long start = System.currentTimeMillis();
		if (forceLoad.equalsIgnoreCase("0")) {
			log.info("********************************************");
			log.info("G4系统集成与应用开发平台[G4Studio]开始启动...");
			log.info("********************************************");
		}
		try {
			this.wac = SpringBeanLoader.getApplicationContext();
		} catch (Exception e) {
			this.success = false;
			e.printStackTrace();
		}
		if (this.success) {
			MonitorService monitorService = (MonitorService) SpringBeanLoader
					.getSpringBean("monitorService");
			monitorService.deleteHttpSession(new BaseDto());
			try {
				initDbType();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if (this.success) {
			log.info("系统开始启动字典装载程序...");
			log.info("开始加载字典...");
			IReader g4Reader = (IReader) SpringBeanLoader
					.getSpringBean("g4Reader");
			List codeList = null;
			try {
				codeList = g4Reader.queryForList("Resource.getCodeViewList");
				log.info("字典加载成功!");
			} catch (Exception e) {
				this.success = false;
				log.error("字典加载失败!");
				e.printStackTrace();
			}
			servletContext.setAttribute("EACODELIST", codeList);
		}
		if (this.success) {
			log.info("系统开始启动RFC数据装载程序...");
			log.info("开始加载RFC数据...");
			IReader g4Reader = (IReader) SpringBeanLoader
					.getSpringBean("g4Reader");
			List rfcList = null;
			try {
				rfcList = g4Reader.queryForList("SapRfcParam.getRfcViewList");
				log.info("RFC数据加载成功!");
			} catch (Exception e) {
				this.success = false;
				log.error("RFC数据加载失败!");
				e.printStackTrace();
			}
			servletContext.setAttribute("RFCLIST", rfcList);
		}
		if (this.success) {
			log.info("系统开始启动全局参数表装载程序...");
			log.info("开始加载全局参数表...");
			List paramList = null;
			try {
				IReader g4Reader = (IReader) SpringBeanLoader
						.getSpringBean("g4Reader");
				paramList = g4Reader.queryForList("Resource.getParamList");
				log.info("全局参数表加载成功!");
			} catch (Exception e) {
				this.success = false;
				log.error("全局参数表加载失败!");
				e.printStackTrace();
			}
			servletContext.setAttribute("EAPARAMLIST", paramList);
		}
		long timeSec = (System.currentTimeMillis() - start) / 1000L;
		log.info("********************************************");
		if (this.success) {
			log.info("G4系统集成与应用开发平台[G4Studio]启动成功[" + G4Utils.getCurrentTime()
					+ "]");
			log.info("启动总耗时: " + timeSec / 60L + "分 " + timeSec % 60L + "秒 ");
		} else {
			log.error("G4系统集成与应用开发平台[G4Studio]启动失败[" + G4Utils.getCurrentTime()
					+ "]");
			log.error("启动总耗时: " + timeSec / 60L + "分" + timeSec % 60L + "秒");
		}
		log.info("********************************************");
	}

	private void initDbType() throws SQLException {
		IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
		Connection connection = g4Dao.getConnection();
		String dbString = connection.getMetaData().getDatabaseProductName()
				.toLowerCase();
		try {
			connection.close();
		} catch (Exception e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n未正常关闭数据库连接");
			e.printStackTrace();
		}
		if (dbString.indexOf("ora") > -1) {
			System.setProperty("g4.JdbcType", "oracle");
		} else if (dbString.indexOf("mysql") > -1) {
			System.setProperty("g4.JdbcType", "mysql");
		} else {
			if (log.isErrorEnabled()) {
				log
						.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\nG4平台目前还不支持你使用的数据库产品.如需获得支持,请和我们联系!");
			}
			System.exit(0);
		}
	}
}