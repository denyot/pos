package org.eredlab.g4.rif.resource.loader;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.LoadResoruceException;
import org.eredlab.g4.rif.resource.Resource;
import org.eredlab.g4.rif.resource.support.DefaultResource;
import org.eredlab.g4.rif.resource.util.ClassUtils;

public class ClasspathResourceLoader extends AbstractResourceLoader {
	private final Log logger = LogFactory.getLog(getClass());
	private int cacheSize;

	public ClasspathResourceLoader() {
		this.cacheSize = 2048;
	}

	public ClasspathResourceLoader(int pCacheSize) {
		this.cacheSize = pCacheSize;
	}

	public long getLastModified(String pUri) {
		return 1L;
	}

	protected String urlMapping(String pUri) {
		return pUri;
	}

	public Resource load(String pUri) throws LoadResoruceException {
		if (pUri == null) {
			throw new NullPointerException("资源URI为空");
		}
		if (this.logger.isDebugEnabled()) {
			this.logger.debug("正在装载资源文件:" + pUri + " ...");
		}

		String uri = urlMapping(pUri);
		InputStream is = ClassUtils.getResourceAsStream(getClass(), uri);
		if (is == null) {
			String MSG = "没有找到资源文件:" + uri;
			this.logger.debug(MSG);
			throw new NotFoundResourceException(MSG);
		}
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		byte[] buf = new byte[this.cacheSize];
		try {
			int len;
			while ((len = is.read(buf)) > 0) {
				//int len;
				outputStream.write(buf, 0, len);
			}
		} catch (IOException e) {
			throw new LoadResoruceException("读取资源文件:" + uri + "失败!", e);
		}
		int len;
		byte[] data = outputStream.toByteArray();
		if (this.logger.isDebugEnabled()) {
			this.logger.debug("装载资源成功:" + uri);
		}
		DefaultResource result = new DefaultResource(uri, data);
		result.setLastModified(0L);
		return result;
	}

	public int getCacheSize() {
		return this.cacheSize;
	}

	public void setCacheSize(int cacheSize) {
		this.cacheSize = cacheSize;
	}
}