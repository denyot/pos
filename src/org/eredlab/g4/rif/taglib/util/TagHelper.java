package org.eredlab.g4.rif.taglib.util;

import javax.servlet.jsp.tagext.BodyContent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.util.G4Utils;

public class TagHelper {
	private static Log log = LogFactory.getLog(TagHelper.class);

	public static String getTemplatePath(String pPath) {
		if (G4Utils.isEmpty(pPath))
			return "";
		String templatePath = "";
		String path = pPath.replace('.', '/');
		String[] packageUnits = path.split("/");
		String className = packageUnits[(packageUnits.length - 1)];
		templatePath = path.substring(0, path.length() - className.length());
		templatePath = templatePath + "template/" + className + ".tpl";
		log.debug("模板文件路径:" + templatePath);
		return templatePath;
	}

	public static String getTemplatePath(String pPath, String pFileName) {
		if (G4Utils.isEmpty(pPath))
			return "";
		String templatePath = "";
		String path = pPath.replace('.', '/');
		String[] packageUnits = path.split("/");
		String className = packageUnits[(packageUnits.length - 1)];
		templatePath = path.substring(0, path.length() - className.length());
		templatePath = templatePath + "template/" + pFileName;
		log.debug("模板文件路径:" + templatePath);
		return templatePath;
	}

	public static String formatBodyContent(BodyContent pBodyContent) {
		if (G4Utils.isEmpty(pBodyContent))
			return "";
		return pBodyContent.getString().trim();
	}

	public static String replaceStringTemplate(String pStr) {
		if (G4Utils.isEmpty(pStr))
			return "";
		pStr = pStr.replace('*', '"');

		return pStr;
	}

	public static String checkEmpty(String pString) {
		return G4Utils.isEmpty(pString) ? "off" : pString;
	}
}