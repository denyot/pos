package org.eredlab.g4.rif.resource.cache;

import org.eredlab.g4.rif.resource.CacheException;

public class NoneCache extends AbstractCache {
	public void put(Object key, Object pValue) throws CacheException {
	}

	public Object get(Object key) throws CacheException {
		return null;
	}

	public void remove(Object key) throws CacheException {
	}

	public void clear() throws CacheException {
	}

	public boolean exist(Object key) throws CacheException {
		return false;
	}
}