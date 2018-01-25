package org.eredlab.g4.rif.resource.support;

import org.eredlab.g4.rif.resource.ResourceException;
import org.eredlab.g4.rif.resource.ResourceHandler;

public abstract interface HandlerMapping {
	public abstract ResourceHandler mapping(String paramString)
			throws ResourceException;
}