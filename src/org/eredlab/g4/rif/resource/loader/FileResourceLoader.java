package org.eredlab.g4.rif.resource.loader;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.HttpHolder;
import org.eredlab.g4.rif.resource.LoadResoruceException;
import org.eredlab.g4.rif.resource.Resource;
import org.eredlab.g4.rif.resource.support.DefaultResource;

public class FileResourceLoader extends AbstractResourceLoader {
	private final Log logger = LogFactory.getLog(getClass());
	private int cacheSize;

	public FileResourceLoader() {
		this.cacheSize = 2048;
	}

	public FileResourceLoader(int pCacheSize) {
		this.cacheSize = pCacheSize;
	}

	protected String urlMapping(String pUri) {
		return pUri;
	}

	public Resource load(String pUri) throws LoadResoruceException {
		if (pUri == null) {
			throw new NullPointerException("资源URI为空");
		}
		String uri = urlMapping(pUri);
		if (this.logger.isDebugEnabled()) {
			this.logger.debug("正在装载资源文件:" + uri + " ...");
		}

		InputStream is = HttpHolder.getServletContext()
				.getResourceAsStream(uri);
		if (is == null) {
			String MSG = "没有找到资源文件:" + uri;
			this.logger.error(MSG);
			throw new NotFoundResourceException(MSG);
		}
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		byte[] buf = new byte[this.cacheSize];
		int len;
		try {
			while ((len = is.read(buf)) > 0) {
				outputStream.write(buf, 0, len);
			}
		} catch (IOException e) {
			throw new LoadResoruceException("读取资源文件:" + uri + "失败!", e);
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				this.logger.error("关闭流文件发生严重异常");
				e.printStackTrace();
			}
		}
		byte[] data = outputStream.toByteArray();
		if (this.logger.isDebugEnabled()) {
			this.logger.debug("装载资源成功:" + uri);
		}
		DefaultResource result = new DefaultResource(uri, data);
		result.setLastModified(getFileLastModified(uri));
		return result;
	}

	private long getFileLastModified(String pUri) {
		if (pUri == null) {
			String MSG = "资源URI为空";
			throw new NullPointerException("资源URI为空");
		}
		String filePath = HttpHolder.getServletContext().getRealPath(pUri);
		if (filePath == null) {
			return 0L;
		}
		File file = new File(filePath);
		if (file.canRead()) {
			return file.lastModified();
		}
		return 0L;
	}

	public int getCacheSize() {
		return this.cacheSize;
	}

	public void setCacheSize(int cacheSize) {
		this.cacheSize = cacheSize;
	}

	public long getLastModified(String pUri) {
		if (pUri == null) {
			throw new NullPointerException("资源URI为空");
		}
		String uri = urlMapping(pUri);
		return getFileLastModified(uri);
	}
}