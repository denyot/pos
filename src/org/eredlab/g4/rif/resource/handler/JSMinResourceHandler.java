package org.eredlab.g4.rif.resource.handler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.HandleResourceException;
import org.eredlab.g4.rif.resource.Resource;
import org.eredlab.g4.rif.resource.ResourceHandler;

public class JSMinResourceHandler implements ResourceHandler {
	private final Log logger = LogFactory.getLog(getClass());

	public void handle(Resource pResource) throws HandleResourceException {
		InputStream is = new ByteArrayInputStream(pResource.getTreatedData());
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		JSMin jsMin = new JSMin(is, out);
		this.logger.info("正在对资源:" + pResource.getUri() + "进行js min压缩...");
		try {
			jsMin.jsmin();
			pResource.setTreatedData(out.toByteArray());
			this.logger.info("js min资源:" + pResource.getUri() + "成功.");
		} catch (Exception ex) {
			String MSG = "js min资源:" + pResource.getUri() + "失败！";
			this.logger.warn(MSG, ex);
			return;
		}
	}
}