package org.eredlab.g4.rif.resource.support;

import org.eredlab.g4.rif.resource.ResourceException;
import org.eredlab.g4.rif.resource.ResourceLoader;

public abstract interface LoaderMapping {
	public abstract ResourceLoader mapping(String paramString)
			throws ResourceException;
}