package org.eredlab.g4.rif.resource.cache;

import java.util.HashMap;
import java.util.Map;
import org.eredlab.g4.rif.resource.CacheException;

public class MemoryCache extends AbstractCache {
	private Map map = new HashMap();

	public void put(Object key, Object pValue) throws CacheException {
		this.map.put(key, pValue);
	}

	public Object get(Object key) throws CacheException {
		return this.map.get(key);
	}

	public void remove(Object key) throws CacheException {
		this.map.remove(key);
	}

	public void clear() throws CacheException {
		this.map.clear();
	}
}