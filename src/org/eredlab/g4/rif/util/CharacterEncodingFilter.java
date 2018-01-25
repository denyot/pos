package org.eredlab.g4.rif.util;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class CharacterEncodingFilter implements Filter {
	protected String encoding;
	protected FilterConfig filterConfig;
	protected boolean enabled;

	public CharacterEncodingFilter() {
		this.encoding = null;
		this.filterConfig = null;
		this.enabled = true;
	}

	public void destroy() {
		this.encoding = null;
		this.filterConfig = null;
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		if ((this.enabled) || (request.getCharacterEncoding() == null)) {
			String encoding = selectEncoding(request);
			if (encoding != null)
				request.setCharacterEncoding(encoding);
			response.setCharacterEncoding(encoding);
		}
		chain.doFilter(request, response);
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
		this.encoding = filterConfig.getInitParameter("encoding");
		String value = filterConfig.getInitParameter("enabled");
		if (value == null)
			this.enabled = true;
		else if (value.equalsIgnoreCase("true"))
			this.enabled = true;
		else if (value.equalsIgnoreCase("yes"))
			this.enabled = true;
		else
			this.enabled = false;
	}

	protected String selectEncoding(ServletRequest request) {
		return this.encoding;
	}
}