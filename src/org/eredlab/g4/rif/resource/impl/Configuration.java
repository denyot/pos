package org.eredlab.g4.rif.resource.impl;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.Cache;
import org.eredlab.g4.rif.resource.ResourceHandler;
import org.eredlab.g4.rif.resource.ResourceLoader;
import org.eredlab.g4.rif.resource.ResourceManager;
import org.eredlab.g4.rif.resource.cache.MemoryCache;
import org.eredlab.g4.rif.resource.support.HandlerMapping;
import org.eredlab.g4.rif.resource.support.LoaderMapping;
import org.eredlab.g4.rif.resource.support.ResourceConfigMapping;
import org.eredlab.g4.rif.resource.util.AntPathMatcher;
import org.eredlab.g4.rif.resource.util.StringUtils;

public class Configuration {
	private static final String DEFAULT_RESOURCE = "";
	private final Log logger = LogFactory.getLog(Configuration.class);

	private Properties properites = null;
	private static final String CACHE_KEY = "resource.cache";
	private static final String LOADER_KEY = "resource.loaders";
	private static final String HANDLER_KEY = "resource.handlers";
	private static final String MAPPING_KEY = "resource.uriMappings";
	private static final String CHECK_MODIFIED_KEY = "resouce.checkModified";
	private static final String CLASS_POSTFIX = "class";
	private AntPathMatcher uriPatternMatcher = new AntPathMatcher();
	private static final String URI_PATTERN = "*.uriPattern";
	private static final String INCLUDE_PATTERN = "*.includes";

	public Configuration() {
		this.properites = new Properties();
	}

	public void build() throws ConfigeException {
		buildResource("");
	}

	public void buildFile(String pFile) throws ConfigeException {
		FileInputStream fileIS = null;
		try {
			fileIS = new FileInputStream(pFile);
		} catch (FileNotFoundException e) {
			String MSG = "打开资源文件:" + pFile + "失败!";
			this.logger.error(MSG, e);
			throw new ConfigeException(MSG, e);
		}
		BufferedInputStream bufferedIS = new BufferedInputStream(fileIS);
		String MSG;
		try {
			buildInputStream(bufferedIS);
		} finally {
			try {
				fileIS.close();
				bufferedIS.close();
			} catch (IOException e) {
				MSG = "关闭资源文件:" + pFile + "失败!";
				this.logger.warn(MSG, e);
			}
		}
	}

	public void buildResource(String pResource) throws ConfigeException {
		InputStream is = getClass().getClassLoader().getResourceAsStream(
				pResource);
		BufferedInputStream bufferedIS = new BufferedInputStream(is);
		String MSG;
		try {
			buildInputStream(bufferedIS);
		} finally {
			try {
				is.close();
				bufferedIS.close();
			} catch (IOException e) {
				MSG = "关闭资源文件:" + pResource + "失败!";
				this.logger.warn(MSG, e);
			}
		}
	}

	public void buildProperties(Properties pProperties) throws ConfigeException {
		this.properites.clear();
		this.properites.putAll(pProperties);
	}

	public void buildInputStream(InputStream pIS) throws ConfigeException {
		this.properites.clear();
		try {
			this.properites.load(pIS);
		} catch (IOException e) {
			String MSG = "读取配置文件失败!";
			this.logger.error("读取配置文件失败!", e);
			throw new ConfigeException("读取配置文件失败!", e);
		}
	}

	public ResourceManager buildResourceManager() throws ConfigeException {
		DefaultResourceManager result = new DefaultResourceManager();
		result.setCache(createCache());
		result.setLoaderMapping(createLoaderMapping());
		result.setHandlerMapping(createHandlerMapping());
		result.setResourceConfigMapping(createResourceConfigMapping());
		String checkedModified = this.properites
				.getProperty("resouce.checkModified");
		boolean isChecked = Boolean.valueOf(checkedModified).booleanValue();
		result.setCheckModified(isChecked);
		if ((!isChecked) && (this.logger.isWarnEnabled())) {
			this.logger
					.warn("没有启用修改检查，当资源文件修改后,客户端获取到的还是之前的信息，不会变化.\n要启用修改检查，设置配置属性:resouce.checkModified = true 即可.");
		}

		return result;
	}

	private boolean isEmpty(String pValue) {
		if (pValue == null) {
			return true;
		}
		if ("".equals(pValue.trim())) {
			return true;
		}
		return false;
	}

	private void setProprty(Object pObj, String pProperty, String pValue)
			throws ConfigeException {
		try {
			BeanUtils.setProperty(pObj, pProperty, pValue);
		} catch (Exception ex) {
			String MSG = "设置对象:" + pObj.getClass().getName() + "的" + pProperty
					+ " 属性为" + pValue + "时出现异常";
			this.logger.error(MSG, ex);
			throw new ConfigeException(MSG, ex);
		}
	}

