package org.eredlab.g4.rif.resource.support;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.Cache;
import org.eredlab.g4.rif.resource.Resource;
import org.eredlab.g4.rif.resource.ResourceException;
import org.eredlab.g4.rif.resource.ResourceHandler;
import org.eredlab.g4.rif.resource.ResourceLoader;
import org.eredlab.g4.rif.resource.ResourceManager;

public abstract class AbstractResourceManager implements ResourceManager {
	private final Log logger = LogFactory.getLog(getClass());
	private Cache cache;
	private CacheManager cacheManager = null;

	private boolean checkModified = true;

	private Map keyLocks = new HashMap();
	private ResourceConfigMapping resourceConfigMapping;
	private LoaderMapping loaderMapping;
	private HandlerMapping handlerMapping;
	private static final Object LOCK = new Object();

	public void init() throws ResourceException {
		if (this.cache != null)
			this.cache.init();
	}

	public void destroy() throws ResourceException {
		if (this.cache != null)
			this.cache.destroy();
	}

	private Object getKeyLock(String pUri) {
		Object result = this.keyLocks.get(pUri);
		if (result == null) {
			result = new Object();
			this.keyLocks.put(pUri, result);
		}
		return result;
	}

	public Resource get(String pUri) throws ResourceException {
		ResourceConfig resourceConfig = this.resourceConfigMapping
				.mapping(pUri);
		boolean isCache = false;
		if (resourceConfig == null) {
			String msg = "没有找到资源: " + pUri + " 对应的配置项目，请检查配置文件中是否存在与之匹配的uri模式!";
			this.logger.debug(msg);
			return null;
		}

		ResourceLoader loader = null;
		isCache = resourceConfig.isCache();
		loader = this.loaderMapping.mapping(resourceConfig.getLoaderName());

		Resource result = this.cacheManager.get(pUri);

		if (result != null) {
			if (!this.checkModified) {
				return result;
			}

			long lastModified = result.getLastModified();
			long newModified = loader.getLastModified(pUri);
			if (newModified > lastModified) {
				Object keyLock = null;
				synchronized (LOCK) {
					keyLock = getKeyLock(pUri);
				}
				synchronized (keyLock) {
					result = loadResource(loader, pUri);
					this.cacheManager.put(result);
				}
			}

			return result;
		}

		Object keyLock = null;
		synchronized (LOCK) {
			keyLock = getKeyLock(pUri);
		}
		synchronized (keyLock) {
			result = this.cacheManager.get(pUri);
			if (result != null) {
				return result;
			}
			result = loadResource(loader, pUri);

			if (isCache) {
				this.cacheManager.put(result);
			}

			return result;
		}
	}

	private Resource loadResource(ResourceLoader pLoader, String pUri) {
		Resource res = null;
		ResourceConfig resourceConfig = this.resourceConfigMapping
				.mapping(pUri);
		if (resourceConfig == null) {
			res = pLoader.load(pUri);
			return res;
		}
		res = pLoader.load(newURI(pUri, resourceConfig.getOldPrefix(),
				resourceConfig.getNewPrefix()));

		String[] handlers = resourceConfig.getHandlerNames();

		for (int i = 0; i < handlers.length; i++) {
			String handerName = handlers[i];
			ResourceHandler handler = this.handlerMapping.mapping(handerName);
			if (handler == null)
				this.logger.warn("没有找到名为:" + handerName + "的资源处理器");
			else {
				try {
					handler.handle(res);
				} catch (Exception ex) {
					this.logger.warn("对资源:" + pUri + "进行:" + handerName
							+ " 处理时出现异常!", ex);
				}
			}
		}
		return res;
	}

	private static String newURI(String pUri, String pOldPrefix,
			String pNewPrefix) {
		if (pUri == null) {
			return null;
		}
		if ((pOldPrefix == null) || (pNewPrefix == null)) {
			return pUri;
		}
		if (pUri.startsWith(pOldPrefix)) {
			return pNewPrefix + pUri.substring(pOldPrefix.length());
		}
		return pUri;
	}

	public Cache getCache() {
		return this.cache;
	}

	public void setCache(Cache cache) {
		this.cache = cache;
		this.cacheManager = new CacheManager(cache);
	}

	public HandlerMapping getHandlerMapping() {
		return this.handlerMapping;
	}

	public void setHandlerMapping(HandlerMapping handlerMapping) {
		this.handlerMapping = handlerMapping;
	}

	public LoaderMapping getLoaderMapping() {
		return this.loaderMapping;
	}

	public void setLoaderMapping(LoaderMapping loaderMapping) {
		this.loaderMapping = loaderMapping;
	}

	public ResourceConfigMapping getResourceConfigMapping() {
		return this.resourceConfigMapping;
	}

	public void setResourceConfigMapping(
			ResourceConfigMapping resourceConfigMapping) {
		this.resourceConfigMapping = resourceConfigMapping;
	}

	public boolean isCheckModified() {
		return this.checkModified;
	}

	public void setCheckModified(boolean checkModified) {
		this.checkModified = checkModified;
	}
}