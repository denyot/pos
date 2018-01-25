package org.eredlab.g4.rif.resource;

public abstract interface ResourceManager {
	public abstract void init() throws ResourceException;

	public abstract Resource get(String paramString) throws ResourceException;

	public abstract void destroy() throws ResourceException;
}