	private Object createObject(String pObjectKeyPrefix, Class pDestClass)
			throws ConfigeException {
		String classKey = pObjectKeyPrefix + "class";
		String className = this.properites.getProperty(classKey);
		if (className == null) {
			String MSG = "配置文件中没有定义属性：" + classKey + ",请仔细检查配置文件！";
			this.logger.error(MSG);
			throw new ConfigeException(MSG);
		}
		Object obj = ObjectFactory.getObject(className);
		if (!pDestClass.isInstance(obj)) {
			throw new ConfigeException(className + "未实现接口:"
					+ pDestClass.getName());
		}
		Map properties = getObjectProperties(pObjectKeyPrefix);
		Iterator propertiesIterator = properties.keySet().iterator();
		while (propertiesIterator.hasNext()) {
			String property = (String) propertiesIterator.next();
			String value = (String) properties.get(property);
			setProprty(obj, property, value);
		}

		return obj;
	}

	private Map getObjectProperties(String pObjectKeyPrefix) {
		Map result = new LinkedHashMap();
		Iterator keyIterator = this.properites.keySet().iterator();
		String classKey = pObjectKeyPrefix + "class";
		while (keyIterator.hasNext()) {
			String key = (String) keyIterator.next();
			boolean isClassKey = key.startsWith(classKey);
			if (!isClassKey) {
				if (key.startsWith(pObjectKeyPrefix)) {
					String value = this.properites.getProperty(key);
					result.put(key.substring(pObjectKeyPrefix.length()), value);
				}
			}
		}
		return result;
	}

	private Cache createCache() throws ConfigeException {
		String cacheName = this.properites.getProperty("resource.cache");
		if (isEmpty(cacheName)) {
			this.logger.info("没有发现cache配置，采用默认的MemoryCache");
			return new MemoryCache();
		}
		return (Cache) createObject(cacheName + ".", Cache.class);
	}

	private String[] toArray(String pStr) {
		if (pStr == null) {
			return new String[0];
		}
		return StringUtils.tokenizeToStringArray(pStr, ";,");
	}

	private LoaderMapping createLoaderMapping() throws ConfigeException {
		DefaultLoaderMapping result = new DefaultLoaderMapping();
		String loaderNames = this.properites.getProperty("resource.loaders");
		if (isEmpty(loaderNames)) {
			return result;
		}
		String[] loaderNameArray = toArray(loaderNames);
		for (int i = 0; i < loaderNameArray.length; i++) {
			String loaderName = loaderNameArray[i];
			result.put(loaderName, (ResourceLoader) createObject(loaderName
					+ ".", ResourceLoader.class));
		}
		return result;
	}

	private HandlerMapping createHandlerMapping() throws ConfigeException {
		DefaultHandlerMapping result = new DefaultHandlerMapping();
		String handlerNames = this.properites.getProperty("resource.handlers");
		if (isEmpty(handlerNames)) {
			return result;
		}
		String[] handlerNameArray = toArray(handlerNames);
		for (int i = 0; i < handlerNameArray.length; i++) {
			String handlerName = handlerNameArray[i];
			result.put(handlerName, (ResourceHandler) createObject(handlerName
					+ ".", ResourceHandler.class));
		}
		return result;
	}

	private String getUriMappingNames() {
		StringBuffer sb = new StringBuffer();
		Iterator propIterator = this.properites.keySet().iterator();
		while (propIterator.hasNext()) {
			Object key = propIterator.next();
			if ((this.uriPatternMatcher.match("*.uriPattern", (String) key))
					|| (this.uriPatternMatcher
							.match("*.includes", (String) key))) {
				String uriMappingName = getUriMappingName((String) key);
				sb.append(uriMappingName).append(";,");
			}
		}
		return sb.toString();
	}

	private String getUriMappingName(String pKey) {
		int index = pKey.indexOf(".");
		if (index == -1) {
			return null;
		}
		return pKey.substring(0, index);
	}

	private ResourceConfigMapping createResourceConfigMapping()
			throws ConfigeException {
		DefaultResourceConfigMapping result = new DefaultResourceConfigMapping();
		String uriMappingNames = getUriMappingNames();
		if (isEmpty(uriMappingNames)) {
			return result;
		}
		String[] uriMappingNameArray = toArray(uriMappingNames);
		List uriMappings = new ArrayList();
		for (int i = 0; i < uriMappingNameArray.length; i++) {
			String uriMappingName = uriMappingNameArray[i];
			UriMapping uriMapping = new UriMapping();
			Map properties = getObjectProperties(uriMappingName + ".");
			Iterator propertiesIterator = properties.keySet().iterator();
			while (propertiesIterator.hasNext()) {
				String property = (String) propertiesIterator.next();
				String value = (String) properties.get(property);
				setProprty(uriMapping, property, value);
			}
			uriMappings.add(uriMapping);
		}
		result.setUriMappings((UriMapping[]) uriMappings
				.toArray(new UriMapping[0]));
		return result;
	}

	private static class ObjectFactory {
		public static Object getObject(String pClass) {
			try {
				return Class.forName(pClass).newInstance();
			} catch (Exception e) {
				throw new RuntimeException("创建类对象失败!" + pClass, e);
			}
		}
	}
}