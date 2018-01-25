package org.eredlab.g4.rif.resource.impl;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.ResourceException;
import org.eredlab.g4.rif.resource.ResourceLoader;
import org.eredlab.g4.rif.resource.loader.ClasspathResourceLoader;
import org.eredlab.g4.rif.resource.loader.DynamicResourceLoader;
import org.eredlab.g4.rif.resource.loader.FileResourceLoader;
import org.eredlab.g4.rif.resource.loader.MD5ClasspathResourceLoader;
import org.eredlab.g4.rif.resource.support.LoaderMapping;

public class DefaultLoaderMapping implements LoaderMapping {
	private final Log logger = LogFactory.getLog(getClass());
	private static final FileResourceLoader file = new FileResourceLoader();
	private static final ClasspathResourceLoader classpath = new ClasspathResourceLoader();
	private static final MD5ClasspathResourceLoader md5classpath = new MD5ClasspathResourceLoader();
	private static final DynamicResourceLoader dynamic = new DynamicResourceLoader();

	private static Map loaders = new HashMap();

	static {
		loaders.put("file", file);
		loaders.put("classpath", classpath);
		loaders.put("md5classpath", md5classpath);
		loaders.put("dynamic", dynamic);
	}

	public void put(String pLoaderName, ResourceLoader pLoader) {
		loaders.put(pLoaderName, pLoader);
	}

	public ResourceLoader mapping(String pName) throws ResourceException {
		if (pName == null) {
			throw new NullPointerException("资源Loader名称不能为空null");
		}
		this.logger.debug("获取名字为：" + pName + "的资源Loader.");
		String handlerName = pName.toLowerCase();
		if (!loaders.containsKey(handlerName)) {
			throw new ResourceException("不存在名为：" + pName + "的资源Loader");
		}
		ResourceLoader result = (ResourceLoader) loaders.get(handlerName);
		this.logger.debug("获取到名字为：" + pName + "的资源Loader.");
		return result;
	}
}