package org.eredlab.g4.rif.util;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import org.apache.log4j.PropertyConfigurator;
import org.eredlab.g4.ccl.util.G4Utils;

public class Log4jInitServlet extends HttpServlet {
	public void init(ServletConfig config) throws ServletException {
		String root = config.getServletContext().getRealPath("/");
		String log4jLocation = G4Utils.getFullPathRelateClass(
				"../../../../../log4j.properties", getClass());
		System.setProperty("webRoot", root);
		if (G4Utils.isNotEmpty(log4jLocation))
			PropertyConfigurator.configure(log4jLocation);
	}
}