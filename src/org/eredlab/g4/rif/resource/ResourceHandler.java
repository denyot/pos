package org.eredlab.g4.rif.resource;

public abstract interface ResourceHandler {
	public abstract void handle(Resource paramResource)
			throws HandleResourceException;
}