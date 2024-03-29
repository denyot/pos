package org.eredlab.g4.rif.resource.impl;

import java.io.IOException;
import java.io.PrintStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class CacheResourceFilter implements Filter {
	private static final long serialVersionUID = 1L;
	private final Log logger = LogFactory.getLog(getClass());

	private FilterConfig filterConfig = null;

	public void destroy() {
	}

	public void doFilter(ServletRequest pServletRequest,
			ServletResponse pServletResponse, FilterChain pFilterChain)
			throws IOException, ServletException {
	}

	public void init(FilterConfig pFilterConfig) throws ServletException {
		this.filterConfig = pFilterConfig;
	}

	public static void main(String[] args) {
		Pattern p = Pattern.compile("(url(\\p{Blank})*)(\\()(([^\\)])*)(\\))");
		Matcher m = p
				.matcher(".x-tip-br{background: url  ( ../images/default/form/error-tip-corners.gif  ) no-repeat right -6px;}");
		StringBuffer sb = new StringBuffer();
		while (m.find()) {
			String x = m.group(4).trim() + "?timestamp=13";
			m.appendReplacement(sb, "$1$3" + x + "$6");
		}
		m.appendTail(sb);
		System.err.println(sb.toString());
	}
}