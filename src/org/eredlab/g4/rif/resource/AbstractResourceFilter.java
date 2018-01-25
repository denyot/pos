package org.eredlab.g4.rif.resource;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.util.ResourceWebUtils;

public abstract class AbstractResourceFilter implements Filter {
	private static final long serialVersionUID = 1L;
	private final Log logger = LogFactory.getLog(getClass());
	private static final long ONE_YEAR = 31536000000L;
	private static final long TEN_YEARS = 315360000000L;
	private ResourceManager resourceManager;
	public static final String PREFIX_MAPPING_PARAM_KEY = "prefixMapping";
	private List oldPrefixs = new ArrayList();
	private List newPrefixs = new ArrayList();

	private FilterConfig filterConfig = null;

	public void destroy() {
		this.resourceManager.destroy();
		HttpHolder.setServletContext(null);
	}

	public void doFilter(ServletRequest pRequest, ServletResponse pResponse,
			FilterChain pFilterChain) throws IOException, ServletException {
		try {
			HttpHolder.setRequest((HttpServletRequest) pRequest);
			HttpHolder.setResponse((HttpServletResponse) pResponse);
			HttpHolder.setFilterChain(pFilterChain);
			executeFilter(pRequest, pResponse, pFilterChain);
		} finally {
			HttpHolder.setRequest(null);
			HttpHolder.setResponse(null);
			HttpHolder.setFilterChain(null);
		}
	}

	protected void executeFilter(ServletRequest pRequest,
			ServletResponse pResponse, FilterChain pFilterChain)
			throws IOException, ServletException {
		handle((HttpServletRequest) pRequest, (HttpServletResponse) pResponse,
				pFilterChain);
	}

	private String newURI(String pUri) {
		if (pUri == null) {
			return null;
		}
		for (int i = 0; i < this.oldPrefixs.size(); i++) {
			String oldPrefix = (String) this.oldPrefixs.get(i);
			if (pUri.startsWith(oldPrefix)) {
				String newPrefix = (String) this.newPrefixs.get(i);
				if (newPrefix != null) {
					return newPrefix + pUri.substring(oldPrefix.length());
				}
			}
		}
		return pUri;
	}

	private void handle(HttpServletRequest pRequest,
			HttpServletResponse pResponse, FilterChain pFilterChain)
			throws ServletException, IOException {
		String contextPath = pRequest.getContextPath();
		String uri = pRequest.getRequestURI().substring(contextPath.length());
		Resource res = this.resourceManager.get(uri);

		if (res == null) {
			pFilterChain.doFilter(pRequest, pResponse);
			return;
		}

		pResponse.setDateHeader("Expires", 0L);

		String token = '"' + res.getResourceCode() + '"';
		pResponse.setHeader("ETag", token);
		pResponse.setHeader("power-by", "G4");

		String ifNoneMatch = pRequest.getHeader("If-None-Match");
		String ifModifiedSince = pRequest.getHeader("If-Modified-Since");

		if (this.logger.isDebugEnabled()) {
			this.logger.debug("ifNoneMatch=" + ifNoneMatch);
			this.logger.debug("ifModifiedSince=" + ifModifiedSince);
		}

		boolean isNotModified = false;
		if (token.equals(ifNoneMatch)) {
			isNotModified = true;
		} else if (res.getLastModified() != 0L) {
			long lastModified = pRequest.getDateHeader("If-Modified-Since");
			if (lastModified == res.getLastModified())
				isNotModified = true;
			else {
				isNotModified = false;
			}

		}

		if (isNotModified) {
			this.logger.debug("资源:" + uri + "未发生变化,直接使用客户端cache数据!");
			pResponse.sendError(304);
			pResponse.setHeader("Last-Modified", pRequest
					.getHeader("If-Modified-Since"));
		} else {
			String contextType = res.getMimeType();
			if (contextType != null) {
				pResponse.setContentType(contextType);
			}
			String charset = res.getCharset();
			if (charset != null) {
				pResponse.setCharacterEncoding(charset);
			}

			pResponse.setDateHeader("Last-Modified", res.getLastModified());

			OutputStream out = pResponse.getOutputStream();

			boolean isSupportedGzip = ResourceWebUtils
					.isSupportedGzip(pRequest);
			if ((isSupportedGzip) && (ResourceWebUtils.isIE6(pRequest))) {
				isSupportedGzip = res.getLastModified() != 0L;
			}

			if (isSupportedGzip) {
				if (res.isGzip()) {
					ResourceWebUtils.setGzipHeader(pResponse);
					out.write(res.getTreatedData());
				} else {
					out.write(res.getTreatedData());
				}
			} else if (res.isGzip())
				out.write(res.getData());
			else {
				out.write(res.getTreatedData());
			}

			out.flush();
		}
	}

	protected abstract ResourceManager createResourceManager(
			FilterConfig paramFilterConfig);

	public void init(FilterConfig pFilterConfig) throws ServletException {
		this.filterConfig = pFilterConfig;
		HttpHolder.setServletContext(pFilterConfig.getServletContext());
		this.logger.info("正在创建G4.Resource静态资源管理器...");
		this.resourceManager = createResourceManager(pFilterConfig);
		this.resourceManager.init();
		this.logger.info("创建G4.Resource静态资源管理器成功.");
	}
}