package org.eredlab.g4.rif.resource.handler;

import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.HandleResourceException;
import org.eredlab.g4.rif.resource.HttpHolder;
import org.eredlab.g4.rif.resource.Resource;
import org.eredlab.g4.rif.resource.ResourceHandler;

public class CSSMinResourceHandler implements ResourceHandler {
	private final Log logger = LogFactory.getLog(getClass());
	private static final int LINEBREAK_AFTER_CHARACTERS = 8000;

	public void handle(Resource pResource) throws HandleResourceException {
		String charset = pResource.getCharset();
		if (charset == null) {
			charset = HttpHolder.getResponse().getCharacterEncoding();
		}
		this.logger.info("正在对资源:" + pResource.getUri() + "进行css min压缩...");
		try {
			InputStreamReader isr = new InputStreamReader(
					new ByteArrayInputStream(pResource.getTreatedData()),
					charset);
			CssCompressor cssc = new CssCompressor(isr);
			StringWriter sw = new StringWriter();
			cssc.compress(sw, 8000);
			sw.flush();
			sw.toString();
			sw.close();
			this.logger.info("css min资源:" + pResource.getUri() + "成功.");
		} catch (Exception ex) {
			String MSG = "css min资源:" + pResource.getUri() + "失败！";
			this.logger.warn(MSG, ex);
			return;
		}
	}
}