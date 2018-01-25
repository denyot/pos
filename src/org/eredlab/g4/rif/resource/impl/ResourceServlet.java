package org.eredlab.g4.rif.resource.impl;

import java.io.IOException;
import java.io.InputStream;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.AbstractResourceServlet;
import org.eredlab.g4.rif.resource.ResourceManager;
import org.eredlab.g4.rif.resource.util.StringUtils;

public class ResourceServlet extends AbstractResourceServlet {
	private static final long serialVersionUID = 1L;
	private final Log logger = LogFactory.getLog(getClass());
	public static final String CONFIG_PARAM_KEY = "config";
	public static final String DEFAULT_CONFIG = "/WEB-INF/classes/g4.Resource.properties";

	protected ResourceManager createResourceManager(ServletConfig pServletConfig) {
		String config = pServletConfig.getInitParameter("config");

		String useConifg = config;

		Configuration configuration = new Configuration();
		if (!StringUtils.hasLength(config)) {
			this.logger
					.info("没有指定资源管理器的配置文件，采用默认的配置: /WEB-INF/classes/g4.Resource.properties");
			useConifg = "/WEB-INF/classes/g4.Resource.properties";
		}
		this.logger.debug("G4.Resource配置文件是:" + useConifg);
		InputStream is = getServletContext().getResourceAsStream(useConifg);
		if (is == null) {
			String MSG = "没有发现配置文件:" + useConifg + "\n" + "系统启用默认的配置!";
			this.logger.warn(MSG);
			configuration.build();
		} else {
			try {
				configuration.buildInputStream(is);
			} finally {
				try {
					if (is != null)
						is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		ResourceManager result = configuration.buildResourceManager();
		return result;
	}
}