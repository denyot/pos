package org.eredlab.g4.rif.resource.support;

import org.eredlab.g4.rif.resource.ResourceException;

public abstract interface ResourceConfigMapping {
	public abstract ResourceConfig mapping(String paramString)
			throws ResourceException;
}