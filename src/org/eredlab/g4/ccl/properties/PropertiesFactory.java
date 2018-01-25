package org.eredlab.g4.ccl.properties;

import java.io.InputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

public class PropertiesFactory {
	private static Log log = LogFactory.getLog(PropertiesFactory.class);

	private static Dto container = new BaseDto();

	static {
		ClassLoader classLoader = Thread.currentThread()
				.getContextClassLoader();
		if (classLoader == null) {
			classLoader = PropertiesFactory.class.getClassLoader();
		}
		try {
			InputStream is = classLoader
					.getResourceAsStream("global.g4.properties");
			PropertiesHelper ph = new PropertiesHelper(is);
			container.put("g4", ph);
		} catch (Exception e1) {
			log
					.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n加载属性文件global.g4.properties出错!");
			e1.printStackTrace();
		}
		try {
			InputStream is = classLoader
					.getResourceAsStream("global.app.properties");
			PropertiesHelper ph = new PropertiesHelper(is);
			container.put("app", ph);
		} catch (Exception e1) {
			log
					.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n加载属性文件global.app.properties出错!");
			e1.printStackTrace();
		}
	}

	public static PropertiesHelper getPropertiesHelper(String pFile) {
		PropertiesHelper ph = (PropertiesHelper) container.get(pFile);
		return ph;
	}
}