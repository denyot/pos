package org.eredlab.g4.rif.resource;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.util.ResourceWebUtils;

public abstract class AbstractResourceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final long ONE_YEAR = 31536000000L;
	private static final long TEN_YEARS = 315360000000L;
	private final Log logger = LogFactory.getLog(getClass());
	private ResourceManager resourceManager;

	protected void doPost(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {
		doGet(pRequest, pResponse);
	}

	protected void doGet(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {
		try {
			HttpHolder.setRequest(pRequest);
			HttpHolder.setResponse(pResponse);
			handle(pRequest, pResponse);
		} finally {
			HttpHolder.setRequest(null);
			HttpHolder.setResponse(null);
		}
	}

	private void handle(HttpServletRequest pRequest,
			HttpServletResponse pResponse) throws ServletException, IOException {
		String contextPath = pRequest.getContextPath();
		String uri = pRequest.getRequestURI().substring(contextPath.length());
		Resource res = this.resourceManager.get(uri);

		pResponse.setHeader("Cache-Control", "private");

		pResponse
				.setDateHeader("Expires", new Date().getTime() + 315360000000L);

		pResponse
				.setHeader("ETag", "G4" + Long.toString(res.getLastModified()));
		pResponse.setHeader("power-by", "G4");

		StringBuffer selfMatch = new StringBuffer();
		selfMatch.append("G4");
		selfMatch.append(res.getLastModified());

		if (selfMatch.toString().equals(pRequest.getHeader("If-None-Match"))) {
			this.logger.debug("资源:" + uri + "未发生变化,直接使用客户端cache数据!");
			pResponse.setStatus(304);
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

			Date lastModified = new Date();
			pResponse.setDateHeader("Last-Modified", lastModified.getTime());

			OutputStream out = pResponse.getOutputStream();

			if (ResourceWebUtils.isSupportedGzip(pRequest)) {
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
			ServletConfig paramServletConfig);

	public void destroy() {
		super.destroy();
		this.resourceManager.destroy();
		HttpHolder.setServletContext(null);
	}

	public void init(ServletConfig pServletConfig) throws ServletException {
		super.init(pServletConfig);
		this.logger.info("正在创建G4.Resource静态资源管理器...");
		this.resourceManager = createResourceManager(pServletConfig);
		this.resourceManager.init();
		this.logger.info("创建G4.Resource静态资源管理器成功.");
	}

	public void init() throws ServletException {
		super.init();
		HttpHolder.setServletContext(getServletContext());
	}
}