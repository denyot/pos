package org.eredlab.g4.rif.resource;

public abstract interface Cache {
	public abstract void init() throws CacheException;

	public abstract void put(Object paramObject1, Object paramObject2)
			throws CacheException;

	public abstract Object get(Object paramObject) throws CacheException;

	public abstract void remove(Object paramObject) throws CacheException;

	public abstract void clear() throws CacheException;

	public abstract void destroy() throws CacheException;
}