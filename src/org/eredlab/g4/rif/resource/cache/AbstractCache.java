package org.eredlab.g4.rif.resource.cache;

import org.eredlab.g4.rif.resource.Cache;
import org.eredlab.g4.rif.resource.CacheException;

public abstract class AbstractCache implements Cache {
	public void init() throws CacheException {
	}

	public void destroy() throws CacheException {
	}
}