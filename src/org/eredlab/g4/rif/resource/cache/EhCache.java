package org.eredlab.g4.rif.resource.cache;

import java.io.Serializable;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class EhCache implements org.eredlab.g4.rif.resource.Cache {
	private CacheManager manager;
	net.sf.ehcache.Cache ehcache = null;
	private final Log logger = LogFactory.getLog(getClass());
	private static final String G4_RESOURCE_GROUP = "g4ResourceCache";

	public void init() throws org.eredlab.g4.rif.resource.CacheException {
		try {
			this.manager = new CacheManager();
			this.ehcache = this.manager.getCache("g4ResourceCache");
			if (this.ehcache == null) {
				this.logger
						.warn("Could not find configuration [g4ResourceCache]; using defaults.");
				this.manager.addCache("g4ResourceCache");
				this.ehcache = this.manager.getCache("g4ResourceCache");
				this.logger.debug("started EHCache region: g4ResourceCache");
			}
		} catch (net.sf.ehcache.CacheException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		}
	}

	public void put(Object key, Object pValue)
			throws org.eredlab.g4.rif.resource.CacheException {
		try {
			Element element = new Element((Serializable) key,
					(Serializable) pValue);
			this.ehcache.put(element);
		} catch (IllegalArgumentException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		} catch (IllegalStateException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		}
	}

	public Object get(Object key)
			throws org.eredlab.g4.rif.resource.CacheException {
		try {
			if (key == null) {
				return null;
			}
			Element element = this.ehcache.get((Serializable) key);
			if (element == null) {
				if (this.logger.isDebugEnabled()) {
					this.logger.debug("Element for " + key + " is null");
				}
				return null;
			}
			return element.getValue();
		} catch (net.sf.ehcache.CacheException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		}
	}

	public void remove(Object key)
			throws org.eredlab.g4.rif.resource.CacheException {
		try {
			this.ehcache.remove((Serializable) key);
		} catch (ClassCastException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		} catch (IllegalStateException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		}
	}

	public void clear() throws org.eredlab.g4.rif.resource.CacheException {
		try {
			this.ehcache.removeAll();
		} catch (IllegalStateException e) {
			throw new org.eredlab.g4.rif.resource.CacheException(e);
		}
	}

	public void destroy() throws org.eredlab.g4.rif.resource.CacheException {
		if (this.manager != null)
			this.manager.shutdown();
	}
}