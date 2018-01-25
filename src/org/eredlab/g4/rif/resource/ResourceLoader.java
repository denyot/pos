package org.eredlab.g4.rif.resource;

public abstract interface ResourceLoader {
	public abstract long getLastModified(String paramString);

	public abstract Resource load(String paramString)
			throws LoadResoruceException;
}