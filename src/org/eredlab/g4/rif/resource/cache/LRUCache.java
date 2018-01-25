package org.eredlab.g4.rif.resource.cache;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import org.eredlab.g4.rif.resource.CacheException;

public class LRUCache extends AbstractCache {
	private final Map cacheMap = new HashMap();

	private final LinkedList keyList = new LinkedList();

	private int maxSize = 100;

	public void setMaxSize(int maxSize) {
		if (maxSize < 0) {
			throw new IllegalArgumentException("maxSize必须大于0!当前值是:" + maxSize);
		}
		this.maxSize = maxSize;
	}

	public void put(Object key, Object value) throws CacheException {
		this.cacheMap.put(key, value);
		this.keyList.add(key);
		if (this.keyList.size() > this.maxSize)
			try {
				Object oldKey = this.keyList.removeFirst();
				this.cacheMap.remove(oldKey);
			} catch (IndexOutOfBoundsException localIndexOutOfBoundsException) {
			}
	}

	public Object get(Object key) throws CacheException {
		Object result = this.cacheMap.get(key);
		this.keyList.remove(key);
		if (result != null) {
			this.keyList.add(key);
		}
		return result;
	}

	public void remove(Object key) throws CacheException {
		this.keyList.remove(key);
		this.cacheMap.remove(key);
	}

	public void clear() throws CacheException {
		this.cacheMap.clear();
		this.keyList.clear();
	}

	public String toString() {
		return "LRUCache: " + this.maxSize;
	}
}